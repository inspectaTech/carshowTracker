import { useState, useEffect } from 'react'
import Sidebar from '#/components/dashboard/Sidebar'
import { loadDashboardData } from '#/server/session'
import { Heart, MessageCircle, MoreHorizontal, Upload, Route, LayoutList, Grid3X3 } from 'lucide-react'
import UserImage from '#/components/ui/UserImage'

const MOCK_ACTIVITIES = [
  { id: 'a1', action: 'Posted a new photo', description: 'Nissan GT-R R34 at Angeles Crest Hwy', imageUrl: null, timestamp: '2h ago', likes: 128, comments: 16 },
  { id: 'a2', action: 'Added a new car', description: 'Porsche 911 GT3 added to garage', imageUrl: null, timestamp: '1d ago', likes: 42, comments: 8 },
  { id: 'a3', action: 'Attended a car show', description: 'SoCal JDM Meet 2026', imageUrl: null, timestamp: '3d ago', likes: 89, comments: 12 },
  { id: 'a4', action: 'Won Best in Show', description: 'Angeles Crest Cars & Coffee', imageUrl: null, timestamp: '5d ago', likes: 312, comments: 45 },
  { id: 'a5', action: 'New mod installed', description: 'Carbon fiber hood on GT-R', imageUrl: null, timestamp: '1w ago', likes: 67, comments: 11 },
  { id: 'a6', action: 'Track day personal best', description: 'Buttonwillow Raceway - 1:52.3', imageUrl: null, timestamp: '1w ago', likes: 203, comments: 28 },
]

const TABS = ['All Activity', 'Photos', 'Events']

