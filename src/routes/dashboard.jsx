import { createFileRoute, useLoaderData } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import Sidebar from '#/components/dashboard/Sidebar'
import TopSection, { TopActions } from '#/components/dashboard/TopSection'
import AboutMe from '#/components/dashboard/AboutMe'
import MyGarage from '#/components/dashboard/MyGarage'
import MyHighway from '#/components/dashboard/MyHighway'
import EditProfileModal from '#/components/dashboard/EditProfileModal'
import UploadPhotoModal from '#/components/dashboard/UploadPhotoModal'

function getDashboardData() {
  return {
    profile: {
      userId: 'user_001',
      username: 'CarEnthusiast',
      handle: '@cardude',
      bio: 'Car enthusiast and show organizer',
      avatarUrl: null,
      location: 'Los Angeles, CA',
      joinedAt: '2024-01-15',
      socialLinks: ['instagram', 'twitter'],
      aboutMe: 'I love cars and car shows!',
      favoriteBrand: 'Porsche',
      dreamCar: '911 GT3 RS',
      occupation: 'Mechanic',
      driveStyle: 'Sport',
      stats: {
        totalPoints: { value: '12.5K', label: 'Total Points' },
        badges: { value: '24', label: 'Badges' },
        carsInGarage: { value: '3', label: 'Cars in Garage' },
        followers: { value: '1.2K', label: 'Followers' },
        following: { value: '89', label: 'Following' },
      },
    },
    vehicles: [
      { name: 'Porsche 911 GT3', specs: '2023 | 502 HP | RWD' },
      { name: 'BMW M3 Competition', specs: '2024 | 503 HP | AWD' },
      { name: 'Shelby GT500', specs: '2022 | 760 HP | RWD' },
    ],
    activities: [
      { type: 'show', action: 'Attended', description: 'Porsche Owners Club Meetup', timestamp: '2h ago', likes: 24, comments: 3 },
      { type: 'award', action: 'Won', description: 'Best in Show - Luxury Class', timestamp: '1d ago', likes: 56, comments: 8 },
      { type: 'upload', action: 'Added', description: '5 new photos to gallery', timestamp: '3d ago', likes: 12, comments: 1 },
    ],
    images: [],
  }
}

export const Route = createFileRoute('/dashboard')({
  component: DashboardPage,
  loader: async () => {
    console.log('[Dashboard] loader running on server')
    try {
      const data = getDashboardData()
      return { data, error: null }
    } catch (err) {
      console.error('[Dashboard] loader error:', err)
      return { data: null, error: err.message }
    }
  },
})

function DashboardPage() {
  const loaderData = useLoaderData({ from: '/dashboard' })
  const [data, setData] = useState(loaderData?.data ?? null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(loaderData?.error ?? null)
  const [dataSourceInfo, setDataSourceInfo] = useState({ source: '', dbAvailable: false })
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [showUpload, setShowUpload] = useState(false)

  useEffect(() => {
    console.log('[Dashboard] mounted with loaderData:', !!loaderData)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#04080b] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-[#e10908] border-t-transparent mx-auto" />
          <p className="mt-4 text-[#AAAAAA] text-[16px]">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#04080b] flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-[#e10908] text-[48px] mb-4">!</div>
          <h2 className="text-white text-[24px] font-semibold mb-2">Failed to Load Dashboard</h2>
          <p className="text-[#AAAAAA] text-[16px] mb-4">
            {error || 'Could not retrieve dashboard data.'}
          </p>
          <p className="text-[#888888] text-[14px]">
            Make sure MongoDB is running and has seed data, or the JSON fallback will be used automatically.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-2 bg-[#e10908] text-white rounded-lg hover:bg-[#c00807] transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  const { profile, vehicles, activities } = data

  return (
    <div className="min-h-screen bg-[#04080b] flex">
      <Sidebar profile={profile} activeNav="dashboard" dataSourceInfo={dataSourceInfo} />

      <main className="flex-1 flex flex-col gap-4 p-5 pt-16 lg:pt-5 overflow-y-auto relative">
        <TopActions />
        <TopSection profile={profile} onEditProfile={() => setShowEditProfile(true)} />

        <div className="flex flex-col lg:flex-row gap-2.5 flex-1 min-h-0">
          <AboutMe profile={profile} />

          <div className="flex flex-col gap-2.5 flex-1">
            <div className="lg:h-[201px]">
              <MyGarage vehicles={vehicles} />
            </div>
            <div className="flex-1">
              <MyHighway activities={activities} onUpload={() => setShowUpload(true)} />
            </div>
          </div>
        </div>

        <EditProfileModal
          isOpen={showEditProfile}
          onClose={() => setShowEditProfile(false)}
          profile={profile}
          onUploadPhoto={() => { setShowEditProfile(false); setShowUpload(true) }}
        />
        <UploadPhotoModal
          isOpen={showUpload}
          onClose={() => setShowUpload(false)}
        />
      </main>
    </div>
  )
}
