import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import {
  LayoutDashboard, Search, Car, Users, Calendar, Newspaper,
  ShoppingCart, Shirt, Settings, LogOut, User, Shield,
} from 'lucide-react'
import UserImage from '../ui/UserImage'

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'explore', label: 'Explore', icon: Search },
  { id: 'garage', label: 'Garage', icon: Car },
  { id: 'community', label: 'Community', icon: Users },
  { id: 'my-events', label: 'My Events', icon: Calendar },
  { id: 'news', label: 'News', icon: Newspaper },
  { id: 'pit-shop', label: 'Pit Shop', icon: ShoppingCart },
  { id: 'merch', label: 'Merch', icon: Shirt },
  { id: 'admin', label: 'Admin', icon: Shield },
]

const bottomItems = [
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'logout', label: 'Logout', icon: LogOut },
]

export function NavItem({ icon: Icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-3 w-full h-11 px-6 text-left transition-colors
        ${active
          ? 'bg-[#0e1116] border-l-[3px] border-[#e10908] text-white'
          : 'bg-transparent border-l-[3px] border-transparent text-[#AAAAAA] hover:text-white hover:bg-[#0e1116]/50'
        }
      `}
    >
      <Icon size={20} strokeWidth={1.5} />
      <span className="text-[16px] font-normal">{label}</span>
    </button>
  )
}

export function MiniProfile({ profile }) {
  return (
    <div className="flex items-center gap-3 px-6 py-3 bg-[#0e1116] w-full">
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

export default function Sidebar({ profile, activeNav = 'dashboard', onNavClick, dataSourceInfo }) {
  const handleNavClick = (id) => {
    if (onNavClick) onNavClick(id)
  }

  return (
    <aside className="w-[250px] min-h-screen bg-[#04080b] border-r border-[#333333] flex flex-col shrink-0">
      {/* Logo */}
      <div className="px-4 pt-3 pb-0">
        <div className="w-full h-[101px] bg-[#1a1a2e] rounded-lg flex items-center justify-center">
          <span className="text-white/60 text-sm">Car Show</span>
        </div>
      </div>

      <div className="h-[5px]" />

      {/* Main Nav */}
      <nav className="flex flex-col gap-0">
        {navItems.map((item) => (
          <NavItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            active={item.id === activeNav}
            onClick={() => handleNavClick(item.id)}
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
            onClick={() => handleNavClick(item.id)}
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
    </aside>
  )
}
