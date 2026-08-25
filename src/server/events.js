// Server-only helpers for events.
// Kept in their own module so route loaders don't drag server-only deps
// (MongoDB driver) into the client bundle. Handlers use dynamic import().
import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'

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

// GeoJSON Point for the `geo` 2dsphere field — coordinates are [lng, lat].
function toGeo(lat, lng) {
  const l = Number(lat)
  const n = Number(lng)
  if (!Number.isFinite(l) || !Number.isFinite(n)) return null
  return { type: 'Point', coordinates: [n, l] }
}

// Best-effort forward geocode of a location string via Nominatim (free OSM API).
// Used to guarantee coords when an event is saved with only an address.
// Returns { lat, lng, timezone } or null. Throttled by callers (Nominatim = 1 req/sec).
async function geocodeLocation(location) {
  if (!location || typeof location !== 'string' || !location.trim()) return null
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
    return { lat, lng, timezone: hit.timezone || null }
  } catch (err) {
    console.warn('[geocodeLocation] failed:', err.message)
    return null
  }
}

// Build an absolute UTC instant from a date + time-of-day + IANA timezone.
// date is a "YYYY-MM-DD" (or Date), time is a display string like "6:00 PM"
// (or "18:00"). Returns an ISO string or null if it can't be resolved.
// The wall-clock is interpreted in `timezone` (default UTC if unknown) so the
// resulting instant is timezone-independent — a viewer anywhere sees the same
// "has this event ended?" truth.
// `rollToNextDay` (default false): if the resulting instant is BEFORE the
// `after` instant, roll to the NEXT calendar day. Used for the event END time
// so a late-night event (10 PM -> 2 AM) correctly ends on the following day.
function toAbsoluteInstant(date, time, timezone, { rollToNextDay = false, after = null } = {}) {
  try {
    if (!date) return null
    const dateStr = date instanceof Date ? date.toISOString().slice(0, 10) : String(date).slice(0, 10)
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
        hour = h
        minute = min
      } else {
        const d = new Date(time)
        if (!isNaN(d.getTime())) {
          hour = d.getHours()
          minute = d.getMinutes()
        }
      }
    }
    const iso = `${dateStr}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00`
    let utc
    if (timezone && typeof Intl !== 'undefined') {
      utc = zonedTimeToUtc(iso, timezone)
    }
    const base = utc ? utc.toISOString() : iso + 'Z'
    if (rollToNextDay && after) {
      const endMs = new Date(base).getTime()
      const afterMs = new Date(after).getTime()
      if (Number.isFinite(endMs) && Number.isFinite(afterMs) && endMs < afterMs) {
        // End fell before the start (e.g. 2 AM end, 10 PM start on the same
        // date) — roll the end to the next day so it correctly runs overnight.
        return new Date(endMs + 24 * 60 * 60 * 1000).toISOString()
      }
    }
    return base
  } catch {
    return null
  }
}

// Convert a wall-clock ISO string (no zone) in a given IANA timezone to a UTC
// Date, using Intl (no external tz dependency). Correct across DST for the
// specific instant being converted.
function zonedTimeToUtc(iso, timezone) {
  try {
    const asUtc = new Date(iso + 'Z')
    if (isNaN(asUtc.getTime())) return null
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour12: false,
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
    }).formatToParts(asUtc)
    const get = (t) => parts.find((p) => p.type === t)?.value
    // Build the wall-clock as a UTC timestamp (NOT local-time parse, which
    // would be wrong if the server's own timezone differs).
    const zoned = Date.UTC(
      parseInt(get('year'), 10),
      parseInt(get('month'), 10) - 1,
      parseInt(get('day'), 10),
      parseInt(get('hour'), 10),
      parseInt(get('minute'), 10),
      parseInt(get('second'), 10)
    )
    if (isNaN(zoned)) return null
    // offset = how far the zone's wall-clock at this instant is from UTC.
    // real UTC instant = asUtc - offset.
    const offsetMs = zoned - asUtc.getTime()
    return new Date(asUtc.getTime() - offsetMs)
  } catch {
    return null
  }
}

