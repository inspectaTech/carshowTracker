import { useState, useEffect } from 'react'
import Sidebar from '#/components/dashboard/Sidebar'
import { loadDashboardData } from '#/server/session'
import { listProfiles } from '#/server/db-actions'
import { listEvents } from '#/server/events'
import EventCard from '#/components/events/EventCard'
import UserCard from './UserCard'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import { Search, MapPin } from 'lucide-react'
import MapView from './MapView'

const TABS = ['All', 'Shows', 'Users', 'Events']

export default function ExplorePage() {
  const [profile, setProfile] = useState(null)
  const [events, setEvents] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [locationMode, setLocationMode] = useState('Current Vicinity')

  useEffect(() => {
    async function loadData() {
      try {
        const result = await loadDashboardData()
        setProfile(result?.data?.profile || null)
      } catch (err) {
        console.error('[Explore] Failed to load data:', err)
      }
      // Explore shows ALL events + ALL users in the DB.
      try {
        const [evResult, userResult] = await Promise.all([
          listEvents(),
          listProfiles(),
        ])
        if (evResult?.events) setEvents(evResult.events)
        if (userResult?.users) setUsers(userResult.users)
      } catch (err) {
        console.error('[Explore] Failed to load explore data:', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const q = searchQuery.trim().toLowerCase()
  const filteredEvents = events.filter((e) => !q || e.title.toLowerCase().includes(q))
  const filteredUsers = users.filter(
    (u) => !q || (u.name && u.name.toLowerCase().includes(q)) || (u.handle && u.handle.toLowerCase().includes(q))
  )

  // Tab → what to show. "All" shows events + all users.
  const showEvents = activeTab === 'All' || activeTab === 'Events' || activeTab === 'Shows'
  const showUsers = activeTab === 'All' || activeTab === 'Users'

  const hasAny = (showEvents && filteredEvents.length > 0) || (showUsers && filteredUsers.length > 0)

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
          <div data-part="search-field" className="flex-1 min-w-[200px] max-w-md">
            <TextField
              data-part="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search car shows, users, events..."
              size="small"
              fullWidth
              slotProps={{
                input: {
                  startAdornment: <InputAdornment position="start"><Search className="h-5 w-5 text-[#555555]" /></InputAdornment>,
                },
              }}
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
              {/* Left column - unified Event + User cards */}
              <div data-part="left-column" className="flex-1 flex flex-col gap-4 max-w-4xl">
                {showEvents &&
                  filteredEvents.map((event) => (
                    <EventCard key={event.slugId || event.title} event={event} />
                  ))}

                {showUsers &&
                  filteredUsers.map((user) => (
                    <UserCard key={user.id || user.handle || user.name} user={user} />
                  ))}

                {!hasAny && (
                  <div className="flex flex-col items-center justify-center h-64 text-center">
                    <Search className="h-12 w-12 text-[#333333] mb-3" />
                    <p className="text-[#888888] text-[16px]">
                      {q ? 'No results match your search' : `No ${activeTab.toLowerCase()} found`}
                    </p>
                  </div>
                )}
              </div>

              {/* Right column - Map */}
              <div data-part="right-column" className="w-full lg:w-[400px] flex flex-col gap-4">
                <div data-part="map-container" className="rounded-xl overflow-hidden h-[220px]">
                  <MapView />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
