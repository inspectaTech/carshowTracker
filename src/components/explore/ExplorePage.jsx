import { useState, useEffect, useCallback, useRef } from 'react'
import Sidebar from '#/components/dashboard/Sidebar'
import { loadDashboardData, updateHomeLocation } from '#/server/session'
import { listProfiles } from '#/server/db-actions'
import { listEvents, listEventsNearby } from '#/server/events'
import VirtualizedEventList from './VirtualizedEventList'
import VicinityMenu from './VicinityMenu'
import NearLocationModal from './NearLocationModal'
import ToastStack from '#/components/ui/ToastStack'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import { Search, MapPin } from 'lucide-react'

const TABS = ['All', 'Users', 'Events']

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
  const [nearModalOpen, setNearModalOpen] = useState(false)
  const [nearModalInitial, setNearModalInitial] = useState(null)
  const [nearModalIntent, setNearModalIntent] = useState('near') // 'home' | 'near'
  const [toasts, setToasts] = useState([])
  const pendingRevertRef = useRef(null)

  const dismissToast = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), [])
  const pushToast = useCallback((type, message) => {
    const id = Date.now() + Math.random()
    setToasts((t) => [...t.slice(-2), { id, type, message }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500)
  }, [])

  const homeLocation = profile?.homeLocation || null

  // True when the active vicinity point matches the saved Home (drives the
  // "Saved as Home" state in the dropdown).
  const isCurrentHome = !!(
    homeLocation &&
    vicinityPoint &&
    homeLocation.lat === vicinityPoint.lat &&
    homeLocation.lng === vicinityPoint.lng
  )

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
        // Home chosen but not set — show the "No home set yet" state in the
        // dropdown (the user can click "Set home location" to open the modal
        // with intent 'home').
        setVicinityPoint(null)
        setVicinityLabel(null)
        setVicinityStatus('missing-home')
      }
      return
    }
    // near — open the modal (search + map) to pick a point. Re-selecting near
    // keeps the current pick (Change behavior); switching from another mode
    // captures the current filter as the revert target, then starts fresh.
    if (locationMode === 'near') {
      openNearModal(vicinityPoint, null)
    } else {
      const revertTo = { mode: locationMode, point: vicinityPoint, label: vicinityLabel, status: vicinityStatus }
      setVicinityPoint(null)
      setVicinityLabel(null)
      setVicinityStatus('idle')
      openNearModal(null, revertTo)
    }
  }

  const handleRadiusChange = (r) => setRadius(r)

  // Close the dropdown. If the user is on "Home" but no home is set (they just
  // peeked at the option), revert to "Everywhere" — a Home selection with no
  // home is meaningless and shouldn't persist as the active filter.
  const closeMenu = () => {
    setMenuOpen(false)
    if (locationMode === 'home' && vicinityStatus === 'missing-home') {
      setLocationMode('everywhere')
      setVicinityPoint(null)
      setVicinityLabel(null)
      setVicinityStatus('idle')
    }
  }

  // Open the near-location modal, pre-filled with an optional starting point
  // (the current pick, or the saved Home when editing it). `revertTo` is the
  // filter state to restore if the user cancels without applying.
  // `intent` controls the modal's buttons: 'home' = set/update home (single red
  // "Set as Home" submit); 'near' = explore from a point (Set as Home + Use
  // this location).
  const openNearModal = (initial = null, revertTo = null, intent = 'near') => {
    pendingRevertRef.current = revertTo
    setNearModalIntent(intent)
    const hasPoint = initial && typeof initial.lat === 'number'
    setNearModalInitial(
      hasPoint
        ? { address: initial.label || initial.address || '', lat: initial.lat, lng: initial.lng }
        : null
    )
    setNearModalOpen(true)
    setMenuOpen(false)
  }

  // Cancelling the modal (without "Use this location" / "Set as Home") restores
  // the last known good filter — whatever was active before the modal opened
  // (everywhere, home, or a previous current-vicinity point).
  // For intent 'home' (set/update home), cancelling just closes the modal and
  // returns to the Home mode state (missing-home if still unset, or the current
  // home if one exists) — it does NOT revert to a stale filter.
  const handleCancelNearModal = () => {
    setNearModalOpen(false)
    const prev = pendingRevertRef.current
    pendingRevertRef.current = null
    if (nearModalIntent === 'home') {
      // Return to the Home mode state based on the current home.
      if (homeLocation && homeLocation.lat != null && homeLocation.lng != null) {
        setLocationMode('home')
        setVicinityPoint({ lat: homeLocation.lat, lng: homeLocation.lng })
        setVicinityLabel(homeLocation.address || 'Home')
        setVicinityStatus('ready')
      } else {
        setLocationMode('home')
        setVicinityPoint(null)
        setVicinityLabel(null)
        setVicinityStatus('missing-home')
      }
      return
    }
    if (prev) {
      // When the previous mode was "home", always derive the state from the
      // CURRENT home (the modal may have set or cleared it while open) so the
      // menu text agrees with reality — never a stale missing-home/ready.
      if (prev.mode === 'home') {
        const hasHome = homeLocation && homeLocation.lat != null && homeLocation.lng != null
        setLocationMode('home')
        if (hasHome) {
          setVicinityPoint({ lat: homeLocation.lat, lng: homeLocation.lng })
          setVicinityLabel(homeLocation.address || 'Home')
          setVicinityStatus('ready')
        } else {
          // Home was cleared inside the modal — there's no valid "home" filter,
          // so fall back to the meaningful default, everywhere.
          setLocationMode('everywhere')
          setVicinityPoint(null)
          setVicinityLabel(null)
          setVicinityStatus('idle')
        }
        return
      }
      setLocationMode(prev.mode)
      setVicinityPoint(prev.point)
      setVicinityLabel(prev.label)
      setVicinityStatus(prev.status)
    }
  }

  // Apply a picked point as the active "Near a location" filter. The label is
  // kept on the point too so reopening the modal (Change) can pre-fill the
  // address field. This is the ONLY action that exits the modal with a location
  // applied — closing otherwise leaves the previous filter untouched.
  const applyNear = (loc) => {
    pendingRevertRef.current = null
    const point = { lat: loc.lat, lng: loc.lng, label: loc.address || 'Near a location' }
    setVicinityPoint(point)
    setVicinityLabel(loc.address || 'Near a location')
    setVicinityStatus('ready')
    // If the applied point matches the saved Home, switch the mode to 'home'
    // so the menu highlight agrees with the chip ("Home") rather than showing
    // "Near a location".
    const matchesHome =
      homeLocation &&
      typeof homeLocation.lat === 'number' &&
      homeLocation.lat === loc.lat &&
      homeLocation.lng === loc.lng
    setLocationMode(matchesHome ? 'home' : 'near')
    setNearModalOpen(false)
    setMenuOpen(false)
    pushToast('success', `Showing events near “${loc.address || 'this location'}”`)
  }

  // Save a picked point as the user's Home.
  // - intent 'home': the user came here to set/update home → save, close the
  //   modal, and switch the filter to Home (using the new home).
  // - intent 'near': the user is exploring from a point and optionally saving
  //   it as home → save, keep the modal open so they can then "Use this
  //   location" (or cancel).
  const setHomeFromLoc = async (loc) => {
    const home = { address: loc.address || 'Home', lat: loc.lat, lng: loc.lng }
    try {
      const res = await updateHomeLocation({ data: { homeLocation: home } })
      if (res?.success) {
        setProfile((p) => ({ ...(p || {}), homeLocation: home }))
        pushToast('success', `Home set to “${home.address}”`)
        if (nearModalIntent === 'home') {
          // Close + switch to Home mode using the new home.
          pendingRevertRef.current = null
          setNearModalOpen(false)
          setMenuOpen(false)
          setLocationMode('home')
          setVicinityPoint({ lat: home.lat, lng: home.lng })
          setVicinityLabel(home.address || 'Home')
          setVicinityStatus('ready')
        }
      } else {
        pushToast(
          'error',
          res?.error === 'Not authenticated'
            ? "Couldn't set home — please sign in."
            : `Couldn't set home: ${res?.error || 'unknown error'}`
        )
        console.error('[Explore] Failed to set home:', res?.error)
      }
    } catch (err) {
      pushToast('error', "Couldn't set home — network error.")
      console.error('[Explore] Failed to save home:', err)
    }
  }

  // Unset the user's Home location.
  const clearHome = async () => {
    try {
      const res = await updateHomeLocation({ data: { homeLocation: null } })
      if (res?.success) {
        setProfile((p) => ({ ...(p || {}), homeLocation: null }))
        pushToast('success', 'Home removed')
        if (locationMode === 'home') {
          setVicinityPoint(null)
          setVicinityLabel(null)
          setVicinityStatus('missing-home')
        }
      } else {
        pushToast(
          'error',
          res?.error === 'Not authenticated'
            ? "Couldn't clear home — please sign in."
            : `Couldn't clear home: ${res?.error || 'unknown error'}`
        )
        console.error('[Explore] Failed to clear home:', res?.error)
      }
    } catch (err) {
      pushToast('error', "Couldn't clear home — network error.")
      console.error('[Explore] Failed to clear home:', err)
    }
  }

  const q = searchQuery.trim().toLowerCase()
  const filteredEvents = events.filter((e) => !q || (e.title || '').toLowerCase().includes(q))
  const filteredUsers = users.filter(
    (u) => !q || (u.name && u.name.toLowerCase().includes(q)) || (u.handle && u.handle.toLowerCase().includes(q))
  )

  // Tab → what to show. "All" shows events + all users.
  const showEvents = activeTab === 'All' || activeTab === 'Events'
  const showUsers = activeTab === 'All' || activeTab === 'Users'

  const hasAny = (showEvents && filteredEvents.length > 0) || (showUsers && filteredUsers.length > 0)

  // Chip label. If the active point equals the saved Home (whether reached via
  // the Home mode or by applying a near point that matches home), show "Home" so
  // there's no confusion that we're exploring from home.
  const chipLabel =
    locationMode === 'everywhere'
      ? 'Everywhere'
      : locationMode === 'current'
        ? 'Current Vicinity'
        : isCurrentHome
          ? 'Home'
          : locationMode === 'home'
            ? vicinityLabel || 'Home'
            : vicinityLabel || 'Near a location…'

  return (
    <div data-component="ExplorePage" className="min-h-screen bg-[#04080b] flex flex-col lg:flex-row">
      <Sidebar profile={profile} activeNav="explore" />

      <main
        data-part="main-content"
        className={`flex-1 flex flex-col min-h-screen lg:min-h-0 ${nearModalOpen ? 'overflow-y-hidden' : 'overflow-y-auto'}`}
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
              onClick={() => (menuOpen ? closeMenu() : setMenuOpen(true))}
              className="flex items-center gap-2 px-4 py-2 bg-[#04080b] border border-[#333333] rounded-full text-white text-[13px] sm:text-[14px] hover:border-[#555555] transition-colors"
            >
              <MapPin className="h-4 w-4 text-[#e10908]" />
              <span className="max-w-[180px] truncate">{chipLabel}</span>
              <span className="text-[#555555]">▾</span>
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={closeMenu} />
                <VicinityMenu
                  mode={locationMode}
                  radius={radius}
                  homeLocation={homeLocation}
                  vicinityStatus={vicinityStatus}
                  vicinityLabel={vicinityLabel}
                  savedHome={isCurrentHome}
                  onModeChange={handleModeChange}
                  onRadiusChange={handleRadiusChange}
                  onSetAsHome={() => {
                    if (vicinityPoint) {
                      setHomeFromLoc({
                        address: vicinityLabel || 'Home',
                        lat: vicinityPoint.lat,
                        lng: vicinityPoint.lng,
                      })
                    }
                  }}
                  onOpenNearModal={(intent = 'near') => openNearModal(vicinityPoint, null, intent)}
                  onEditHome={() => openNearModal(homeLocation, null, 'home')}
                  onClearHome={clearHome}
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

      <NearLocationModal
        isOpen={nearModalOpen}
        onClose={handleCancelNearModal}
        initialValue={nearModalInitial}
        homeLocation={homeLocation}
        intent={nearModalIntent}
        onApply={applyNear}
        onSetHome={setHomeFromLoc}
        onClearHome={clearHome}
      />

      <ToastStack toasts={toasts} onDismiss={dismissToast} />
    </div>
  )
}
