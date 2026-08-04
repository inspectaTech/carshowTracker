import { MongoClient } from 'mongodb'

const client = new MongoClient('mongodb://127.0.0.1:27017')

async function main() {
  await client.connect()
  const db = client.db('carshow_tracker')

  console.log('=== profiles indexes ===')
  const pi = await db.collection('profiles').indexes()
  for (const i of pi) console.log(' -', i.name, JSON.stringify(i.key), 'unique:', !!i.unique)

  console.log('=== user indexes ===')
  const ui = await db.collection('user').indexes()
  for (const i of ui) console.log(' -', i.name, JSON.stringify(i.key), 'unique:', !!i.unique)

  await client.close()
}

main().catch((e) => { console.error(e); process.exit(1) })
