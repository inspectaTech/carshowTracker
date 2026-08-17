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

// Checks whether a @handle is available (not taken by another profile).
// Returns { available, takenByMe? } so the UI can validate live.
export const checkHandleAvailable = createServerFn({ method: 'GET' })
  .handler(async ({ data }) => {
    try {
      const request = getRequest()
      const { auth } = await import('../lib/auth')
      const session = await auth.api.getSession({ headers: request?.headers })

      let raw = data?.handle || ''
      raw = raw.trim().replace(/^@/, '')

      if (!raw) return { available: false, reason: 'Handle is required' }
      if (!/^[a-zA-Z0-9_]{2,30}$/.test(raw)) {
        return { available: false, reason: 'Handle must be 2-30 chars: letters, numbers, underscores only' }
      }

      const { connectToDatabase } = await import('../lib/db')
      const { db } = await connectToDatabase()

      const handle = `@${raw.toLowerCase()}`
      const existing = await db.collection('profiles').findOne({ handle })

      if (!existing) return { available: true }
      if (session?.user?.id && existing.userId === session.user.id) {
        return { available: true, isOwn: true } // it's your current handle
      }
      return { available: false, reason: 'That handle is already taken' }
    } catch (err) {
      console.error('[checkHandleAvailable] Failed:', err.message)
      return { available: false, reason: 'Could not check handle' }
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

      // If a handle is provided, normalize + validate it BEFORE writing
      let newHandle
      if (update.handle !== undefined) {
        let raw = String(update.handle || '').trim().replace(/^@/, '')
        if (!/^[a-zA-Z0-9_]{2,30}$/.test(raw)) {
          return { success: false, error: 'Handle must be 2-30 chars: letters, numbers, underscores only' }
        }
        newHandle = `@${raw.toLowerCase()}`
        const taken = await db.collection('profiles').findOne({ handle: newHandle })
        if (taken && taken.userId !== userId) {
          return { success: false, error: `The handle ${newHandle} is already taken` }
        }
      }

      const setFields = {
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
      }
      if (newHandle) setFields.handle = newHandle

      // NOTE: a path can't appear in BOTH $set and $setOnInsert (MongoDB throws
      // "would create a conflict"). So `handle` goes in $set when provided,
      // otherwise it's generated in $setOnInsert for new profiles only.
      const setOnInsert = {
        userId,
        avatarUrl: null,
        joinedAt: new Date().toISOString().slice(0, 10),
        stats: { totalPoints: 0, badges: 0, carsInGarage: 0, followers: 0, following: 0 },
        createdAt: new Date(),
      }
      if (!newHandle) {
        setOnInsert.handle = `@${(update.username || update.displayName || 'member').toLowerCase().replace(/\s+/g, '_')}`
      }

      await db.collection('profiles').updateOne(
        { userId },
        {
          $set: setFields,
          $setOnInsert: setOnInsert,
        },
        { upsert: true }
      )

      console.log('[updateProfile] Updated profile for', userId)
      return { success: true, userId, handle: newHandle }
    } catch (err) {
      console.error('[updateProfile] Failed:', err.message)
      return { success: false, error: err.message }
    }
  })

// Sets (or clears) the current user's Home location on their profile.
// Dedicated fn so a partial update never clobbers bio/location/etc.
// Expected shape: { homeLocation: { address, lat, lng } | null }
export const updateHomeLocation = createServerFn({ method: 'POST' })
  .handler(async ({ data }) => {
    try {
      const request = getRequest()
      const { auth } = await import('../lib/auth')
      const session = await auth.api.getSession({ headers: request?.headers })

      if (!session?.user?.id) {
        return { success: false, error: 'Not authenticated' }
      }

      const userId = session.user.id
      const home = data?.homeLocation ?? null
      const valid =
        home == null ||
        (home &&
          typeof home.address === 'string' &&
          typeof home.lat === 'number' &&
          typeof home.lng === 'number')
      if (!valid) {
        return { success: false, error: 'Invalid home location' }
      }

      const { connectToDatabase } = await import('../lib/db')
      const { db } = await connectToDatabase()

      await db.collection('profiles').updateOne(
        { userId },
        { $set: { homeLocation: home, updatedAt: new Date() } },
        { upsert: true }
      )

      console.log('[updateHomeLocation] Saved home for', userId)
      return { success: true, homeLocation: home }
    } catch (err) {
      console.error('[updateHomeLocation] Failed:', err.message)
      return { success: false, error: err.message }
    }
  })
