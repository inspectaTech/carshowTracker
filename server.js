import { createServer } from 'http'
import { MongoClient } from 'mongodb'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017'
const DB_NAME = 'local'
const PORT = 3001

let client
let clientPromise

if (!global._mongoClientPromise) {
  client = new MongoClient(MONGODB_URI, {
    maxPoolSize: 10,
  })
  clientPromise = client.connect()
}
global._mongoClientPromise = clientPromise

async function checkDatabaseConnection() {
  try {
    const client = await clientPromise
    await client.db('admin').command({ ping: 1 })
    return {
      success: true,
      message: 'MongoDB connected successfully',
      database: DB_NAME,
    }
  } catch (error) {
    return {
      success: false,
      message: `Failed to connect to MongoDB: ${error.message}`,
      database: DB_NAME,
    }
  }
}

const server = createServer(async (req, res) => {
  // Enable CORS — restrict origin in production
  const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',')
    : ['http://localhost:3000', 'http://127.0.0.1:3000', 'https://cst.sunzao.win']

  const origin = req.headers.origin
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
  } else if (!origin) {
    // Allow same-origin requests (no Origin header)
    res.setHeader('Access-Control-Allow-Origin', '*')
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.writeHead(204)
    res.end()
    return
  }

  if (req.url === '/api/health' && req.method === 'GET') {
    const result = await checkDatabaseConnection()
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(result))
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'Not found' }))
  }
})

server.listen(PORT, () => {
  console.log(`Health check server running on http://localhost:${PORT}`)
})
