import { useState, useEffect } from 'react'
import Sidebar from '#/components/dashboard/Sidebar'
import { getDashboardData } from '#/server/db-actions'
import { Search, Map, Users, Calendar, MapPin } from 'lucide-react'

const FEATURED_EVENTS = [
  {
    id: 'e1',
    title: 'SoCal JDM Meet 2026',
    date: 'Jul 15',
    location: 'Los Angeles, CA',
    attending: 234,
    image: null,
  },
  {
    id: 'e2',
    title: 'JDM Legends Show',
    date: 'Aug 3',
    location: 'San Diego, CA',
    attending: 89,
    image: null,
  },
  {
    id: 'e3',
    title: 'Euro Night Cruise',
    date: 'Jul 22',
    location: 'Santa Monica, CA',
    attending: 56,
    image: null,
  },
]

const POPULAR_USERS = [
  { id: 'u1', name: 'Gearhead_23', cars: 12, followers: '1.8K' },
  { id: 'u2', name: 'MuscleCarMike', cars: 8, followers: '942' },
]

const TABS = ['All', 'Shows', 'Users', 'Events']

export default function ExplorePage() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [locationMode, setLocationMode] = useState('Current Vicinity')

  useEffect(() => {
    async function loadData() {
      try {
        const result = await getDashboardData({ data: { userId: 'user_001' } })
        setProfile(result.profile)
      } catch (err) {
        console.error('[Explore] Failed to load data:', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const filteredEvents = FEATURED_EVENTS.filter((e) =>
    e.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div data-component="explore-page" className="min-h-screen bg-[#04080b] flex flex-col lg:flex-row">
      <Sidebar profile={profile} activeNav="explore" />

      <main
        data-part="main-content"
        className="flex-1 flex flex-col min-h-screen lg:min-h-0 overflow-y-auto"
      >
        {/* Header */}
        <header
          data-part="page-header"
          className="bg-[#0a0d12] px-4 sm:px-8 py-4 sm:py-5 flex items-center justify-between shrink-0"
        >
          <div data-part="title-block" className="flex items-center gap-3">
            <Search className="h-6 w-6 sm:h-7 sm:w-7 text-[#e10908]" />
            <h1 className="text-white text-[22px] sm:text-[28px] font-medium">
              Explore
            </h1>
          </div>
          {/* Location chip */}
          <button
            data-part="location-chip"
            className="flex items-center gap-2 px-4 py-2 bg-[#04080b] border border-[#333333] rounded-full text-white text-[13px] sm:text-[14px] hover:border-[#555555] transition-colors"
          >
            <MapPin className="h-4 w-4 text-[#e10908]" />
            {locationMode} ▾
          </button>
        </header>

        {/* Search + Tabs */}
        <div
          data-part="search-row"
          className="bg-[#04080b] px-4 sm:px-8 py-3 flex items-center gap-4 flex-wrap shrink-0 border-b border-[#1a1d22]"
        >
          <div data-part="search-field" className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#555555]" />
            <input
              type="text"
              data-part="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search car shows, users, events..."
              className="w-full pl-9 pr-3 py-2 bg-[#0a0d12] text-white text-[14px] placeholder-[#555555] rounded-lg border border-[#1a1d22] focus:outline-none focus:border-[#e10908] transition-colors"
            />
          </div>

          {/* Tabs */}
          <nav data-part="category-tabs" className="flex items-center gap-5">
            {TABS.map((tab) => (
              <button
                key={tab}
                data-part={`tab-${tab.toLowerCase()}`}
                onClick={() => setActiveTab(tab)}
                className={`text-[14px] sm:text-[15px] font-normal transition-colors pb-1 ${
                  activeTab === tab
                    ? 'text-[#e10908] border-b-2 border-[#e10908]'
                    : 'text-[#888888] hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div
          data-part="content-area"
          className="flex-1 p-4 sm:p-8 overflow-y-auto"
        >
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#e10908] border-t-transparent" />
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-5 h-full">
              {/* Left column - Events */}
              <div data-part="left-column" className="flex-1 flex flex-col gap-4">
                {/* Featured card */}
                {filteredEvents.length > 0 && (
                  <div
                    data-component="FeaturedEvent"
                    className="bg-[#0a0d12] rounded-xl overflow-hidden"
                  >
                    <div className="h-[120px] bg-[#1a1d22] flex items-center justify-center">
                      <Calendar className="h-10 w-10 text-[#333333]" />
                    </div>
                    <div className="p-4 space-y-2">
                      <h3 className="text-white text-[18px] font-medium">
                        {filteredEvents[0].title}
                      </h3>
                      <p className="text-[#888888] text-[13px]">
                        📅 {filteredEvents[0].date} &bull; 📍 {filteredEvents[0].location} &bull; 👥 {filteredEvents[0].attending} attending
                      </p>
                    </div>
                  </div>
                )}

                {/* Result cards */}
                {filteredEvents.slice(1).map((event) => (
                  <div
                    key={event.id}
                    data-component="EventCard"
                    className="bg-[#0a0d12] rounded-xl p-4 flex items-center gap-4 hover:bg-[#0e1116] transition-colors cursor-pointer"
                  >
                    <div className="w-[70px] h-[70px] bg-[#1a1d22] rounded-full shrink-0 flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-[#333333]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white text-[16px] font-medium truncate">{event.title}</h4>
                      <p className="text-[#888888] text-[13px]">{event.date} &bull; {event.location} &bull; {event.attending} attending</p>
                    </div>
                  </div>
                ))}

                {filteredEvents.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-64 text-center">
                    <Search className="h-12 w-12 text-[#333333] mb-3" />
                    <p className="text-[#888888] text-[16px]">No events match your search</p>
                  </div>
                )}
              </div>

              {/* Right column - Map + Users */}
              <div data-part="right-column" className="w-full lg:w-[400px] flex flex-col gap-4">
                {/* Map placeholder */}
                <div
                  data-part="map-placeholder"
                  className="bg-[#0a0d12] rounded-xl h-[220px] flex flex-col items-center justify-center gap-3"
                >
                  <Map className="h-12 w-12 text-[#333333]" />
                  <p className="text-[#555555] text-[14px]">Map view coming soon</p>
                </div>

                {/* Popular users */}
                <h3 data-part="section-title" className="text-white text-[18px] font-medium mt-2">
                  Popular in Your Area
                </h3>

                {POPULAR_USERS.map((user) => (
                  <div
                    key={user.id}
                    data-component="PopularUser"
                    className="bg-[#0a0d12] rounded-xl p-4 flex items-center gap-3 hover:bg-[#0e1116] transition-colors cursor-pointer"
                  >
                    <div className="w-[44px] h-[44px] bg-[#1a1d22] rounded-full shrink-0 flex items-center justify-center">
                      <Users className="h-5 w-5 text-[#333333]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-white text-[15px] font-medium truncate">{user.name}</p>
                      <p className="text-[#888888] text-[12px]">{user.cars} cars &bull; {user.followers} followers</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
