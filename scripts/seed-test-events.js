// Seed the mock event data (Explore + My Events dummy) into MongoDB, split across two accounts.
// Run: node scripts/seed-test-events.js
//
// Distribution (disjoint, no overlap):
//   - Test account Gearhead_23 (test@carshowtracker.com / TestPass123!) gets the 3 Explore events:
//       SoCal JDM Meet 2026, JDM Legends Show, Euro Night Cruise
//   - Inspecta Tech (real profile) gets the 3 My-Events-only events:
//       Cars & Coffee Monthly, Supercar Sunday, Classic Muscle Showdown
//
// Also consolidates the test user and the Gearhead_23 profile into ONE identity:
// the legacy @gearhead_23 profile (userId "user_001") is repointed to the test user's real id,
// leaving exactly 2 profiles: @inspecta_tech + @gearhead_23.
import { MongoClient } from 'mongodb'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017'
const client = new MongoClient(MONGODB_URI)

// Generic test login (also shown on the login page for easy testing)
export const TEST_EMAIL = 'test@carshowtracker.com'
export const TEST_PASSWORD = 'TestPass123!'
export const TEST_NAME = 'Gearhead_23'

function slugify(str) {
  return (str || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
}

function genShortId(len = 6) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let out = ''
  const arr = new Uint32Array(len)
  if (typeof globalThis.crypto?.getRandomValues === 'function') {
    globalThis.crypto.getRandomValues(arr)
    for (let i = 0; i < len; i++) out += chars[arr[i] % chars.length]
  } else {
    for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)]
  }
  return out
}

// The dummy events from Explore (FEATURED_EVENTS) — attributed to the TEST account (Gearhead_23).
const EXPLORE_EVENTS = [
  {
    title: 'SoCal JDM Meet 2026',
    date: '2026-07-15T19:00:00',
    startTime: '7:00 PM',
    endTime: '11:00 PM',
    location: 'Los Angeles, CA',
    zipCode: '90015',
    description:
      'The biggest JDM meet of the summer! Hundreds of Japanese classics, imports, and modern icons fill the grounds. Live drifting demos, a vendor village, food trucks, and awards across 12 categories.',
    costType: 'free',
    price: 0,
    category: 'JDM',
    attending: 234,
  },
  {
    title: 'JDM Legends Show',
    date: '2026-08-03T10:00:00',
    startTime: '10:00 AM',
    endTime: '4:00 PM',
    location: 'San Diego, CA',
    zipCode: '92101',
    description:
      'Annual JDM car show with 200+ vehicles expected. Rotary, turbo, and everything in between.',
    costType: 'free',
    price: 0,
    category: 'Classic',
    attending: 89,
  },
  {
    title: 'Euro Night Cruise',
    date: '2026-08-22T20:00:00',
    startTime: '8:00 PM',
    endTime: '12:00 AM',
    location: 'Santa Monica, CA',
    zipCode: '90401',
    description:
      'European car meet and coastal night cruise. German, Italian, British — all European makes welcome.',
    costType: 'free',
    price: 0,
    category: 'Euro',
    attending: 56,
  },
]

// The dummy events from My Events (MOCK_EVENTS) — attributed to Inspecta Tech (the real profile).
const MY_EVENTS_EVENTS = [
  {
    title: 'Cars & Coffee Monthly',
    date: '2026-09-12T06:00:00',
    startTime: '6:00 AM',
    endTime: '10:00 AM',
    location: 'Orange County, CA',
    zipCode: '92626',
    description:
      'Monthly morning meetup. Coffee, cars, and conversation. All makes and models welcome.',
    costType: 'free',
    price: 0,
    category: 'Meetup',
    attending: 312,
  },
  {
    title: 'Supercar Sunday',
    date: '2026-10-05T09:00:00',
    startTime: '9:00 AM',
    endTime: '3:00 PM',
    location: 'Beverly Hills, CA',
    zipCode: '90210',
    description:
      'Exotic and supercar showcase on Rodeo Drive. Ferraris, Lamborghinis, McLarens and more.',
    costType: 'paid',
    price: 25,
    category: 'Import',
    attending: 178,
  },
  {
    title: 'Classic Muscle Showdown',
    date: '2026-11-14T11:00:00',
    startTime: '11:00 AM',
    endTime: '6:00 PM',
    location: 'Long Beach, CA',
    zipCode: '90802',
    description:
      'American muscle classics battle for Best in Show. V8s, big blocks, and drag racing demos.',
    costType: 'free',
    price: 0,
    category: 'Classic',
    attending: 45,
  },
]

