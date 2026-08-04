// Seed the logged-in user's profile with deliberately awful, funny data.
// Run: node scripts/seed-profile.js
import { MongoClient } from 'mongodb'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017'
const client = new MongoClient(MONGODB_URI)

const profile = {
  username: 'Couch Potato',
  handle: '@couch_potato',
  bio: 'Professional couch potato. My car gets me to the fridge and back. That is all I need.',
  location: 'My Couch, USA',
  socialLinks: ['Netflix', 'DoorDash'],
  aboutMe:
    "I used to dream about cars. Now I dream about the perfect nap. My garage is where dreams go to die — and honestly, the lawnmower is the fastest thing in it. I've never changed a tire, but I once changed the channel with remarkable speed.",
  favoriteBrand: 'Whatever is cheapest',
  dreamCar: 'A car that starts on the first try',
  occupation: 'Professional Napper',
  driveStyle: '0-60 in about a week',
  stats: { totalPoints: 12, badges: 1, carsInGarage: 5, followers: 3, following: 0 },
}

const vehicles = [
  { name: 'Yugo GV', year: 1989, hp: 55, drivetrain: 'FWD' },
  { name: 'Pontiac Aztek', year: 2003, hp: 185, drivetrain: 'AWD' },
  { name: 'Fiat Multipla', year: 2000, hp: 103, drivetrain: 'FWD' },
  { name: 'Reliant Robin', year: 2004, hp: 40, drivetrain: 'RWD' },
  { name: 'Suzuki X-90', year: 1996, hp: 95, drivetrain: 'RWD' },
]

const activities = [
  {
    type: 'show',
    action: 'Skipped',
    description: 'Another car show. Chose the couch instead.',
    timestamp: new Date(Date.now() - 2 * 3_600_000),
    likes: 1,
    comments: 0,
  },
  {
    type: 'award',
    action: 'Won',
    description: 'Most Likely to Fall Asleep at a Meet',
    timestamp: new Date(Date.now() - 26 * 3_600_000),
    likes: 4,
    comments: 2,
  },
  {
    type: 'upload',
    action: 'Declined',
    description: '14 car show invitations in one week. Nap preferred.',
    timestamp: new Date(Date.now() - 3 * 24 * 3_600_000),
    likes: 0,
    comments: 1,
  },
]

async function main() {
  await client.connect()
  const db = client.db('carshow_tracker')

  // Target the real Google user by email; fall back to any user
  const user = await db.collection('user').findOne({ email: 'd3po.techengineer@gmail.com' })
  if (!user) {
    console.log('No Google user found. Run `node scripts/seed-profile.js` after logging in once.')
    await client.close()
    return
  }
  const userId = String(user._id)

  const { deletedCount } = await db.collection('profiles').deleteOne({ userId })
  await db.collection('vehicles').deleteMany({ userId })
  await db.collection('activities').deleteMany({ userId })

  await db.collection('profiles').insertOne({
    userId,
    ...profile,
    avatarUrl: user.image || null,
    joinedAt: new Date().toISOString().slice(0, 10),
    email: user.email || '',
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  await db.collection('vehicles').insertMany(
    vehicles.map((v) => ({ userId, ...v, createdAt: new Date() }))
  )

  await db.collection('activities').insertMany(
    activities.map((a) => ({ userId, ...a }))
  )

  console.log(`Seeded couch-potato profile for ${user.name} (${userId})`)
  console.log('Vehicles:', vehicles.map((v) => `${v.name} (${v.hp} HP)`).join(', '))
  await client.close()
}

main().catch((e) => { console.error(e); process.exit(1) })
