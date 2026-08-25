// Backfill existing events with `startAt` / `endsAt` (absolute UTC instants) and
// `timezone` (IANA, derived from lat/lng via a lightweight lookup). Idempotent.
//
// Run: node scripts/backfill-event-times.js
//   MONGODB_URI env overrides the host (use the LIVE URI for production, which
//   defaults to live in mongo-config — see notes).
//
// For every event missing `endsAt`:
//   - resolve a timezone from lat/lng (offline lookup table for common US zones)
//   - compute startAt/endsAt from date + startTime/endTime in that timezone
//     (falling back to UTC when no timezone can be determined)
import { MongoClient } from 'mongodb'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017'
const DB_NAME = process.env.DB_NAME || 'carshow_tracker'
const client = new MongoClient(MONGODB_URI)

// Coarse lat/lng → IANA timezone lookup (US-centric — the app's market). For
// other regions this returns null and the wall-clock is treated as UTC (still
// functional, just not zone-correct). A full tz db could replace this.
function timezoneFromCoords(lat, lng) {
  const la = Number(lat)
  const ln = Number(lng)
  if (!Number.isFinite(la) || !Number.isFinite(ln)) return null
  // Continental US (approx). Pacific -130..-115 | Mountain -115..-103 | Central -103..-89 | Eastern -89..-65
  if (ln < -115 && ln >= -130) return la > 0 ? 'America/Los_Angeles' : 'America/Anchorage'
  if (ln >= -115 && ln < -103) return ln < -112 && la > 33 && la < 39 ? 'America/Phoenix' : 'America/Denver'
  if (ln >= -103 && ln < -89) return 'America/Chicago'
  if (ln >= -89 && ln < -65) return 'America/New_York'
  if (la > 0 && ln < -150 && ln > -180) return 'Pacific/Honolulu'
  return null
}

function toDateStr(value) {
  if (!value) return null
  // ISO date or datetime string "YYYY-MM-DD..."
  const iso = String(value).match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}`
  // Display format like "Sat, Aug 08, 2026"
  const d = new Date(value)
  if (!isNaN(d.getTime())) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  }
  return ''
}

function toAbsoluteInstant(date, time, timezone) {
  try {
    if (!date) return null
    const dateStr = toDateStr(date)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return null
    let hour = 0
    let minute = 0
    if (time) {
      const t = String(time).trim()
      const m = t.match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?$/i)
      if (m) {
        let h = parseInt(m[1], 10)
        const min = parseInt(m[2] || '0', 10)
        const ap = (m[3] || '').toUpperCase()
        if (ap === 'PM' && h < 12) h += 12
        if (ap === 'AM' && h === 12) h = 0
        hour = h; minute = min
      } else {
        const d = new Date(time)
        if (!isNaN(d.getTime())) { hour = d.getHours(); minute = d.getMinutes() }
      }
    }
    const iso = `${dateStr}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00`
    if (timezone && typeof Intl !== 'undefined') {
      // Approximate UTC via Intl (same logic as the server helper).
      const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone, hour12: false,
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
      }).formatToParts(new Date(iso + 'Z'))
      const get = (t) => parts.find((p) => p.type === t)?.value
      const asUtc = new Date(iso + 'Z').getTime()
      const zoned = Date.UTC(parseInt(get('year'), 10), parseInt(get('month'), 10) - 1, parseInt(get('day'), 10), parseInt(get('hour'), 10), parseInt(get('minute'), 10), parseInt(get('second'), 10))
      return new Date(asUtc - (zoned - asUtc)).toISOString()
    }
    return iso + 'Z'
  } catch { return null }
}

async function main() {
  await client.connect()
  const db = client.db(DB_NAME)
  const events = db.collection('events')

  const missing = await events.find({ endsAt: { $exists: false } }).toArray()
  console.log(`Events missing endsAt: ${missing.length}`)

  let filled = 0
  for (const ev of missing) {
    const timezone = timezoneFromCoords(ev.lat, ev.lng)
    let startAt = toAbsoluteInstant(ev.date, ev.startTime, timezone)
    let endsAt = toAbsoluteInstant(ev.date, ev.endTime || ev.startTime, timezone)
    // Guard: if the end computes to before the start (e.g. a "12:00 AM" end on
    // the same date as an 8:00 PM start), roll the end to the next day. This
    // fixes legacy seeded data where midnight-end was entered as start-of-day.
    if (startAt && endsAt && new Date(endsAt) <= new Date(startAt)) {
      const nextDay = new Date(new Date(startAt).getTime() + 24 * 60 * 60 * 1000)
      endsAt = nextDay.toISOString()
    }
    // Store as Date objects so MongoDB range queries (endsAt >= now) work.
    const update = {
      $set: {
        timezone: timezone || null,
        startAt: startAt ? new Date(startAt) : null,
        endsAt: endsAt ? new Date(endsAt) : null,
      },
    }
    await events.updateOne({ _id: ev._id }, update)
    filled++
    console.log(`  ${ev.title || ev.slugId}: tz=${timezone || 'none'} startAt=${startAt} endsAt=${endsAt}`)
  }

  console.log(`Backfilled ${filled} events.`)
  await client.close()
}

main().catch((err) => { console.error(err); process.exit(1) })