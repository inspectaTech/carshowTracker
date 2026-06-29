import { MapPin, Calendar as CalendarIcon, Instagram, Youtube, Music2 } from 'lucide-react'
import UserImage from '../ui/UserImage'
import StatsRow from './StatsRow'
import Header from '../Header'

export function ProfileCard({ profile }) {
  if (!profile) return null

  const socialIcons = {
    Instagram: Instagram,
    YouTube: Youtube,
    TikTok: Music2,
  }

  return (
    <div className="bg-[#04080bbf] rounded-xl w-full lg:w-[570px] h-full flex flex-col lg:flex-row items-center gap-5 px-6 py-5"  data-component="ProfileCard">
      {/* Car Image - circular with red right border */}
      <div className="relative shrink-0">
        <UserImage
          src={profile.avatarUrl}
          userId={profile.userId}
          alt="Profile car"
          width={163}
          height={163}
          rounded
          className="border-r-4 border-[#e10908]"
        />
      </div>

      {/* Text Block */}
      <div className="flex flex-col gap-2 justify-center min-w-0 flex-1 h-full text-left lg:text-left">
        {/* Name + verified */}
        <div className="flex items-center gap-2 justify-center lg:justify-start">
          <span className="text-white text-xl lg:text-[28px] font-bold truncate">{profile.username}</span>
          <svg className="text-[#e10908] shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
          </svg>
        </div>

        {/* Handle */}
        <span className="text-[#777777] text-lg lg:text-[20px]">{profile.handle}</span>

        {/* Bio */}
        <p className="text-[#AAAAAA] text-sm lg:text-[16px] leading-snug line-clamp-2 lg:line-clamp-none">{profile.bio}</p>

        {/* Location + Join date */}
        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mt-1">
          <div className="flex items-center gap-1.5 text-[#888888] text-xs lg:text-[14px]">
            <MapPin size={16} strokeWidth={1.5} />
            <span>{profile.location}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#888888] text-xs lg:text-[14px]">
            <CalendarIcon size={16} strokeWidth={1.5} />
            <span>Joined {profile.joinedAt}</span>
          </div>
        </div>

        {/* Social links */}
        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-[#888888] text-xs lg:text-[14px] mt-1">
          {profile.socialLinks?.map((name) => {
            const Icon = socialIcons[name] || Instagram
            return (
              <span key={name} className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors">
                <Icon size={16} strokeWidth={1.5} />
                {name}
              </span>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export function AdImage() {
  return (
    <div data-component="AdImage" className="rounded-xl w-full h-full overflow-hidden relative">
      <div className="w-full h-full bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] flex items-center justify-center">
        <div className="text-center px-6">
          <p className="text-white/60 text-sm uppercase tracking-widest">Sponsored</p>
          <p className="text-white/30 text-xs mt-2">Ad Space</p>
        </div>
      </div>
    </div>
  )
}

export function EditProfileButton({ onClick }) {
  return (
    <div data-component="EditProfileButton" onClick={onClick} className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-[#0a0d12] border border-[#333333] rounded-md px-3 py-2 cursor-pointer hover:bg-[#0e1116] transition-colors">
      <svg className="text-white" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
        <path d="m15 5 4 4" />
      </svg>
      <span className="text-white text-[16px]">Edit Profile</span>
    </div>
  )
}

export function TopActions() {
  return (
    <div data-component="TopActions" className="absolute top-5 right-5 flex items-center gap-2 z-10">
      <Header variant="icon" />
      <button className="text-white hover:text-[#e10908] transition-colors">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>
      </button>
      <button className="text-white hover:text-[#e10908] transition-colors">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      </button>
    </div>
  )
}

export default function TopSection({ profile, onEditProfile }) {
  return (
    <div data-component="TopSection" className="flex flex-col gap-2.5 w-full">
      {/* Top Row - Profile + Ad + overlays */}
      <div className="relative flex flex-col lg:flex-row gap-2.5 lg:h-[326px]">
        <ProfileCard profile={profile} />

        <div className="w-full lg:flex-1 relative min-h-[240px] lg:h-full">
          <AdImage />

          <EditProfileButton onClick={onEditProfile} />
        </div>
      </div>

      {/* Stats Row */}
      <div className="h-[70px]">
        <StatsRow stats={profile?.stats} />
      </div>
    </div>
  )
}
