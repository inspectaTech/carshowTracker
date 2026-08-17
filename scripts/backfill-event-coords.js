// Backfill event coordinates + the `geo` GeoJSON field, and create the 2dsphere
// index used by listEventsNearby ($geoNear). Idempotent — safe to re-run.
//
// Run: node scripts/backfill-event-coords.js
//
// For every event missing `geo`:
//   - reuse existing lat/lng if present, else best-effort Nominatim geocode the
//     location string (throttled ~1 req/sec to respect Nominatim's usage policy)
//   - write { lat, lng, geo: { type:'Point', coordinates:[lng,lat] } }
import { MongoClient } from 'mongodb'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017'
const DB_NAME = process.env.DB_NAME || 'carshow_tracker'
const client = new MongoClient(MONGODB_URI)

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

function toGeo(lat, lng) {
  const l = Number(lat)
  const n = Number(lng)
  if (!Number.isFinite(l) || !Number.isFinite(n)) return null
  return { type: 'Point', coordinates: [n, l] }
}

async function geocode(location) {
  if (!location || !location.trim()) return null
  try {
    const q = encodeURIComponent(location.trim())
    const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=1`, {
      headers: { 'User-Agent': 'CarshowTracker/1.0' },
    })
    if (!res.ok) return null
    const data = await res.json()
    const hit = Array.isArray(data) ? data[0] : null
    if (!hit) return null
    const lat = parseFloat(hit.lat)
    const lng = parseFloat(hit.lon)
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null
    return { lat, lng }
  } catch (err) {
    console.warn('[backfill] geocode failed:', err.message)
    return null
  }
}

async function main() {
  await client.connect()
  const db = client.db(DB_NAME)
  const events = db.collection('events')

  // 1) Ensure the 2dsphere index exists (required by $geoNear).
  console.log('Creating 2dsphere index on events.geo ...')
  await events.createIndex({ geo: '2dsphere' })
  console.log('  index ensured.')

  // 2) Backfill geo on events that don't have it yet.
  const missingGeo = await events.find({ geo: { $exists: false } }).toArray()
  console.log(`Events missing geo: ${missingGeo.length}`)

  let filled = 0
  let geocoded = 0
  let failed = 0
  for (const ev of missingGeo) {
    let lat = ev.lat
    let lng = ev.lng
    if ((lat == null || lng == null) && ev.location) {
      await sleep(1100) // Nominatim ~1 req/sec
      const resolved = await geocode(ev.location)
      if (resolved) {
        lat = resolved.lat
        lng = resolved.lng
        geocoded++
      }
    }
    const geo = toGeo(lat, lng)
    if (geo) {
      await events.updateOne({ _id: ev._id }, { $set: { lat, lng, geo } })
      filled++
    } else {
      failed++
      console.warn(`  could not geocode: "${ev.location}" (${ev.slugId})`)
    }
  }

  const total = await events.countDocuments({ geo: { $exists: true } })
  console.log(`Filled geo on ${filled} events (${geocoded} via geocode), ${failed} still missing.`)
  console.log(`Total events with geo now: ${total}`)
  await client.close()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
