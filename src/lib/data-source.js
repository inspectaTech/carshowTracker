import { checkDatabaseConnection } from './db'
import sampleData from '../data/dashboard-sample.json' with { type: 'json' }

// -------- Cached DB status --------

let dbStatusCache = { available: false, lastChecked: 0 }
const CACHE_TTL = 30_000 // 30 seconds

async function refreshDbStatus() {
  try {
    const result = await checkDatabaseConnection()
    dbStatusCache = {
      available: result.success,
      lastChecked: Date.now(),
    }
  } catch {
    dbStatusCache = { available: false, lastChecked: Date.now() }
  }
  return dbStatusCache.available
}

export async function getDataSourceStatus() {
  const now = Date.now()
  if (now - dbStatusCache.lastChecked > CACHE_TTL) {
    await refreshDbStatus()
  }
  return {
    dbAvailable: dbStatusCache.available,
    source: dbStatusCache.available ? 'mongodb' : 'json',
  }
}

// -------- JSON fallback reader --------

function getDashboardDataFromJSON() {
  return {
    profile: { ...sampleData.profile },
    vehicles: [...sampleData.vehicles],
    activities: [...sampleData.activities],
    images: [...sampleData.images],
  }
}

// -------- MongoDB reader --------

async function getDashboardDataFromDB(userId) {
  const { connectToDatabase } = await import('./db')
  const { db } = await connectToDatabase()

  const [profileDoc, vehiclesDocs, activitiesDocs, imagesDocs] = await Promise.all([
    db.collection('profiles').findOne({ userId }),
    db.collection('vehicles').find({ userId }).toArray(),
    db.collection('activities').find({ userId }).sort({ timestamp: -1 }).toArray(),
    db.collection('images').find({ userId }).toArray(),
  ])

  if (!profileDoc) return getDashboardDataFromJSON()

  return {
    profile: {
      userId: profileDoc.userId,
      username: profileDoc.username,
      handle: profileDoc.handle,
      bio: profileDoc.bio,
      avatarUrl: profileDoc.avatarUrl,
      location: profileDoc.location,
      joinedAt: profileDoc.joinedAt,
      socialLinks: profileDoc.socialLinks,
      aboutMe: profileDoc.aboutMe,
      favoriteBrand: profileDoc.favoriteBrand,
      dreamCar: profileDoc.dreamCar,
      occupation: profileDoc.occupation,
      driveStyle: profileDoc.driveStyle,
      stats: {
        totalPoints: { value: formatStat(profileDoc.stats.totalPoints), label: 'Total Points' },
        badges: { value: String(profileDoc.stats.badges), label: 'Badges' },
        carsInGarage: { value: String(profileDoc.stats.carsInGarage), label: 'Cars in Garage' },
        followers: { value: formatStat(profileDoc.stats.followers), label: 'Followers' },
        following: { value: String(profileDoc.stats.following), label: 'Following' },
      },
    },
    vehicles: vehiclesDocs.map((v) => ({
      name: v.name,
      specs: `${v.year} | ${v.hp} HP | ${v.drivetrain}`,
    })),
    activities: activitiesDocs.map((a) => ({
      type: a.type,
      action: a.action,
      description: a.description,
      imageUrl: a.imageUrl,
      timestamp: formatRelativeTime(a.timestamp),
      likes: a.likes,
      comments: a.comments,
    })),
    images: imagesDocs.map((img) => ({
      userId: img.userId,
      url: img.url,
      type: img.type,
      originalName: img.originalName,
      fileSize: img.fileSize,
      mimeType: img.mimeType,
      uploadedAt: img.uploadedAt,
    })),
  }
}

// -------- Helpers --------

function formatStat(val) {
  if (!val) return '0'
  if (val >= 1000) return (val / 1000).toFixed(val % 1000 === 0 ? 0 : 1) + 'K'
  return String(val)
}

function formatRelativeTime(date) {
  if (typeof date === 'string') return date
  const now = new Date()
  const diffMs = now - new Date(date)
  const diffHrs = Math.floor(diffMs / 3_600_000)
  if (diffHrs < 1) return `${Math.floor(diffMs / 60_000)}m ago`
  if (diffHrs < 24) return `${diffHrs}h ago`
  return `${Math.floor(diffHrs / 24)}d ago`
}

// -------- Public API --------

export const dataSource = {
  async getDashboardData(userId = 'user_001') {
    const { dbAvailable } = await getDataSourceStatus()
    return dbAvailable ? getDashboardDataFromDB(userId) : getDashboardDataFromJSON()
  },

  async getDataSourceStatus() {
    return getDataSourceStatus()
  },
}
