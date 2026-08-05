import { createServerFn } from '@tanstack/react-start'
import { checkDatabaseConnection } from '../lib/db'
import { dataSource } from '../lib/data-source'

export const checkDbHealth = createServerFn({ method: 'GET' })
  .handler(async () => {
    console.log('[CKDBHealth] attempting check');
    return await checkDatabaseConnection()
  })

export const getDashboardData = createServerFn({ method: 'GET' })
  .handler(async ({ data }) => {
    const userId = data?.userId || 'user_001'
    console.log('[GET_DASHBOARD_DATA] for user', userId);
    return await dataSource.getDashboardData(userId)
  })

export const getDataSourceStatus = createServerFn({ method: 'GET' })
  .handler(async () => {
    return await dataSource.getDataSourceStatus()
  })

// Public: list all user profiles (for Explore — "All users" display).
export const listProfiles = createServerFn({ method: 'GET' })
  .handler(async () => {
    try {
      const { connectToDatabase } = await import('../lib/db')
      const { db } = await connectToDatabase()
      const docs = await db.collection('profiles').find({}).sort({ createdAt: 1 }).toArray()
      const users = docs.map((p) => ({
        id: p.userId || p._id,
        name: p.username || p.handle || 'Car Enthusiast',
        handle: p.handle || '',
        avatarUrl: p.avatarUrl || null,
        cars: p.stats?.carsInGarage ?? 0,
        followers: p.stats?.followers ?? 0,
      }))
      return { users }
    } catch (err) {
      console.error('[listProfiles] Failed:', err.message)
      return { users: [] }
    }
  })

export const seedDashboardData = createServerFn({ method: 'POST' })
  .handler(async () => {
    console.log('[SEED_DASHBOARD] attempting seed');
    try {
      const { connectToDatabase } = await import('../lib/db')
      const { db } = await connectToDatabase()

      const existing = await db.collection('profiles').findOne({ userId: 'user_001' })
      if (existing) {
        return { success: true, message: 'Seed data already exists', seeded: false }
      }

      await db.collection('profiles').insertOne({
        userId: 'user_001',
        username: 'Gearhead_23',
        handle: '@gearhead_23',
        bio: 'Cars are my passion. Speed is my therapy. Built not bought.',
        avatarUrl: '/uploads/user_001/avatar.jpg',
        location: 'Los Angeles, CA',
        joinedAt: 'May 2022',
        socialLinks: ['Instagram', 'YouTube', 'TikTok'],
        aboutMe: 'Car enthusiast since day one. I live for weekend drives, track days, and late night builds. JDM at heart. Always chasing the next build.',
        favoriteBrand: 'Nissan',
        dreamCar: 'Nissan GT-R R34',
        occupation: 'Automotive Photographer',
        driveStyle: 'Performance & Style',
        stats: { totalPoints: 2400, badges: 47, carsInGarage: 12, followers: 1800, following: 320 },
        createdAt: new Date(),
      })

      await db.collection('vehicles').insertMany([
        { userId: 'user_001', name: 'Nissan GT-R R34', year: 2000, hp: 600, drivetrain: 'AWD' },
        { userId: 'user_001', name: 'Toyota Supra MK4', year: 1998, hp: 320, drivetrain: 'RWD' },
        { userId: 'user_001', name: 'Honda Civic Type R', year: 2021, hp: 306, drivetrain: 'FWD' },
        { userId: 'user_001', name: 'Mazda RX-7 FD', year: 1995, hp: 276, drivetrain: 'RWD' },
      ])

      await db.collection('activities').insertOne({
        userId: 'user_001',
        type: 'photo',
        action: 'Posted a new photo',
        description: 'Nissan GT-R R34 at Angeles Crest Hwy',
        imageUrl: '/uploads/user_001/photos/nissan-gtr-angle-crest.jpg',
        timestamp: new Date(Date.now() - 2 * 3_600_000),
        likes: 128,
        comments: 16,
      })

      return { success: true, message: 'Seed data inserted successfully', seeded: true }
    } catch (error) {
      return { success: false, message: `Seed failed: ${error.message}`, seeded: false }
    }
  })
