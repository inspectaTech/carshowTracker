// Ensure unique indexes on the profiles collection.
// Run: node scripts/ensure-indexes.js
import { MongoClient } from 'mongodb'

const client = new MongoClient('mongodb://127.0.0.1:27017')

async function main() {
  await client.connect()
  const db = client.db('carshow_tracker')
  const profiles = db.collection('profiles')

  // 1) Pre-check for duplicate handles so the unique index doesn't fail silently.
  const dupes = await profiles.aggregate([
    { $match: { handle: { $exists: true, $ne: null } } },
    { $group: { _id: '$handle', count: { $sum: 1 }, userIds: { $push: '$userId' } } },
    { $match: { count: { $gt: 1 } } },
  ]).toArray()

  if (dupes.length) {
    console.error('⚠️  Duplicate handles found — resolve these before creating the unique index:')
    for (const d of dupes) {
      console.error(`  ${d._id}  x${d.count}  userIds: ${d.userIds.join(', ')}`)
    }
    process.exit(1)
  }

  // 2) Create unique @handle — prevents two profiles sharing a handle at the DB level
  await profiles.createIndex(
    { handle: 1 },
    { unique: true, name: 'unique_handle', sparse: true }
  )
  console.log('Created unique index on profiles.handle (unique_handle)')

  await client.close()
}

main().catch((e) => { console.error(e); process.exit(1) })
