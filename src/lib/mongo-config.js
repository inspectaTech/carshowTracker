/**
 * MongoDB connection resolver — makes sure local dev and the production server
 * never hit the wrong database.
 *
 *   MONGODB_LIVE_URI  → production (fleet DB on sunz-admin via the private VPC)
 *   MONGODB_LOCAL_URI → local development (local mongod, no auth)
 *
 * Detector:
 *   - Default: NODE_ENV === 'production' picks LIVE, anything else picks LOCAL.
 *     This matches the existing NODE_ENV switch used in auth.js / auth-client.js.
 *   - Override: set MONGODB_ENV=live or MONGODB_ENV=local to force a choice
 *     explicitly (handy if a server doesn't set NODE_ENV the way you expect).
 */

function resolveMongoEnv() {
  if (process.env.MONGODB_ENV === 'live' || process.env.MONGODB_ENV === 'local') {
    return process.env.MONGODB_ENV
  }
  return process.env.NODE_ENV === 'production' ? 'live' : 'local'
}

export const MONGO_ENV = resolveMongoEnv()

export const MONGO_URI =
  (MONGO_ENV === 'live' ? process.env.MONGODB_LIVE_URI : process.env.MONGODB_LOCAL_URI) ||
  'mongodb://127.0.0.1:27017'

export const DB_NAME = 'carshow_tracker'
