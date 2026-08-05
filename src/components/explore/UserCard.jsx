import { Users } from 'lucide-react'

/**
 * Shared icon-driven card for non-event items (currently users).
 * Compact avatar + name + meta — the display used for anything that
 * isn't an event (events use the big calendar EventCard instead).
 *
 * Props:
 *   - user: { name, handle, cars, followers, avatarUrl }
 *   - onNavigate: optional click handler
 */
export default function UserCard({ user, onNavigate }) {
  const meta = [user.cars ? `${user.cars} cars` : null, user.followers ? `${user.followers} followers` : null]
    .filter(Boolean)
    .join(' • ')

  return (
    <div
      key={user.id || user.handle || user.name}
      data-component="UserCard"
      onClick={onNavigate}
      className="bg-[#0a0d12] rounded-xl p-4 flex items-center gap-3 hover:bg-[#0e1116] transition-colors cursor-pointer"
    >
      <div className="w-[44px] h-[44px] bg-[#1a1d22] rounded-full shrink-0 flex items-center justify-center overflow-hidden">
        {user.avatarUrl ? (
          <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
        ) : (
          <Users className="h-5 w-5 text-[#333333]" />
        )}
      </div>
      <div className="min-w-0">
        <p className="text-white text-[15px] font-medium truncate">{user.name}</p>
        {user.handle && <p className="text-[#888888] text-[12px] truncate">{user.handle}</p>}
        {meta && <p className="text-[#888888] text-[12px]">{meta}</p>}
      </div>
    </div>
  )
}
