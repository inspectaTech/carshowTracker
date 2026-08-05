// Better Auth configuration for Car Show Tracker
// Google OAuth + MongoDB + TanStack Start cookie handling
import { betterAuth } from 'better-auth'
import { mongodbAdapter } from 'better-auth/adapters/mongodb'
import { tanstackStartCookies } from 'better-auth/tanstack-start'
import { MongoClient } from 'mongodb'

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017'
const client = new MongoClient(MONGODB_URI, {
  serverSelectionTimeoutMS: 3000,
})

export const auth = betterAuth({
  database: mongodbAdapter(client.db('carshow_tracker'), {
    // Local standalone MongoDB doesn't support transactions
    transaction: false,
  }),
  plugins: [tanstackStartCookies()],
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
  advanced: {
    defaultCookieAttributes: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    },
  },
  user: {
    additionalFields: {
      // Mirrors the dashboard's profile shape
      username: {
        type: 'string',
        required: false,
        input: true,
      },
      role: {
        type: 'string',
        required: false,
        defaultValue: 'user',
        input: false,
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          // Auto-create a matching `profiles` document so the dashboard
          // can show real user data immediately after sign-up.
          try {
            const { connectToDatabase } = await import('./db.js')
            const { db } = await connectToDatabase()

            // Generate a unique @handle — base from the display name, then
            // append _1, _2, ... if the base is already taken (unique index
            // on profiles.handle would throw E11000 on a collision).
            const base = (user.name || 'member').toLowerCase().replace(/[^a-z0-9_]/g, '').replace(/\s+/g, '_').slice(0, 30) || 'member'
            let handle = `@${base}`
            let suffix = 1
            while (await db.collection('profiles').findOne({ handle })) {
              handle = `@${base}_${suffix}`
              suffix += 1
            }

            await db.collection('profiles').insertOne({
              userId: user.id,
              username: user.name || 'New Member',
              handle,
              bio: '',
              avatarUrl: user.image || null,
              location: '',
              joinedAt: new Date().toISOString().slice(0, 10),
              socialLinks: [],
              aboutMe: '',
              favoriteBrand: '',
              dreamCar: '',
              occupation: '',
              driveStyle: '',
              stats: { totalPoints: 0, badges: 0, carsInGarage: 0, followers: 0, following: 0 },
              email: user.email || '',
              createdAt: new Date(),
            })
            console.log('[Auth] Created profile for user', user.id)
          } catch (err) {
            console.warn('[Auth] Failed to create profile:', err.message)
          }
        },
      },
    },
  },
})