export default function HighwayPage() {
  const [profile, setProfile] = useState(null)
  const [activities, setActivities] = useState(MOCK_ACTIVITIES)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('All Activity')
  const [viewMode, setViewMode] = useState('list') // 'list' | 'grid'

  useEffect(() => {
    async function loadData() {
      try {
        const result = await loadDashboardData()
        setProfile(result?.data?.profile || null)
        if (result?.data?.activities && result.data.activities.length > 0) {
          setActivities(result.data.activities.map((a) => ({
            ...a,
            id: a._id || a.id,
            timestamp: formatRelativeTime(new Date(a.timestamp)),
          })))
        }
      } catch (err) {
        console.error('[Highway] Failed to load data:', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const filtered = activities.filter((a) => {
    if (activeTab === 'Photos') return a.action?.toLowerCase().includes('photo')
    if (activeTab === 'Events') return a.action?.toLowerCase().includes('show') || a.action?.toLowerCase().includes('event') || a.action?.toLowerCase().includes('attended')
    return true
  })

  return (
    <div data-component="highway-page" className="min-h-screen bg-[#04080b] flex flex-col lg:flex-row">
      <Sidebar profile={profile} activeNav="my-highway" />

      <main data-part="main-content" className="flex-1 flex flex-col min-h-screen lg:min-h-0 overflow-y-auto">
        {/* Header */}
        <header data-part="page-header" className="bg-[#0a0d12] px-4 sm:px-8 py-4 sm:py-5 flex items-center justify-between shrink-0">
          <div data-part="title-block" className="flex items-center gap-3">
            <Route className="h-6 w-6 sm:h-7 sm:w-7 text-[#e10908]" />
            <h1 className="text-white text-[22px] sm:text-[28px] font-medium">My Highway</h1>
            <span className="text-[#888888] text-[14px] sm:text-[16px]">{activities.length} activities</span>
          </div>
          <button data-part="upload-btn" className="flex items-center gap-2 px-4 sm:px-5 py-2.5 bg-[#e10908] hover:bg-[#c00807] text-white text-[14px] sm:text-[15px] font-medium rounded-lg transition-colors shrink-0">
            <Upload className="h-4 w-4" />
            <span className="hidden sm:inline">Upload</span>
          </button>
        </header>

        {/* Tabs + View toggle */}
        <div data-part="filter-bar" className="bg-[#04080b] px-4 sm:px-8 py-3 flex items-center justify-between shrink-0 border-b border-[#1a1d22]">
          <nav data-part="tabs" className="flex items-center gap-3 sm:gap-4">
            {TABS.map((tab) => (
              <button key={tab} data-part={`tab-${tab.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setActiveTab(tab)}
                className={`text-[14px] sm:text-[15px] transition-colors pb-0.5 ${
                  activeTab === tab ? 'text-[#e10908] border-b-2 border-[#e10908]' : 'text-[#888888] hover:text-white'
                }`}>
                {tab}
              </button>
            ))}
          </nav>
          <div data-part="view-toggle" className="flex items-center gap-1">
            <button data-part="list-view-btn" onClick={() => setViewMode('list')}
              className={`w-9 h-9 rounded-md flex items-center justify-center transition-colors ${viewMode === 'list' ? 'bg-[#0e1116] text-[#e10908]' : 'text-[#666666] hover:text-white'}`}>
              <LayoutList size={18} />
            </button>
            <button data-part="grid-view-btn" onClick={() => setViewMode('grid')}
              className={`w-9 h-9 rounded-md flex items-center justify-center transition-colors ${viewMode === 'grid' ? 'bg-[#0e1116] text-[#e10908]' : 'text-[#666666] hover:text-white'}`}>
              <Grid3X3 size={18} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div data-part="content" className="flex-1 p-4 sm:p-8 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#e10908] border-t-transparent" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <Route className="h-12 w-12 text-[#333333] mb-3" />
              <p className="text-[#888888] text-[16px]">No activity{activeTab !== 'All Activity' ? ` in ${activeTab}` : ''}</p>
            </div>
          ) : viewMode === 'list' ? (
            /* LIST VIEW */
            <div data-part="list-view" className="max-w-4xl space-y-0">
              {filtered.map((item) => (
                <div key={item.id} data-component="ActivityItem"
                  className="flex items-center gap-4 sm:gap-5 py-4 sm:py-5 border-b border-[#1a1d22] last:border-b-0 hover:bg-[#0a0d12]/50 -mx-4 sm:-mx-8 px-4 sm:px-8 transition-colors">
                  <div className="w-[60px] h-[60px] sm:w-[70px] sm:h-[70px] bg-[#1a1d22] rounded-lg shrink-0 flex items-center justify-center">
                    <Route className="h-6 w-6 text-[#333333]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-[15px] sm:text-[16px] truncate">{item.action}</p>
                    <p className="text-[#AAAAAA] text-[13px] sm:text-[15px] truncate">{item.description}</p>
                    <p className="text-[#666666] text-[13px] sm:text-[14px] mt-0.5">{item.timestamp}</p>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                    <span className="text-[#888888] text-[13px] flex items-center gap-1">
                      <Heart size={16} /> {item.likes}
                    </span>
                    <span className="text-[#888888] text-[13px] flex items-center gap-1">
                      <MessageCircle size={16} /> {item.comments}
                    </span>
                    <MoreHorizontal size={18} className="text-[#888888] cursor-pointer hover:text-white" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* GRID VIEW */
            <div data-part="grid-view" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {filtered.map((item) => (
                <div key={item.id} data-component="ActivityCard"
                  className="bg-[#0a0d12] rounded-xl overflow-hidden hover:border-[#e10908]/30 hover:border transition-all duration-200">
                  <div className="h-[160px] sm:h-[180px] bg-[#1a1d22] flex items-center justify-center">
                    <Route className="h-10 w-10 text-[#333333]" />
                  </div>
                  <div className="p-3 sm:p-4 space-y-1.5">
                    <p className="text-white text-[14px] font-medium truncate">{item.action}</p>
                    <p className="text-[#AAAAAA] text-[12px] truncate">{item.description}</p>
                    <p className="text-[#666666] text-[11px]">{item.timestamp}</p>
                    <div className="flex items-center gap-3 pt-1">
                      <span className="text-[#888888] text-[12px] flex items-center gap-1">
                        <Heart size={14} /> {item.likes}
                      </span>
                      <span className="text-[#888888] text-[12px] flex items-center gap-1">
                        <MessageCircle size={14} /> {item.comments}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

function formatRelativeTime(date) {
  const now = new Date()
  const diff = (now - date) / 1000
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`
  return `${Math.floor(diff / 2592000)}w ago`
}