async function main() {
  await client.connect()
  const db = client.db('carshow_tracker')

  // 1) Create the test user (login-able) if not present.
  //    Use Better Auth's server API so password hashing + the signup hook run.
  let testUserId
  const existingUser = await db.collection('user').findOne({ email: TEST_EMAIL })
  if (existingUser) {
    testUserId = String(existingUser._id)
    console.log('Test user already exists:', TEST_EMAIL, testUserId)
  } else {
    const { auth } = await import('../src/lib/auth.js')
    const res = await auth.api.signUpEmail({
      body: { email: TEST_EMAIL, password: TEST_PASSWORD, name: TEST_NAME },
    })
    if (!res?.user?.id) {
      console.error('Failed to create test user:', JSON.stringify(res).slice(0, 300))
      await client.close()
      process.exit(1)
    }
    testUserId = res.user.id
    console.log('Created test user:', TEST_EMAIL, testUserId)
  }

  // Inspecta Tech (the real profile) — resolve by email, fall back to known id.
  const INSPECTA_EMAIL = 'd3po.techengineer@gmail.com'
  const INSPECTA_ID = '6a71f23a3da13b2dbe6ec744'
  const inspectaUser = await db.collection('user').findOne({ email: INSPECTA_EMAIL })
  const inspectaUserId = inspectaUser ? String(inspectaUser._id) : INSPECTA_ID
  console.log('Inspecta Tech user id:', inspectaUserId)

  // 2) Upsert exactly 2 profiles (works on both a fresh DB and a dev DB).
  //    Upsert by handle (NOT by userId) — avoids E11000 on the unique_handle
  //    index and prevents a 3rd profile.
  const gearheadDoc = {
    userId: testUserId,
    username: TEST_NAME,
    handle: '@gearhead_23',
    bio: 'Cars are my passion. Speed is my therapy. Built not bought.',
    location: 'Los Angeles, CA',
    socialLinks: ['Instagram', 'YouTube', 'TikTok'],
    aboutMe:
      'Car enthusiast since day one. I live for weekend drives, track days, and late night builds. JDM at heart. Always chasing the next build.',
    favoriteBrand: 'Nissan',
    dreamCar: 'Nissan GT-R R34',
    occupation: 'Automotive Photographer',
    driveStyle: 'Performance & Style',
    email: TEST_EMAIL,
    stats: { totalPoints: 0, badges: 0, carsInGarage: 0, followers: 0, following: 0 },
    updatedAt: new Date(),
  }
  await db.collection('profiles').updateOne(
    { handle: '@gearhead_23' },
    { $set: gearheadDoc, $setOnInsert: { createdAt: new Date() } },
    { upsert: true }
  )
  console.log('Upserted @gearhead_23 -> test user', testUserId)

  const inspectaDoc = {
    userId: inspectaUserId,
    username: 'Inspecta Tech',
    handle: '@inspecta_tech',
    bio: 'Tech-first automotive photographer & enthusiast.',
    location: 'Los Angeles, CA',
    socialLinks: ['Instagram', 'YouTube'],
    aboutMe:
      'Focused on the intersection of tech and cars. Documenting builds, shows, and everything on wheels.',
    favoriteBrand: 'Tesla',
    dreamCar: 'Tesla Roadster',
    occupation: 'Software Engineer',
    driveStyle: 'Tech & Comfort',
    email: INSPECTA_EMAIL,
    stats: { totalPoints: 0, badges: 0, carsInGarage: 0, followers: 0, following: 0 },
    updatedAt: new Date(),
  }
  await db.collection('profiles').updateOne(
    { handle: '@inspecta_tech' },
    { $set: inspectaDoc, $setOnInsert: { createdAt: new Date() } },
    { upsert: true }
  )
  console.log('Upserted @inspecta_tech ->', inspectaUserId)

  // Cleanup: drop any profile still pointing at the legacy "user_001" id, and
  // any profile owned by the test user that ISN'T @gearhead_23.
  await db.collection('profiles').deleteMany({ userId: 'user_001', handle: { $ne: '@gearhead_23' } })
  await db.collection('profiles').deleteMany({ userId: testUserId, handle: { $ne: '@gearhead_23' } })

  const profileCount = await db.collection('profiles').countDocuments({})
  const profiles = await db.collection('profiles').find({}, { projection: { handle: 1, userId: 1, username: 1 } }).toArray()
  console.log(`Profiles after consolidation (${profileCount}):`)
  profiles.forEach((p) => console.log('  -', p.handle, '|', p.username, '| userId:', p.userId))
  if (profileCount !== 2) {
    console.error('Expected exactly 2 profiles, found', profileCount)
    await client.close()
    process.exit(1)
  }

  // 3) Seed events split across the two creators (replace any existing).
  const now = new Date()
  const buildDocs = (arr, creator) =>
    arr.map((e) => ({
      slugId: `${slugify(e.title)}-${genShortId()}`,
      ...e,
      photoUrl: null,
      creatorUserId: creator,
      createdAt: now,
      updatedAt: now,
    }))

  const exploreDocs = buildDocs(EXPLORE_EVENTS, testUserId)
  const myEventsDocs = buildDocs(MY_EVENTS_EVENTS, inspectaUserId)

  await db.collection('events').deleteMany({ creatorUserId: { $in: [testUserId, inspectaUserId] } })
  if (exploreDocs.length) await db.collection('events').insertMany(exploreDocs)
  if (myEventsDocs.length) await db.collection('events').insertMany(myEventsDocs)

  console.log(`Seeded ${exploreDocs.length} Explore events for ${TEST_NAME} (${testUserId})`)
  console.log(`Seeded ${myEventsDocs.length} My Events events for Inspecta Tech (${inspectaUserId})`)
  console.log('Test login: ', TEST_EMAIL, ' / ', TEST_PASSWORD)

  await client.close()
}

main().catch((e) => { console.error(e); process.exit(1) })
