import { useState, useEffect } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import {
  LayoutDashboard, Search, Car, Route, Users, Calendar, Newspaper,
  ShoppingCart, Shirt, Settings, LogOut, User, Shield, ChevronRight, X,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import UserImage from '../ui/UserImage'

// Route map: nav item ID -> URL path
const routeMap = {
  dashboard: '/dashboard',
  explore: '/explore',
  garage: '/garage',
  'my-highway': '/my-highway',
  community: '/community',
  'my-events': '/my-events',
  news: '/news',
  'pit-shop': '/pit-shop',
  merch: '/merch',
  settings: '/settings',
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'explore', label: 'Explore', icon: Search },
  { id: 'garage', label: 'Garage', icon: Car },
  { id: 'my-highway', label: 'My Highway', icon: Route },
  { id: 'community', label: 'Community', icon: Users },
  { id: 'my-events', label: 'My Events', icon: Calendar },
  { id: 'news', label: 'News', icon: Newspaper },
  { id: 'pit-shop', label: 'Pit Shop', icon: ShoppingCart },
  { id: 'merch', label: 'Merch', icon: Shirt },
]

const bottomItems = [
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'logout', label: 'Logout', icon: LogOut },
]

export function NavItem({ icon: Icon, label, active, onClick, to }) {
  const baseClass = `flex items-center gap-3 w-full h-11 px-6 text-left transition-colors ${
    active
      ? 'bg-[#0e1116] border-l-[3px] border-[#e10908] text-white'
      : 'bg-transparent border-l-[3px] border-transparent text-[#AAAAAA] hover:text-white hover:bg-[#0e1116]/50'
  }`

  if (to) {
    return (
      <Link
        to={to}
        data-component="NavItem"
        className={baseClass}
      >
        <Icon size={20} strokeWidth={1.5} />
        <span className="text-[16px] font-normal">{label}</span>
      </Link>
    )
  }

  return (
    <button
      data-component="NavItem"
      onClick={onClick}
      className={baseClass}
    >
      <Icon size={20} strokeWidth={1.5} />
      <span className="text-[16px] font-normal">{label}</span>
    </button>
  )
}

export function MiniProfile({ profile }) {
  return (
    <div data-component="MiniProfile" className="flex items-center gap-3 px-6 py-3 bg-[#0e1116] w-full">
      <UserImage
        src={profile?.avatarUrl}
        userId={profile?.userId || 'user_001'}
        alt={profile?.username || 'Avatar'}
        width={66}
        height={66}
        rounded
        className="shrink-0"
      />
      <div className="flex flex-col gap-1 min-w-0">
        <span className="text-white text-[20px] font-normal truncate">
          {profile?.username || 'User'}
        </span>
        <span className="text-[#e10908] text-[14px] font-normal cursor-pointer hover:underline">
          View Profile
        </span>
      </div>
    </div>
  )
}

function SidebarLogo() {
  return (
    <div data-component="SidebarLogo" className="px-4 py-3">
      <div className="w-full h-[101px] bg-[#1a1a2e] rounded-lg flex items-center justify-center">
        <span className="text-white/60 text-sm">Car Show</span>
      </div>
    </div>
  )
}

function SidebarContent({ profile, activeNav, onNavClick, dataSourceInfo }) {
  return (
    <>
      {/* Logo */}
      <SidebarLogo />

      <div className="h-[5px]" />

      {/* Main Nav */}
      <nav className="flex flex-col gap-0">
        {navItems.map((item) => (
          <NavItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            active={item.id === activeNav}
            to={routeMap[item.id]}
            onClick={() => onNavClick && onNavClick(item.id)}
          />
        ))}
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Mini Profile */}
      <MiniProfile profile={profile} />

      {/* Bottom Nav */}
      <nav className="flex flex-col gap-0 mt-0">
        {bottomItems.map((item) => (
          <NavItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            active={false}
            to={routeMap[item.id]}
            onClick={() => onNavClick && onNavClick(item.id)}
          />
        ))}
        {/* Data source badge */}
        <div className="px-6 pt-4 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[#555555]">Data:</span>
            <span className={`text-[11px] font-medium px-1.5 py-0.5 rounded ${
              dataSourceInfo?.dbAvailable
                ? 'bg-green-900/30 text-green-400'
                : 'bg-yellow-900/30 text-yellow-400'
            }`}>
              {dataSourceInfo?.dbAvailable ? 'MongoDB' : 'JSON'}
            </span>
          </div>
        </div>
      </nav>
    </>
  )
}

export default function Sidebar({ profile, activeNav = 'dashboard', onNavClick, dataSourceInfo }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [fetchedDataSource, setFetchedDataSource] = useState(null)
  const navigate = useNavigate()

  // When the parent doesn't pass dataSourceInfo, fetch the live DB status so the
  // "Data:" badge reflects MongoDB vs JSON fallback correctly on every page.
  useEffect(() => {
    if (dataSourceInfo) return
    let cancelled = false
    import('#/server/db-actions')
      .then(({ getDataSourceStatus }) => getDataSourceStatus())
      .then((status) => { if (!cancelled) setFetchedDataSource(status) })
      .catch(() => { /* leave as undefined → JSON fallback shown */ })
    return () => { cancelled = true }
  }, [dataSourceInfo])

  const dataSourceInfoResolved = dataSourceInfo || fetchedDataSource

  const handleNavClick = async (id) => {
    if (onNavClick) onNavClick(id)

    // Logout: sign out via Better Auth, then redirect to home
    if (id === 'logout') {
      try {
        const { authClient } = await import('#/lib/auth-client')
        await authClient.signOut()
      } catch (err) {
        console.error('[Sidebar] Logout failed:', err)
      } finally {
        navigate({ to: '/' })
        setMobileOpen(false)
      }
      return
    }

    // Navigate to route if it exists in the map
    const route = routeMap[id]
    if (route) {
      navigate({ to: route })
    }
    setMobileOpen(false)
  }

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  return (
    <>
      {/* Desktop sidebar — always visible */}
      <aside data-component="Sidebar" className="hidden lg:flex w-[250px] min-h-screen bg-[#04080b] border-r border-[#333333] flex-col shrink-0">
        <SidebarContent
          profile={profile}
          activeNav={activeNav}
          onNavClick={handleNavClick}
          dataSourceInfo={dataSourceInfoResolved}
        />
      </aside>

      {/* Mobile sidebar trigger — floating button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-[1200] bg-[#04080b] border border-[#333333] rounded-lg p-2 text-white hover:text-[#e10908] transition-colors shadow-lg"
        onClick={() => setMobileOpen(true)}
        aria-label="Open sidebar"
      >
        <ChevronRight size={24} />
      </button>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[1000] lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              data-component="Sidebar"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 h-full w-[280px] bg-[#04080b] border-r border-[#333333] flex flex-col z-[1100] lg:hidden shadow-2xl [overscroll-behavior:contain]"
            >
              {/* Close button */}
              <div className="flex items-center justify-end px-4 pt-4 pb-0">
                <button
                  className="text-[#AAAAAA] hover:text-white transition-colors"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close sidebar"
                >
                  <X size={24} />
                </button>
              </div>
              <SidebarContent
                profile={profile}
                activeNav={activeNav}
                onNavClick={handleNavClick}
                dataSourceInfo={dataSourceInfoResolved}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
