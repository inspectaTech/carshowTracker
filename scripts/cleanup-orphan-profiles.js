// Remove orphaned profiles (userId: null) that hold handles but belong to no account.
// Run: node scripts/cleanup-orphan-profiles.js
import { MongoClient } from 'mongodb'

const client = new MongoClient('mongodb://127.0.0.1:27017')

async function main() {
  await client.connect()
  const db = client.db('carshow_tracker')

  const orphans = await db.collection('profiles').find({ userId: null }).project({ _id: 1, username: 1, handle: 1, email: 1 }).toArray()
  console.log('Orphaned profiles (userId: null):', orphans.length)
  for (const o of orphans) console.log(' -', JSON.stringify(o))

  if (orphans.length) {
    const { deletedCount } = await db.collection('profiles').deleteMany({ userId: null })
    console.log(`Deleted ${deletedCount} orphaned profile(s)`)
  }

  const remaining = await db.collection('profiles').find({}).project({ _id: 0, userId: 1, username: 1, handle: 1 }).toArray()
  console.log('Remaining profiles:')
  for (const p of remaining) console.log(' -', JSON.stringify(p))

  await client.close()
}

main().catch((e) => { console.error(e); process.exit(1) })
