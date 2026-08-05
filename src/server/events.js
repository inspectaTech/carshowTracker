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

function toClientEvent(doc) {
  return {
    slugId: doc.slugId,
    title: doc.title,
    date: doc.date,
    startTime: doc.startTime,
    endTime: doc.endTime,
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
      const doc = {
        slugId,
        title: (d.title || '').trim(),
        date: d.date || null,
        startTime: d.startTime || '',
        endTime: d.endTime || '',
        location: d.location || '',
        lat: d.lat ?? null,
        lng: d.lng ?? null,
        zipCode: d.zipCode || '',
        description: d.description || '',
        costType: d.costType || 'free',
        price: d.price ?? 0,
        category: d.category || '',
        photoUrl: d.photoUrl || null,
        creatorUserId,
        attending: 0,
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
export const listEvents = createServerFn({ method: 'GET' })
  .handler(async ({ data }) => {
    try {
      const { connectToDatabase } = await import('../lib/db')
      const { db } = await connectToDatabase()
      const query = data?.creatorUserId ? { creatorUserId: data.creatorUserId } : {}
      const docs = await db.collection('events').find(query).sort({ date: -1 }).toArray()
      return { events: docs.map(toClientEvent) }
    } catch (err) {
      console.error('[listEvents] Failed:', err.message)
      return { events: [] }
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
