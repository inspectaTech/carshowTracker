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
            const { connectToDatabase } = await import('./db')
            const { db } = await connectToDatabase()
            await db.collection('profiles').insertOne({
              userId: user.id,
              username: user.name || 'New Member',
              handle: `@${(user.name || 'member').toLowerCase().replace(/\s+/g, '_')}`,
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