import { useState, useEffect } from 'react'
import Sidebar from '#/components/dashboard/Sidebar'
import { loadDashboardData, updateHomeLocation } from '#/server/session'
import { listProfiles } from '#/server/db-actions'
import { listEvents, listEventsNearby } from '#/server/events'
import VirtualizedEventList from './VirtualizedEventList'
import VicinityMenu from './VicinityMenu'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import { Search, MapPin } from 'lucide-react'

const TABS = ['All', 'Shows', 'Users', 'Events']

export default function ExplorePage() {
  const [profile, setProfile] = useState(null)
  const [events, setEvents] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [locationMode, setLocationMode] = useState('everywhere') // everywhere | current | home | near
  const [radius, setRadius] = useState(25)
  const [vicinityPoint, setVicinityPoint] = useState(null) // { lat, lng, label } when a proximity mode is active
  const [vicinityStatus, setVicinityStatus] = useState('idle') // idle | detecting | ready | error | missing-home
  const [vicinityLabel, setVicinityLabel] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [savedHome, setSavedHome] = useState(false)

  const homeLocation = profile?.homeLocation || null

  // Profile + all users, once.
  useEffect(() => {
    async function loadData() {
      try {
        const result = await loadDashboardData()
        setProfile(result?.data?.profile || null)
      } catch (err) {
        console.error('[Explore] Failed to load data:', err)
      }
      try {
        const userResult = await listProfiles()
        if (userResult?.users) setUsers(userResult.users)
      } catch (err) {
        console.error('[Explore] Failed to load users:', err)
      }
    }
    loadData()
  }, [])

  // Events are driven by the vicinity mode: a ready point → server-side
  // $geoNear query (listEventsNearby); otherwise the full list. On a geo-query
  // failure we fall back to all events + an error status (pure server-side, no
  // client distance math).
  useEffect(() => {
    let cancelled = false
    async function loadEvents() {
      setLoading(true)
      try {
        if (vicinityPoint) {
          const res = await listEventsNearby({
            data: { lat: vicinityPoint.lat, lng: vicinityPoint.lng, radiusMiles: radius },
          })
          if (cancelled) return
          if (res?.success) {
            setEvents(res.events || [])
            setVicinityStatus('ready')
          } else {
            const all = await listEvents()
            if (cancelled) return
            setEvents(all?.events || [])
            setVicinityStatus('error')
          }
        } else {
          const all = await listEvents()
          if (!cancelled) setEvents(all?.events || [])
        }
      } catch (err) {
        console.error('[Explore] Failed to load events:', err)
        if (!cancelled) {
          const all = await listEvents()
          setEvents(all?.events || [])
          setVicinityStatus('error')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    loadEvents()
    return () => { cancelled = true }
  }, [locationMode, radius, vicinityPoint])

  const handleModeChange = (nextMode) => {
    setLocationMode(nextMode)
    if (nextMode === 'everywhere') {
      setVicinityPoint(null)
      setVicinityLabel(null)
      setVicinityStatus('idle')
      setMenuOpen(false)
      return
    }
    // Proximity modes keep the menu open (radius + status controls live there).
    setMenuOpen(true)
    if (nextMode === 'current') {
      if (typeof navigator === 'undefined' || !navigator.geolocation) {
        setVicinityPoint(null)
        setVicinityStatus('error')
        return
      }
      setVicinityStatus('detecting')
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setVicinityPoint({ lat: pos.coords.latitude, lng: pos.coords.longitude })
          setVicinityLabel('Current location')
          setVicinityStatus('ready')
        },
        () => {
          setVicinityPoint(null)
          setVicinityStatus('error')
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      )
      return
    }
    if (nextMode === 'home') {
      if (homeLocation && homeLocation.lat != null && homeLocation.lng != null) {
        setVicinityPoint({ lat: homeLocation.lat, lng: homeLocation.lng })
        setVicinityLabel(homeLocation.address || 'Home')
        setVicinityStatus('ready')
      } else {
        setVicinityPoint(null)
        setVicinityStatus('missing-home')
      }
      return
    }
    // near — wait for an address pick
    setVicinityPoint(null)
    setVicinityStatus('idle')
  }

  const handleNearPicked = (point) => {
    setVicinityPoint({ lat: point.lat, lng: point.lng })
    setVicinityLabel(point.label)
    setVicinityStatus('ready')
    setSavedHome(false)
    setMenuOpen(false)
  }

  const handleRadiusChange = (r) => setRadius(r)

  // Persist the currently-picked vicinity location as the user's Home.
  const handleSetAsHome = async () => {
    if (!vicinityPoint) return
    const home = {
      address: vicinityLabel || 'Home',
      lat: vicinityPoint.lat,
      lng: vicinityPoint.lng,
    }
    try {
      const res = await updateHomeLocation({ data: { homeLocation: home } })
      if (res?.success) {
        setProfile((p) => ({ ...(p || {}), homeLocation: home }))
        setSavedHome(true)
      }
    } catch (err) {
      console.error('[Explore] Failed to save home:', err)
    }
  }

  const q = searchQuery.trim().toLowerCase()
  const filteredEvents = events.filter((e) => !q || (e.title || '').toLowerCase().includes(q))
  const filteredUsers = users.filter(
    (u) => !q || (u.name && u.name.toLowerCase().includes(q)) || (u.handle && u.handle.toLowerCase().includes(q))
  )

  // Tab → what to show. "All" shows events + all users.
  const showEvents = activeTab === 'All' || activeTab === 'Events' || activeTab === 'Shows'
  const showUsers = activeTab === 'All' || activeTab === 'Users'

  const hasAny = (showEvents && filteredEvents.length > 0) || (showUsers && filteredUsers.length > 0)

  const chipLabel =
    locationMode === 'everywhere'
      ? 'Everywhere'
      : locationMode === 'current'
        ? 'Current Vicinity'
        : locationMode === 'home'
          ? vicinityLabel || 'Home'
          : vicinityLabel || 'Near a location…'

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
          {/* Location chip + dropdown */}
          <div data-part="vicinity" className="relative">
            <button
              data-part="location-chip"
              onClick={() => setMenuOpen((o) => !o)}
              className="flex items-center gap-2 px-4 py-2 bg-[#04080b] border border-[#333333] rounded-full text-white text-[13px] sm:text-[14px] hover:border-[#555555] transition-colors"
            >
              <MapPin className="h-4 w-4 text-[#e10908]" />
              <span className="max-w-[180px] truncate">{chipLabel}</span>
              <span className="text-[#555555]">▾</span>
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                <VicinityMenu
                  mode={locationMode}
                  radius={radius}
                  homeLocation={homeLocation}
                  vicinityStatus={vicinityStatus}
                  vicinityLabel={vicinityLabel}
                  savedHome={savedHome}
                  onModeChange={handleModeChange}
                  onRadiusChange={handleRadiusChange}
                  onNearPicked={handleNearPicked}
                  onSetAsHome={handleSetAsHome}
                />
              </>
            )}
          </div>
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
          className="flex-1 min-h-0 flex flex-col p-4 sm:p-8"
        >
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#e10908] border-t-transparent" />
            </div>
          ) : hasAny ? (
            <div className="flex-1 min-h-0 flex flex-col max-w-4xl w-full">
              <VirtualizedEventList
                events={showEvents ? filteredEvents : []}
                users={showUsers ? filteredUsers : []}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <Search className="h-12 w-12 text-[#333333] mb-3" />
              <p className="text-[#888888] text-[16px]">
                {q
                  ? 'No results match your search'
                  : locationMode !== 'everywhere'
                    ? 'No events in this vicinity'
                    : `No ${activeTab.toLowerCase()} found`}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
