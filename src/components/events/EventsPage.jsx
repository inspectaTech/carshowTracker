import { useState, useEffect } from 'react'
import { Calendar, Plus, ChevronRight, MapPin, Clock, Users } from 'lucide-react'
import Sidebar from '#/components/dashboard/Sidebar'
import { getDashboardData } from '#/server/db-actions'
import CreateEventModal from './CreateEventModal'

const MOCK_EVENTS = [
  {
    id: 'ev1',
    title: 'SoCal JDM Meet 2026',
    month: 'JUL',
    day: '15',
    location: 'Los Angeles, CA',
    time: '7:00 PM',
    attending: 234,
    rsvp: 'Going',
    rsvpColor: '#4ade80',
    category: 'JDM',
    date: new Date('2026-07-15'),
  },
  {
    id: 'ev2',
    title: 'JDM Legends Show',
    month: 'AUG',
    day: '3',
    location: 'San Diego, CA',
    time: '10:00 AM',
    attending: 89,
    rsvp: 'Maybe',
    rsvpColor: '#facc15',
    category: 'Classic',
    date: new Date('2026-08-03'),
  },
  {
    id: 'ev3',
    title: 'Euro Night Cruise',
    month: 'AUG',
    day: '22',
    location: 'Santa Monica, CA',
    time: '8:00 PM',
    attending: 56,
    rsvp: 'Declined',
    rsvpColor: '#ef4444',
    category: 'Euro',
    date: new Date('2026-08-22'),
  },
  {
    id: 'ev4',
    title: 'Cars & Coffee Monthly',
    month: 'SEP',
    day: '12',
    location: 'Orange County, CA',
    time: '6:00 AM',
    attending: 312,
    rsvp: 'Going',
    rsvpColor: '#4ade80',
    category: 'Meetup',
    date: new Date('2026-09-12'),
  },
  {
    id: 'ev5',
    title: 'Supercar Sunday',
    month: 'OCT',
    day: '5',
    location: 'Beverly Hills, CA',
    time: '9:00 AM',
    attending: 178,
    rsvp: 'Going',
    rsvpColor: '#4ade80',
    category: 'Import',
    date: new Date('2026-10-05'),
  },
  {
    id: 'ev6',
    title: 'Classic Muscle Showdown',
    month: 'NOV',
    day: '14',
    location: 'Long Beach, CA',
    time: '11:00 AM',
    attending: 45,
    rsvp: null,
    rsvpColor: null,
    category: 'Classic',
    date: new Date('2026-11-14'),
  },
]

const TABS = ['Upcoming', 'Past', 'Created']

function formatRelativeTime(date) {
  const now = new Date()
  const diff = date - now
  if (diff < 0) return 'Past'
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  if (days === 0) return 'Today'
  if (days === 1) return 'Tomorrow'
  return `In ${days} days`
}

export default function EventsPage() {
  const [profile, setProfile] = useState(null)
  const [events, setEvents] = useState(MOCK_EVENTS)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('Upcoming')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [dataSource, setDataSource] = useState('mock')

  useEffect(() => {
    async function loadData() {
      try {
        const result = await getDashboardData({ data: { userId: 'user_001' } })
        setProfile(result.profile)
        if (result.dataSource) setDataSource(result.dataSource)
      } catch (err) {
        console.error('[Events] Failed to load data:', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const now = new Date()
  const filtered = events.filter((ev) => {
    if (activeTab === 'Upcoming') return ev.date >= now
    if (activeTab === 'Past') return ev.date < now
    return true // Created tab shows all
  })

  return (
    <div data-component="events-page" className="min-h-screen bg-[#04080b] flex flex-col lg:flex-row">
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
            onClick={() => setShowCreateModal(true)}
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
        <div data-part="content" className="flex-1 p-4 sm:p-8 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#e10908] border-t-transparent" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <Calendar className="h-12 w-12 text-[#333333] mb-3" />
              <p className="text-[#888888] text-[16px]">No {activeTab.toLowerCase()} events</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="mt-4 text-[#e10908] hover:underline text-[14px]"
              >
                Create your first event
              </button>
            </div>
          ) : (
            <div data-part="event-list" className="max-w-4xl space-y-3">
              {filtered.map((ev) => (
                <div
                  key={ev.id}
                  data-component="EventCard"
                  className="bg-[#0a0d12] rounded-xl px-4 sm:px-6 py-4 sm:py-5 flex items-center gap-4 sm:gap-5 hover:bg-[#0e1116] transition-colors border border-transparent hover:border-[#1a1d22] cursor-pointer group"
                >
                  {/* Date badge */}
                  <div data-part="date-badge" className="w-[70px] h-[80px] bg-[#04080b] rounded-lg flex flex-col items-center justify-center gap-0.5 shrink-0">
                    <span className="text-[#e10908] text-[12px] font-bold uppercase leading-none">{ev.month}</span>
                    <span className="text-white text-[28px] font-bold leading-none mt-1">{ev.day}</span>
                  </div>

                  {/* Event info */}
                  <div data-part="event-info" className="flex-1 min-w-0 space-y-1">
                    <h3 className="text-white text-[16px] sm:text-[18px] font-medium truncate">{ev.title}</h3>
                    <p className="text-[#888888] text-[13px] sm:text-[14px] flex items-center gap-1.5 flex-wrap">
                      <MapPin size={14} className="shrink-0" />
                      {ev.location}
                      <span className="mx-1 text-[#444]">•</span>
                      <Clock size={14} className="shrink-0" />
                      {ev.time}
                      <span className="mx-1 text-[#444]">•</span>
                      <Users size={14} className="shrink-0" />
                      {ev.attending} attending
                    </p>
                    <div data-part="status-row" className="flex items-center gap-2">
                      {ev.rsvp && (
                        <span
                          data-part="rsvp-badge"
                          className="inline-flex items-center px-2 py-0.5 rounded text-[12px] font-medium bg-[#1a1d22]"
                          style={{ color: ev.rsvpColor }}
                        >
                          {ev.rsvp}
                        </span>
                      )}
                      <span className="text-[#e10908] text-[12px]">{ev.category}</span>
                    </div>
                  </div>

                  {/* Arrow */}
                  <ChevronRight className="h-5 w-5 text-[#555555] group-hover:text-white transition-colors shrink-0" />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Create Event Modal */}
      <CreateEventModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} />
    </div>
  )
}
