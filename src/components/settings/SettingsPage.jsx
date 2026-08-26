import { useState, useEffect } from 'react'
import Sidebar from '#/components/dashboard/Sidebar'
import { loadDashboardData, updateHomeLocation } from '#/server/session'
import { Settings as SettingsIcon, User, Bell, Lock, MapPin, Palette, Link as LinkIcon, Sliders } from 'lucide-react'
import { getToolbarLayout, setToolbarLayout as saveToolbarLayout } from '#/lib/toolbar-layout'
import HomeLocationControl from '#/components/explore/HomeLocationControl'
import NearLocationModal from '#/components/explore/NearLocationModal'
import ToastStack from '#/components/ui/ToastStack'

const SETTINGS_NAV = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'privacy', label: 'Privacy', icon: Lock },
  { id: 'home-location', label: 'Home Location', icon: MapPin },
  { id: 'theme', label: 'Theme', icon: Palette },
  { id: 'form', label: 'Form', icon: Sliders },
  { id: 'connected', label: 'Connected Accounts', icon: LinkIcon },
]

const SKIP_CLOSE_KEY = 'cst_skip_close_confirm'

function getSkipCloseConfirm() {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(SKIP_CLOSE_KEY) === 'true'
}

export default function SettingsPage() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState('profile')
  const [darkMode, setDarkMode] = useState(true)
  const [toolbarLayout, setToolbarLayout] = useState(getToolbarLayout)
  const [skipCloseConfirm, setSkipCloseConfirm] = useState(getSkipCloseConfirm)
  const [notifications, setNotifications] = useState({
    events: true,
    followers: false,
    updates: true,
  })
  const [homeModalOpen, setHomeModalOpen] = useState(false)
  const [homeModalInitial, setHomeModalInitial] = useState(null)
  const [toasts, setToasts] = useState([])

  const homeLocation = profile?.homeLocation || null

  const pushToast = (type, message) => {
    const id = Date.now() + Math.random()
    setToasts((t) => [...t.slice(-2), { id, type, message }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500)
  }
  const dismissToast = (id) => setToasts((t) => t.filter((x) => x.id !== id))

  const openHomeModal = (initial = null) => {
    setHomeModalInitial(initial)
    setHomeModalOpen(true)
  }

  const setHomeFromLoc = async (loc) => {
    const home = { address: loc.address || 'Home', lat: loc.lat, lng: loc.lng }
    try {
      const res = await updateHomeLocation({ data: { homeLocation: home } })
      if (res?.success) {
        setProfile((p) => ({ ...(p || {}), homeLocation: home }))
        pushToast('success', `Home set to “${home.address}”`)
        setHomeModalOpen(false)
      } else {
        pushToast('error', res?.error === 'Not authenticated' ? "Couldn't set home — please sign in." : `Couldn't set home: ${res?.error || 'unknown error'}`)
      }
    } catch (err) {
      pushToast('error', "Couldn't set home — network error.")
    }
  }

  const clearHome = async () => {
    try {
      const res = await updateHomeLocation({ data: { homeLocation: null } })
      if (res?.success) {
        setProfile((p) => ({ ...(p || {}), homeLocation: null }))
        pushToast('success', 'Home removed')
      } else {
        pushToast('error', res?.error === 'Not authenticated' ? "Couldn't clear home — please sign in." : `Couldn't clear home: ${res?.error || 'unknown error'}`)
      }
    } catch (err) {
      pushToast('error', "Couldn't clear home — network error.")
    }
  }

  useEffect(() => {
    async function loadData() {
      try {
        const result = await loadDashboardData()
        setProfile(result?.data?.profile || null)
      } catch (err) {
        console.error('[Settings] Failed to load data:', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const Toggle = ({ enabled, onChange }) => (
    <button
      type="button"
      data-part="toggle"
      onClick={() => onChange(!enabled)}
      className={`relative w-[44px] h-[24px] rounded-full transition-colors ${
        enabled ? 'bg-[#e10908]' : 'bg-[#333333]'
      }`}
    >
      <span
        className={`absolute top-[3px] w-[18px] h-[18px] rounded-full bg-white transition-transform ${
          enabled ? 'left-[23px]' : 'left-[3px]'
        }`}
      />
    </button>
  )

  return (
    <div data-component="settings-page" className="min-h-screen bg-[#04080b] flex flex-col lg:flex-row">
      <Sidebar profile={profile} activeNav="settings" />

      <main
        data-part="main-content"
        className="flex-1 flex flex-col min-h-screen lg:min-h-0 overflow-y-auto"
      >
        {/* Header */}
        <header
          data-part="page-header"
          className="bg-[#0a0d12] px-4 sm:px-8 py-4 sm:py-5 flex items-center gap-3 shrink-0"
        >
          <SettingsIcon className="h-6 w-6 sm:h-7 sm:w-7 text-[#e10908]" />
          <h1 className="text-white text-[22px] sm:text-[28px] font-medium">
            Settings
          </h1>
        </header>

        {/* Content */}
        <div data-part="content" className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Left sidebar nav */}
          <nav
            data-part="settings-nav"
            className="w-full lg:w-[240px] bg-[#0a0d12] border-b lg:border-b-0 lg:border-r border-[#1a1d22] shrink-0 overflow-y-auto"
          >
            {SETTINGS_NAV.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  data-part={`nav-${item.id}`}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 px-5 py-3 text-left transition-colors ${
                    activeSection === item.id
                      ? 'bg-[#0e1116] text-white border-l-[3px] border-[#e10908]'
                      : 'text-[#888888] hover:text-white hover:bg-[#0e1116]/50 border-l-[3px] border-transparent'
                  }`}
                >
                  <Icon size={18} strokeWidth={1.5} />
                  <span className="text-[15px]">{item.label}</span>
                </button>
              )
            })}
          </nav>

          {/* Right panel */}
          <div
            data-part="settings-panel"
            className="flex-1 p-4 sm:p-8 overflow-y-auto"
          >
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#e10908] border-t-transparent" />
              </div>
            ) : (
              <div className="max-w-2xl space-y-6">
                {activeSection === 'profile' && (
                  <>
                    <h2 className="text-white text-[22px] font-medium mb-6">Profile Settings</h2>

                    {/* Dark Mode */}
                    <div className="bg-[#0a0d12] rounded-xl p-4 sm:p-5 flex items-center gap-3">
                      <Palette className="h-5 w-5 text-[#888888] shrink-0" />
                      <span className="text-white text-[15px] flex-1">Dark Mode</span>
                      <Toggle enabled={darkMode} onChange={setDarkMode} />
                    </div>

                    {/* Home Location */}
                    <div className="bg-[#0a0d12] rounded-xl p-4 sm:p-5">
                      <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-[#888888] shrink-0" />
                        <span className="text-white text-[15px] flex-1">Home Location</span>
                        <span className="text-white text-[14px] bg-[#04080b] rounded-lg px-3 py-2">
                          {profile?.location || 'Los Angeles, CA'}
                        </span>
                        <button
                          data-part="change-location-btn"
                          className="text-[#888888] text-[13px] bg-[#04080b] border border-[#333333] rounded-lg px-3 py-2 hover:text-white transition-colors"
                        >
                          Change
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {activeSection === 'notifications' && (
                  <>
                    <h2 className="text-white text-[22px] font-medium mb-6">Notification Preferences</h2>

                    <div className="bg-[#0a0d12] rounded-xl p-4 sm:p-5 flex items-center gap-3">
                      <Bell className="h-5 w-5 text-[#888888] shrink-0" />
                      <span className="text-white text-[15px] flex-1">Event reminders</span>
                      <Toggle
                        enabled={notifications.events}
                        onChange={(v) => setNotifications({ ...notifications, events: v })}
                      />
                    </div>

                    <div className="bg-[#0a0d12] rounded-xl p-4 sm:p-5 flex items-center gap-3">
                      <Bell className="h-5 w-5 text-[#888888] shrink-0" />
                      <span className="text-white text-[15px] flex-1">New followers</span>
                      <Toggle
                        enabled={notifications.followers}
                        onChange={(v) => setNotifications({ ...notifications, followers: v })}
                      />
                    </div>

                    <div className="bg-[#0a0d12] rounded-xl p-4 sm:p-5 flex items-center gap-3">
                      <Bell className="h-5 w-5 text-[#888888] shrink-0" />
                      <span className="text-white text-[15px] flex-1">Car show updates</span>
                      <Toggle
                        enabled={notifications.updates}
                        onChange={(v) => setNotifications({ ...notifications, updates: v })}
                      />
                    </div>
                  </>
                )}

                {activeSection === 'privacy' && (
                  <>
                    <h2 className="text-white text-[22px] font-medium mb-6">Privacy</h2>
                    <div className="bg-[#0a0d12] rounded-xl p-6 text-center">
                      <Lock className="h-10 w-10 text-[#333333] mx-auto mb-3" />
                      <p className="text-[#888888] text-[15px]">Privacy settings coming soon</p>
                    </div>
                  </>
                )}

                {activeSection === 'home-location' && (
                  <>
                    <h2 className="text-white text-[22px] font-medium mb-6">Home Location</h2>
                    <div className="bg-[#0a0d12] rounded-xl p-6">
                      <p className="text-[#888888] text-[15px] mb-4">Your current home location is used to find events near you.</p>
                      <HomeLocationControl
                        homeLocation={homeLocation}
                        onSetHome={() => openHomeModal(null)}
                        onEditHome={() => openHomeModal(homeLocation)}
                        onClearHome={clearHome}
                      />
                    </div>
                  </>
                )}

                {activeSection === 'theme' && (
                  <>
                    <h2 className="text-white text-[22px] font-medium mb-6">Theme</h2>
                    <div className="bg-[#0a0d12] rounded-xl p-4 sm:p-5 flex items-center gap-3">
                      <Palette className="h-5 w-5 text-[#888888] shrink-0" />
                      <span className="text-white text-[15px] flex-1">Dark Mode</span>
                      <Toggle enabled={darkMode} onChange={setDarkMode} />
                    </div>
                  </>
                )}

                {activeSection === 'form' && (
                  <>
                    <h2 className="text-white text-[22px] font-medium mb-6">Form</h2>
                    <div className="bg-[#0a0d12] rounded-xl p-4 sm:p-5">
                      <label className="text-white text-[15px] block mb-3">Toolbar Layout</label>
                      <p className="text-[#888888] text-[13px] mb-4">Choose how the editor toolbar displays its buttons.</p>
                      <div className="flex items-center gap-3">
                        <button
                          data-part="layout-scroll"
                          onClick={() => { setToolbarLayout('scroll'); saveToolbarLayout('scroll') }}
                          className={`flex-1 h-11 rounded-lg text-[14px] font-normal transition-colors ${
                            toolbarLayout === 'scroll'
                              ? 'bg-[#e10908] text-white'
                              : 'bg-[#1a1d22] text-white hover:bg-[#2a2d32]'
                          }`}
                        >
                          Single Row
                        </button>
                        <button
                          data-part="layout-wrap"
                          onClick={() => { setToolbarLayout('wrap'); saveToolbarLayout('wrap') }}
                          className={`flex-1 h-11 rounded-lg text-[14px] font-normal transition-colors ${
                            toolbarLayout === 'wrap'
                              ? 'bg-[#e10908] text-white'
                              : 'bg-[#1a1d22] text-white hover:bg-[#2a2d32]'
                          }`}
                        >
                          Grid
                        </button>
                      </div>
                    </div>

                    {/* Confirm Close toggle */}
                    <div className="bg-[#0a0d12] rounded-xl p-4 sm:p-5 mt-4">
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-white text-[15px]">Confirm Before Closing</label>
                        <button
                          data-part="toggle-confirm-close"
                          onClick={() => {
                            const next = !skipCloseConfirm
                            setSkipCloseConfirm(next)
                            localStorage.setItem(SKIP_CLOSE_KEY, next)
                          }}
                          className={`relative w-11 h-6 rounded-full transition-colors ${
                            !skipCloseConfirm ? 'bg-[#e10908]' : 'bg-[#333333]'
                          }`}
                        >
                          <span
                            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                              !skipCloseConfirm ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                      <p className="text-[#888888] text-[13px]">
                        Show a warning when closing the Create Event form with unsaved changes.
                      </p>
                    </div>
                  </>
                )}

                {activeSection === 'connected' && (
                  <>
                    <h2 className="text-white text-[22px] font-medium mb-6">Connected Accounts</h2>
                    <div className="bg-[#0a0d12] rounded-xl p-6 text-center">
                      <LinkIcon className="h-10 w-10 text-[#333333] mx-auto mb-3" />
                      <p className="text-[#888888] text-[15px]">Account connections coming soon</p>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <NearLocationModal
        isOpen={homeModalOpen}
        onClose={() => setHomeModalOpen(false)}
        initialValue={homeModalInitial}
        homeLocation={homeLocation}
        intent="home"
        onApply={setHomeFromLoc}
        onSetHome={setHomeFromLoc}
        onClearHome={clearHome}
      />

      <ToastStack toasts={toasts} onDismiss={dismissToast} />
    </div>
  )
}
