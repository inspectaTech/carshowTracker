import { MongoClient } from 'mongodb'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017'
// const DB_NAME = 'carshow_tracker'
const DB_NAME = 'local'

let client
let clientPromise

if (!global._mongoClientPromise) {
  client = new MongoClient(MONGODB_URI, {
    maxPoolSize: 10,
  })
  global._mongoClientPromise = client.connect()
}
clientPromise = global._mongoClientPromise

export async function connectToDatabase() {
  console.log('[C2DB] attempting to connect to db', DB_NAME);
  try {
    const client = await clientPromise
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