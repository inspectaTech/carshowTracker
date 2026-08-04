// Remove the test account created during handle-save debugging.
// Run: node scripts/cleanup-test-user.js
import { MongoClient } from 'mongodb'

const client = new MongoClient('mongodb://127.0.0.1:27017')

async function main() {
  await client.connect()
  const db = client.db('carshow_tracker')
  const email = 'test.handlesave@example.com'

  const user = await db.collection('user').findOne({ email })
  if (!user) {
    console.log('Test user not found — nothing to clean up.')
    await client.close()
    return
  }
  const userId = String(user._id)
  const { deletedCount: u } = await db.collection('user').deleteOne({ _id: user._id })
  const { deletedCount: p } = await db.collection('profiles').deleteMany({ userId })
  const { deletedCount: a } = await db.collection('account').deleteMany({ userId })
  const { deletedCount: s } = await db.collection('session').deleteMany({ userId })
  console.log(`Deleted test user: user=${u} profile=${p} account=${a} session=${s}`)
  await client.close()
}

main().catch((e) => { console.error(e); process.exit(1) })