// Normalize a date value to a string. Flatpickr passes raw Date objects which,
// if rendered directly by React (e.g. `{event.startTime}`), throw
// "Objects are not valid as a React child (found: [object Date])". Always
// coerce to an ISO string at the server boundary so every consumer is safe.
function toDateString(v) {
  if (v == null || v === '') return v ?? null
  return v instanceof Date ? v.toISOString() : String(v)
}

// Normalize a time-of-day value to a display string ("6:00 PM").
function toTimeString(v) {
  if (v == null || v === '') return v ?? ''
  if (v instanceof Date) {
    let h = v.getHours()
    const m = String(v.getMinutes()).padStart(2, '0')
    const ampm = h >= 12 ? 'PM' : 'AM'
    h = h % 12 || 12
    return `${h}:${m} ${ampm}`
  }
  return String(v)
}

// Convert an ISO string (or Date) to a Date object for storage, or null if
// unparseable. Storing startAt/endsAt as Dates lets MongoDB do range queries
// (string comparisons against a Date value would silently fail).
function toDateOrNull(v) {
  if (v == null || v === '') return null
  const d = v instanceof Date ? v : new Date(v)
  return isNaN(d.getTime()) ? null : d
}

// Emit startAt/endsAt to the client as ISO strings (DB stores them as Dates).
function toISODateOrNull(v) {
  if (v == null) return null
  const d = v instanceof Date ? v : new Date(v)
  return isNaN(d.getTime()) ? null : d.toISOString()
}

function toClientEvent(doc) {
  return {
    slugId: doc.slugId,
    title: doc.title,
    date: toDateString(doc.date),
    startTime: toTimeString(doc.startTime),
    endTime: toTimeString(doc.endTime),
    timezone: doc.timezone || null,
    startAt: toISODateOrNull(doc.startAt),
    endsAt: toISODateOrNull(doc.endsAt),
    location: doc.location,
    lat: doc.lat ?? null,
    lng: doc.lng ?? null,
    zipCode: doc.zipCode || '',
    description: doc.description || '',
    costType: doc.costType || 'free',
    price: doc.price ?? 0,
    category: doc.category || '',
    photoUrl: doc.photoUrl || null,
    creatorUserId: doc.creatorUserId || null,
    attending: doc.attending ?? 0,
    links: Array.isArray(doc.links) ? doc.links : [],
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  }
}

// Creates a new event with an Eventbrite-style unique URL slug:
//   slugId = "socal-jdm-meet-2026-a1b2c3"  ->  /event/{slugId}
export const createEvent = createServerFn({ method: 'POST' })
  .handler(async ({ data }) => {
    try {
      const { connectToDatabase } = await import('../lib/db')
      const { db } = await connectToDatabase()
      const events = db.collection('events')

      const d = data || {}
      const slug = slugify(d.title) || 'event'
      const shortId = genShortId()
      const slugId = `${slug}-${shortId}`

      // Attribute the event to the logged-in user when no explicit creator
      // was passed (e.g. the Create Event modal doesn't send one).
      let creatorUserId = d.creatorUserId || null
      if (!creatorUserId) {
        try {
          const sessionResult = await getSessionUser({ data: {} })
          creatorUserId = sessionResult?.userId || null
        } catch (e) {
          console.warn('[createEvent] Could not resolve session user:', e.message)
        }
      }

      const now = new Date()
      let lat = d.lat ?? null
      let lng = d.lng ?? null
      let timezone = d.timezone || null
      // Coords completeness: if a location string is set but no coordinates were
      // provided, best-effort geocode so the event participates in proximity search.
      // The geocode also returns the location's timezone, which we adopt unless the
      // user explicitly overrode it.
      if ((lat == null || lng == null) && (d.location || '').trim()) {
        const resolved = await geocodeLocation(d.location)
        if (resolved) {
          lat = resolved.lat
          lng = resolved.lng
          if (!timezone && resolved.timezone) timezone = resolved.timezone
        }
      }
      const dateStr = toDateString(d.date)
      const startTimeStr = toTimeString(d.startTime)
      const endTimeStr = toTimeString(d.endTime)
      const doc = {
        slugId,
        title: (d.title || '').trim(),
        date: dateStr,
        startTime: startTimeStr,
        endTime: endTimeStr,
        timezone,
        startAt: toDateOrNull(toAbsoluteInstant(dateStr, startTimeStr, timezone)),
        endsAt: toDateOrNull(
          toAbsoluteInstant(dateStr, endTimeStr, timezone, {
            rollToNextDay: true,
            after: toAbsoluteInstant(dateStr, startTimeStr, timezone),
          })
        ),
        location: d.location || '',
        lat,
        lng,
        geo: toGeo(lat, lng),
        zipCode: d.zipCode || '',
        description: d.description || '',
        costType: d.costType || 'free',
        price: d.price ?? 0,
        category: d.category || '',
        photoUrl: d.photoUrl || null,
        creatorUserId,
        attending: 0,
        links: Array.isArray(d.links) ? d.links.map((l) => String(l).trim()).filter(Boolean) : [],
        createdAt: now,
        updatedAt: now,
      }
      await events.insertOne(doc)
      console.log('[createEvent] Created', slugId)
      return { success: true, event: toClientEvent(doc) }
    } catch (err) {
      console.error('[createEvent] Failed:', err.message)
      return { success: false, error: err.message }
    }
  })

