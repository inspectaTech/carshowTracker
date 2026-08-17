import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Calendar, Plus } from 'lucide-react'
import Sidebar from '#/components/dashboard/Sidebar'
import { loadDashboardData } from '#/server/session'
import { listEvents, getSessionUser } from '#/server/events'
import CreateEventModal from './CreateEventModal'
import VirtualizedEventList from '#/components/explore/VirtualizedEventList'

const TABS = ['Upcoming', 'Past', 'Created']

function eventDate(ev) {
  return ev.date ? new Date(ev.date) : null
}

export default function EventsPage() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('Upcoming')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const [dataSource, setDataSource] = useState('mock')
  const [debug, setDebug] = useState('waiting...')

  const loadEvents = useCallback(async () => {
    try {
      // My Events shows ONLY the logged-in user's own events.
      const session = await getSessionUser()
      const myUserId = session?.userId || null
      if (!myUserId) {
        setEvents([])
        setDataSource('no-session')
        return
      }
      const result = await listEvents({ data: { creatorUserId: myUserId } })
      if (result?.events) setEvents(result.events)
    } catch (err) {
      console.error('[Events] Failed to load events:', err)
    }
  }, [])

  useEffect(() => {
    async function loadData() {
      try {
        setDebug('calling loadDashboardData...')
        const result = await loadDashboardData()
        setDebug('got result: ' + (result ? 'OK' : 'null'))
        setProfile(result?.data?.profile || null)
        if (result?.data?.dataSource) setDataSource(result.data.dataSource)
      } catch (err) {
        console.error('[Events] Failed to load data:', err)
        setDebug('ERROR: ' + (err.message || String(err)))
      } finally {
        setLoading(false)
        setDebug(d => d + ' | loading=false')
      }
    }
    loadData()
    loadEvents()
  }, [loadEvents])

  const handleCreated = useCallback((event) => {
    setEvents((prev) => [event, ...prev])
    navigate({ to: `/event/${event.slugId}` })
  }, [navigate])

  const handleUpdated = useCallback((event) => {
    setEvents((prev) => prev.map((e) => (e.slugId === event.slugId ? event : e)))
  }, [])

  const openCreate = useCallback(() => {
    setEditingEvent(null)
    setShowCreateModal(true)
  }, [])

  const openEdit = useCallback((event) => {
    setEditingEvent(event)
    setShowCreateModal(true)
  }, [])

  const closeModal = useCallback(() => {
    setShowCreateModal(false)
    setEditingEvent(null)
  }, [])

  const now = new Date()
  const filtered = events.filter((ev) => {
    const d = eventDate(ev)
    if (activeTab === 'Upcoming') return d && d >= now
    if (activeTab === 'Past') return d && d < now
    return true // Created tab shows all
  })

  return (
    <div data-component="events-page" className="min-h-screen bg-[#04080b] flex flex-col lg:flex-row">
      {/* DEBUG — hidden unless ?debug=true or localStorage.setItem('cst_debug','true') */}
      {typeof window !== 'undefined' && window.__DEBUG_MODE && (
        <div id="debug-bar" suppressHydrationWarning style={{position:'fixed',top:0,left:0,right:0,zIndex:99999,background:'#e10908',color:'white',padding:'4px 8px',fontSize:'11px',fontFamily:'monospace'}}>{debug}</div>
      )}
      <Sidebar profile={profile} activeNav="my-events" />

      <main data-part="main-content" className="flex-1 flex flex-col min-h-screen lg:min-h-0 overflow-y-auto">
        {/* Header */}
        <header data-part="page-header" className="bg-[#0a0d12] px-4 sm:px-8 py-4 sm:py-5 flex items-center justify-between shrink-0">
          <div data-part="title-block" className="flex items-center gap-3">
            <Calendar className="h-6 w-6 sm:h-7 sm:w-7 text-[#e10908]" />
            <h1 className="text-white text-[22px] sm:text-[28px] font-medium">My Events</h1>
            <span className="text-[#888888] text-[14px] sm:text-[16px]">{events.length} events</span>
          </div>
          <button
            data-part="create-event-btn"
            onClick={openCreate}
            className="flex items-center gap-2 px-4 sm:px-5 py-2.5 bg-[#e10908] hover:bg-[#c00807] text-white text-[14px] sm:text-[15px] font-medium rounded-lg transition-colors shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Create Event</span>
          </button>
        </header>

        {/* Tabs */}
        <div data-part="filter-bar" className="bg-[#04080b] px-4 sm:px-8 py-3 flex items-center shrink-0 border-b border-[#1a1d22]">
          <nav data-part="tabs" className="flex items-center gap-3 sm:gap-4">
            {TABS.map((tab) => (
              <button
                key={tab}
                data-part={`tab-${tab.toLowerCase()}`}
                onClick={() => setActiveTab(tab)}
                className={`text-[14px] sm:text-[15px] transition-colors pb-0.5 ${
                  activeTab === tab ? 'text-[#e10908] border-b-2 border-[#e10908]' : 'text-[#888888] hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div data-part="content" className="flex-1 min-h-0 flex flex-col p-4 sm:p-8">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#e10908] border-t-transparent" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <Calendar className="h-12 w-12 text-[#333333] mb-3" />
              {dataSource === 'no-session' ? (
                <>
                  <p className="text-[#888888] text-[16px]">Log in to see your events</p>
                  <button
                    onClick={() => navigate({ to: '/login' })}
                    className="mt-4 text-[#e10908] hover:underline text-[14px]"
                  >
                    Go to login
                  </button>
                </>
              ) : (
                <>
                  <p className="text-[#888888] text-[16px]">No {activeTab.toLowerCase()} events</p>
                  <button
                    onClick={openCreate}
                    className="mt-4 text-[#e10908] hover:underline text-[14px]"
                  >
                    Create your first event
                  </button>
                </>
              )}
            </div>
          ) : (
            <div data-part="event-list" className="flex-1 min-h-0 flex flex-col max-w-4xl w-full">
              <VirtualizedEventList
                events={filtered}
                editable
                onEdit={openEdit}
                onNavigate={(event) => navigate({ to: `/event/${event.slugId}` })}
              />
            </div>
          )}
        </div>
      </main>

      {/* Create/Edit Event Modal — only mounted while open (closed mounting
          rendered <AnimatePresence>{false}</AnimatePresence>, triggering a
          duplicate-key warning from framer-motion) */}
      {showCreateModal && (
        <CreateEventModal
          isOpen={showCreateModal}
          onClose={closeModal}
          onCreated={handleCreated}
          onUpdated={handleUpdated}
          editingEvent={editingEvent}
        />
      )}
    </div>
  )
}
