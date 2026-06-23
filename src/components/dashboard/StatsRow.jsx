import { Gauge, Trophy, Car, Users, MessageCircle } from 'lucide-react'
import UserImage from '../ui/UserImage'

export function StatItem({ icon: Icon, value, label }) {
  return (
    <div className="flex items-center gap-3 h-full px-2">
      <div className="flex items-center justify-center w-[36px] h-[36px] shrink-0">
        {Icon && <Icon className="text-[#e10908]" size={28} strokeWidth={1.5} />}
      </div>
      <div className="flex flex-col justify-center min-w-0">
        <span className="text-[28px] font-bold text-white leading-none">{value}</span>
        <span className="text-[#AAAAAA] text-[16px] leading-tight">{label}</span>
      </div>
    </div>
  )
}

export default function StatsRow({ stats }) {
  const icons = [Gauge, Trophy, Car, Users, MessageCircle]

  return (
    <div className="bg-[#0a0d12] rounded-xl px-5 py-3 flex items-center justify-around w-full h-full">
      {stats && icons.map((Icon, i) => {
        const keys = ['totalPoints', 'badges', 'carsInGarage', 'followers', 'following']
        const stat = stats[keys[i]]
        return (
          <div key={keys[i]} className="flex items-center gap-3 h-full">
            <StatItem icon={Icon} value={stat?.value || '0'} label={stat?.label || ''} />
            {i < icons.length - 1 && <div className="w-[1px] h-[50px] bg-[#333333] mx-2" />}
          </div>
        )
      })}
    </div>
  )
}
