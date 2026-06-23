import { createFileRoute } from '@tanstack/react-router'
import { json } from '@tanstack/react-start'
import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'
import { randomUUID } from 'crypto'
import { isUploadAllowed, guardMessage } from '../lib/env-guard'

export const Route = createFileRoute('/api/upload')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          if (!isUploadAllowed()) {
            return json(guardMessage('File upload'))
          }

          // TODO: Get userId from Auth.js session
          const userId = 'user_001'

          const formData = await request.formData()
          const file = formData.get('file')
          const imageType = formData.get('type') || 'activity_photo' // avatar | car_photo | activity_photo

          if (!file || !file.name) {
            return json({ success: false, message: 'No file provided' })
          }

          // Validate file type
          const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
          if (!allowedTypes.includes(file.type)) {
            return json({
              success: false,
              message: 'Invalid file type. Allowed: JPEG, PNG, WebP, GIF',
            })
          }

          // Validate file size (max 10MB)
          const maxSize = 10 * 1024 * 1024
          if (file.size > maxSize) {
            return json({ success: false, message: 'File too large. Maximum 10MB' })
          }

          // Determine subdirectory based on type
          let subDir = 'photos'
          if (imageType === 'avatar') subDir = 'avatars'
          else if (imageType === 'car_photo') subDir = 'cars'

          // Build path: /uploads/{userId}/{subDir}/{uuid}.{ext}
          const ext = file.name.split('.').pop()
          const uuid = randomUUID()
          const relativePath = `/uploads/${userId}/${subDir}/${uuid}.${ext}`
          const absoluteDir = join(process.cwd(), 'public', 'uploads', userId, subDir)
          const absolutePath = join(process.cwd(), 'public', relativePath)

          // Ensure directory exists
          if (!existsSync(absoluteDir)) {
            mkdirSync(absoluteDir, { recursive: true })
          }

          // Write file
          const buffer = Buffer.from(await file.arrayBuffer())
          writeFileSync(absolutePath, buffer)

          // Save metadata to DB (or JSON fallback)
          const { dataSource } = await import('../lib/data-source')
          const status = await dataSource.getDataSourceStatus()

          if (status.dbAvailable) {
            const { connectToDatabase } = await import('../lib/db')
            const { db } = await connectToDatabase()

            await db.collection('images').insertOne({
              userId,
              url: relativePath,
              type: imageType,
              originalName: file.name,
              fileSize: file.size,
              mimeType: file.type,
              uploadedAt: new Date(),
            })
          }

          return json({
            success: true,
            url: relativePath,
            message: 'File uploaded successfully',
          })
        } catch (error) {
          return json({
            success: false,
            message: `Upload failed: ${error.message}`,
          })
        }
      },
    },
  },
})
