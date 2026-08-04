// Server-only helpers for authenticated dashboard data.
// Kept in their own module so route loaders don't drag in
// server-only deps (MongoDB driver etc.) into the client bundle.
import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'

export const getSessionUser = createServerFn({ method: 'GET' })
  .handler(async () => {
    try {
      const request = getRequest()
      const { auth } = await import('../lib/auth')
      const session = await auth.api.getSession({ headers: request?.headers })
      if (session?.user?.id) {
        return { userId: session.user.id, user: session.user }
      }
      return { userId: null, user: null }
    } catch (err) {
      console.warn('[getSessionUser] Failed to read session:', err.message)
      return { userId: null, user: null }
    }
  })

// Fetches dashboard data for the currently authenticated user.
// Runs entirely server-side (session lookup + MongoDB read).
export const loadDashboardData = createServerFn({ method: 'GET' })
  .handler(async () => {
    try {
      const request = getRequest()
      const { auth } = await import('../lib/auth')
      const session = await auth.api.getSession({ headers: request?.headers })

      if (session?.user?.id) {
        const { dataSource } = await import('../lib/data-source')
        const data = await dataSource.getDashboardData(session.user.id)
        return { data, error: null, userId: session.user.id }
      }
      return { data: null, error: null, userId: null, notAuthenticated: true }
    } catch (err) {
      console.error('[loadDashboardData] Failed:', err.message)
      return { data: null, error: err.message, userId: null }
    }
  })

// Updates the current user's profile document in MongoDB.
// Server-only: reads session, then upserts into `profiles`.
export const updateProfile = createServerFn({ method: 'POST' })
  .handler(async ({ data }) => {
    try {
      const request = getRequest()
      const { auth } = await import('../lib/auth')
      const session = await auth.api.getSession({ headers: request?.headers })

      if (!session?.user?.id) {
        return { success: false, error: 'Not authenticated' }
      }

      const userId = session.user.id
      const { connectToDatabase } = await import('../lib/db')
      const { db } = await connectToDatabase()

      const update = data || {}
      await db.collection('profiles').updateOne(
        { userId },
        {
          $set: {
            username: update.username ?? update.displayName,
            bio: update.bio ?? '',
            location: update.location ?? '',
            socialLinks: (update.socialLinks ?? '').split(',').map((s) => s.trim()).filter(Boolean),
            aboutMe: update.aboutMe ?? '',
            favoriteBrand: update.favoriteBrand ?? '',
            dreamCar: update.dreamCar ?? '',
            occupation: update.occupation ?? '',
            driveStyle: update.driveStyle ?? '',
            updatedAt: new Date(),
          },
          $setOnInsert: {
            userId,
            handle: `@${(update.username || 'member').toLowerCase().replace(/\s+/g, '_')}`,
            avatarUrl: null,
            joinedAt: new Date().toISOString().slice(0, 10),
            stats: { totalPoints: 0, badges: 0, carsInGarage: 0, followers: 0, following: 0 },
            createdAt: new Date(),
          },
        },
        { upsert: true }
      )

      console.log('[updateProfile] Updated profile for', userId)
      return { success: true, userId }
    } catch (err) {
      console.error('[updateProfile] Failed:', err.message)
      return { success: false, error: err.message }
    }
  })
