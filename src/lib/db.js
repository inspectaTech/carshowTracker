import { MongoClient } from 'mongodb'
import { createConnection } from 'net'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017'
const DB_NAME = 'carshow_tracker'

let client
let clientPromise

function getClientPromise() {
  if (!global._mongoClientPromise) {
    client = new MongoClient(MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 3000, // fail fast if MongoDB isn't running
    })
    // Catch the rejection so it doesn't crash the process when MongoDB isn't running
    global._mongoClientPromise = client.connect().catch((err) => {
      console.warn('[DB] MongoDB not available:', err.message)
      return null
    })
  }
  return global._mongoClientPromise
}

/**
 * Quick TCP port check — is anything listening on the MongoDB port?
 * Fails in ~1 second if MongoDB isn't running, vs 30s for a full MongoClient handshake.
 */
async function isPortReachable(host, port, timeout = 1000) {
  return new Promise((resolve) => {
    const socket = createConnection(port, host, () => {
      socket.destroy()
      resolve(true)
    })
    socket.setTimeout(timeout)
    socket.on('timeout', () => { socket.destroy(); resolve(false) })
    socket.on('error', () => resolve(false))
  })
}

export async function connectToDatabase() {
  console.log('[C2DB] attempting to connect to db', DB_NAME);
  try {
    const client = await getClientPromise()
    if (!client) throw new Error('MongoDB client not available')
    const db = client.db(DB_NAME)
    console.log('db is', db);
    return { client, db }
  } catch (error) {
    console.log('attempting to write db error')
    console.error('Failed to connect to MongoDB:', error)
    throw error
  }
}

export async function getUsersCollection() {
  const { db } = await connectToDatabase()
  return db.collection('users')
}

export async function checkDatabaseConnection() {
  console.log('[CKDBConn] attempting check');

  // Fast path: check if port is open before attempting a full MongoClient handshake
  const portOpen = await isPortReachable('127.0.0.1', 27017, 1000)
  if (!portOpen) {
    return {
      success: false,
      message: 'MongoDB is not running (port 27017 not reachable)',
      database: DB_NAME,
      uri: MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@'),
    }
  }

  try {
    const { client } = await connectToDatabase()
    // Ping the database
    await client.db('admin').command({ ping: 1 })
    return { 
      success: true, 
      message: 'MongoDB connected successfully',
      database: DB_NAME,
      uri: MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@') // Hide credentials
    }
  } catch (error) {
    console.error('Database connection failed:', error)
    return { 
      success: false, 
      message: `Failed to connect to MongoDB: ${error.message}`,
      database: DB_NAME,
      uri: MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')
    }
  }
}

export default { connectToDatabase, getUsersCollection, checkDatabaseConnection }