import { Heart, MessageCircle, MoreHorizontal } from 'lucide-react'
import UserImage from '../ui/UserImage'

export function ActivityItem({ activity }) {
  if (!activity) return null

  return (
    <div data-component="ActivityItem" className="flex items-center gap-3 px-5 flex-1 w-full max-w-full overflow-hidden">
      {/* Photo */}
      <UserImage
        src={activity.imageUrl}
        userId="user_001"
        alt="Activity photo"
        width={80}
        height={80}
        className="shrink-0"
      />

      {/* Text block */}
      <div className="flex flex-col justify-center gap-1.5 min-w-0 flex-1">
        <span className="text-white text-[16px] truncate">{activity.action}</span>
        <span className="text-[#AAAAAA] text-[16px] truncate">{activity.description}</span>
        <span className="text-[#666666] text-[16px]">{activity.timestamp}</span>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 shrink-0">
        <div className="flex items-center gap-1.5 text-[#888888]">
          <Heart size={20} strokeWidth={1.5} />
          <span className="text-[14px]">{activity.likes}</span>
        </div>
        <div className="flex items-center gap-1.5 text-[#888888]">
          <MessageCircle size={20} strokeWidth={1.5} />
          <span className="text-[14px]">{activity.comments}</span>
        </div>
        <MoreHorizontal size={20} className="text-[#888888] cursor-pointer" />
      </div>
    </div>
  )
}

export default function MyHighway({ activities, onUpload }) {
  return (
    <div data-component="MyHighway" className="bg-[#0a0d12] rounded-xl w-full h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3">
        <h3 className="text-white text-[20px] font-normal">My Highway</h3>
        <div className="flex items-center gap-3">
          <button data-part="upload-btn" onClick={onUpload} className="text-[#888888] text-[14px] hover:text-white transition-colors cursor-pointer">
            + Upload
          </button>
          <span className="text-[#e10908] text-[20px] cursor-pointer hover:underline">View All</span>
        </div>
      </div>

      <div className="w-full h-px bg-[#333333]" />

      {/* Activity content */}
      <div className="flex-1 flex items-center py-3">
        {activities?.length > 0 ? (
          <ActivityItem activity={activities[0]} />
        ) : (
          <p className="text-[#888888] text-[14px] px-5">No recent activity</p>
        )}
      </div>
    </div>
  )
}
