import { createFileRoute } from '@tanstack/react-router'
import { json } from '@tanstack/react-start'
import { isUploadAllowed, guardMessage } from '../lib/env-guard'

export const Route = createFileRoute('/api/images')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          if (!isUploadAllowed()) {
            return json(guardMessage('Image listing'))
          }

          // TODO: Get userId from Auth.js session
          const userId = 'user_001'
          const url = new URL(request.url)
          const type = url.searchParams.get('type')
          const page = parseInt(url.searchParams.get('page') || '1', 10)
          const limit = parseInt(url.searchParams.get('limit') || '20', 10)

          const { dataSource } = await import('../lib/data-source')
          const status = await dataSource.getDataSourceStatus()

          let images = []

          if (status.dbAvailable) {
            const { connectToDatabase } = await import('../lib/db')
            const { db } = await connectToDatabase()
            const query = { userId }
            if (type) query.type = type

            images = await db.collection('images')
              .find(query)
              .sort({ uploadedAt: -1 })
              .skip((page - 1) * limit)
              .limit(limit)
              .toArray()
          } else {
            const sampleData = (await import('../data/dashboard-sample.json')).default
            images = sampleData.images
              .filter((img) => img.userId === userId && (!type || img.type === type))
              .slice((page - 1) * limit, page * limit)
          }

          return json({
            success: true,
            images,
            page,
            limit,
            source: status.source,
          })
        } catch (error) {
          return json({
            success: false,
            message: `Failed to fetch images: ${error.message}`,
            images: [],
          })
        }
      },
    },
  },
})
