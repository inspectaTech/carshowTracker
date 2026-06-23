import { createFileRoute } from '@tanstack/react-router'
import { json } from '@tanstack/react-start'
import { existsSync, unlinkSync } from 'fs'
import { join } from 'path'
import { isDeleteAllowed, guardMessage } from '../lib/env-guard'

export const Route = createFileRoute('/api/images/$id')({
  server: {
    handlers: {
      DELETE: async ({ params }) => {
        try {
          if (!isDeleteAllowed()) {
            return json(guardMessage('Image deletion'))
          }

          // TODO: Get userId from Auth.js session
          const userId = 'user_001'
          const imageId = params.id

          const { dataSource } = await import('../lib/data-source')
          const status = await dataSource.getDataSourceStatus()

          if (!status.dbAvailable) {
            return json({
              success: false,
              message: 'Image deletion requires MongoDB (read-only in JSON fallback mode)',
            })
          }

          const { connectToDatabase } = await import('../lib/db')
          const { db } = await connectToDatabase()

          // Find the image document
          const image = await db.collection('images').findOne({ _id: imageId })
          if (!image) {
            return json({ success: false, message: 'Image not found' })
          }

          // Ownership check
          if (image.userId !== userId) {
            return json({ success: false, message: 'Unauthorized' })
          }

          // Delete the file from disk
          const filePath = join(process.cwd(), 'public', image.url)
          if (existsSync(filePath)) {
            unlinkSync(filePath)
          }

          // Delete the document
          await db.collection('images').deleteOne({ _id: imageId })

          return json({
            success: true,
            message: 'Image deleted successfully',
          })
        } catch (error) {
          return json({
            success: false,
            message: `Failed to delete image: ${error.message}`,
          })
        }
      },
    },
  },
})