// Update an existing event (creator only). The slugId is preserved so the
// shareable URL stays stable; editable fields are overwritten from the form.
export const updateEvent = createServerFn({ method: 'POST' })
  .handler(async ({ data }) => {
    try {
      const { connectToDatabase } = await import('../lib/db')
      const { db } = await connectToDatabase()
      const events = db.collection('events')

      const d = data || {}
      const slugId = (d.slugId || '').trim()
      if (!slugId) return { success: false, error: 'Missing event id' }

      const existing = await events.findOne({ slugId })
      if (!existing) return { success: false, error: 'Event not found' }

      // Only the creator may edit (unless it has no creator, e.g. seeded legacy).
      let sessionUserId = existing.creatorUserId || null
      try {
        const sessionResult = await getSessionUser({ data: {} })
        if (sessionResult?.userId) sessionUserId = sessionResult.userId
      } catch (e) {
        console.warn('[updateEvent] Could not resolve session user:', e.message)
      }
      if (existing.creatorUserId && sessionUserId && existing.creatorUserId !== sessionUserId) {
        return { success: false, error: 'You can only edit events you created' }
      }

      const now = new Date()
      let lat = d.lat ?? existing.lat ?? null
      let lng = d.lng ?? existing.lng ?? null
      let timezone = d.timezone ?? existing.timezone ?? null
      // Coords completeness: geocode when still missing and we have a location.
      // Adopt the location's timezone unless the user explicitly overrode it.
      if ((lat == null || lng == null) && (d.location || existing.location)) {
        const resolved = await geocodeLocation(d.location || existing.location)
        if (resolved) {
          lat = resolved.lat
          lng = resolved.lng
          if (!timezone && resolved.timezone) timezone = resolved.timezone
        }
      }
      const dateStr = toDateString(d.date ?? existing.date)
      const startTimeStr = toTimeString(d.startTime ?? existing.startTime)
      const endTimeStr = toTimeString(d.endTime ?? existing.endTime)
      const doc = {
        ...existing,
        title: (d.title || '').trim(),
        date: dateStr,
        startTime: startTimeStr,
        endTime: endTimeStr,
        timezone,
        startAt: toDateOrNull(toAbsoluteInstant(dateStr, startTimeStr, timezone)),
        endsAt: toDateOrNull(
          toAbsoluteInstant(dateStr, endTimeStr, timezone, {
            rollToNextDay: true,
            after: toAbsoluteInstant(dateStr, startTimeStr, timezone),
          })
        ),
        location: d.location ?? existing.location,
        lat,
        lng,
        geo: toGeo(lat, lng),
        zipCode: d.zipCode ?? existing.zipCode,
        description: d.description ?? existing.description,
        costType: d.costType ?? existing.costType,
        price: d.price ?? existing.price,
        category: d.category ?? existing.category,
        photoUrl: d.photoUrl ?? existing.photoUrl,
        links: Array.isArray(d.links) ? d.links.map((l) => String(l).trim()).filter(Boolean) : existing.links || [],
        updatedAt: now,
      }

      await events.replaceOne({ _id: existing._id }, doc)
      console.log('[updateEvent] Updated', slugId)
      return { success: true, event: toClientEvent(doc) }
    } catch (err) {
      console.error('[updateEvent] Failed:', err.message)
      return { success: false, error: err.message }
    }
  })

// Public: fetch a single event by its slugId (the unique URL segment).
export const getEventBySlugId = createServerFn({ method: 'GET' })
  .handler(async ({ data }) => {
    try {
      const { connectToDatabase } = await import('../lib/db')
      const { db } = await connectToDatabase()
      const slugId = (data?.slugId || '').trim()
      if (!slugId) return { event: null }

      const doc = await db.collection('events').findOne({ slugId })
      if (!doc) return { event: null }
      return { event: toClientEvent(doc) }
    } catch (err) {
      console.error('[getEventBySlugId] Failed:', err.message)
      return { event: null }
    }
  })

// Public: list events, newest first. Optionally filter to one creator.
// By default hides events that have already ended (endsAt in the past) so the
// Explore screen never shows stale events. Pass { includePast: true } to keep
// them (used by My Events for the duplicate feature).
export const listEvents = createServerFn({ method: 'GET' })
  .handler(async ({ data }) => {
    try {
      const { connectToDatabase } = await import('../lib/db')
      const { db } = await connectToDatabase()
      const query = data?.creatorUserId ? { creatorUserId: data.creatorUserId } : {}
      if (!data?.includePast) {
        // Hide events that have ended. Events without an endsAt (legacy) are
        // kept — they have no end time to expire against.
        query.$or = [{ endsAt: { $gte: new Date() } }, { endsAt: { $exists: false } }]
      }
      const docs = await db.collection('events').find(query).sort({ date: -1 }).toArray()
      return { events: docs.map(toClientEvent) }
    } catch (err) {
      console.error('[listEvents] Failed:', err.message)
      return { events: [] }
    }
  })

// Public: list events within a radius of a point, nearest-first — server-side
// geo via MongoDB $geoNear on the `geo` (2dsphere) field. Each event carries a
// `distanceMiles` so the client can show proximity without any math. On failure
// (e.g. the 2dsphere index is missing) returns success:false so the client can
// fall back to the unfiltered list.
export const listEventsNearby = createServerFn({ method: 'GET' })
  .handler(async ({ data }) => {
    try {
      const { connectToDatabase } = await import('../lib/db')
      const { db } = await connectToDatabase()
      const events = db.collection('events')

      const lat = Number(data?.lat)
      const lng = Number(data?.lng)
      const radiusMiles = Number(data?.radiusMiles) || 25
      if (!Number.isFinite(lat) || !Number.isFinite(lng) || radiusMiles <= 0) {
        return { success: false, error: 'Invalid location or radius' }
      }

      const docs = await events
        .aggregate([
          {
            $geoNear: {
              near: { type: 'Point', coordinates: [lng, lat] },
              distanceField: 'distanceMeters',
              maxDistance: radiusMiles * 1609.344, // miles → meters
              spherical: true,
            },
          },
          // Hide events that have already ended (keep legacy events with no endsAt).
          {
            $match: {
              $or: [{ endsAt: { $gte: new Date() } }, { endsAt: { $exists: false } }],
            },
          },
        ])
        .toArray()

      const evs = docs.map((doc) => {
        const e = toClientEvent(doc)
        const miles = doc.distanceMeters != null ? doc.distanceMeters / 1609.344 : null
        e.distanceMiles = miles != null ? Math.round(miles * 10) / 10 : null
        return e
      })
      return { success: true, events: evs }
    } catch (err) {
      console.error('[listEventsNearby] Failed:', err.message)
      return { success: false, error: err.message }
    }
  })

// Server fn to grab the session user id (reused by createEvent callers).
export const getSessionUser = createServerFn({ method: 'GET' })
  .handler(async () => {
    try {
      const request = getRequest()
      const { auth } = await import('../lib/auth')
      const session = await auth.api.getSession({ headers: request?.headers })
      return { userId: session?.user?.id || null, user: session?.user || null }
    } catch (err) {
      console.warn('[getSessionUser] Failed:', err.message)
      return { userId: null, user: null }
    }
  })
