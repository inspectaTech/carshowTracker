import { Star, Car, Camera, Flag } from 'lucide-react'

export function InfoItem({ icon: Icon, label, value }) {
  return (
    <div data-component="InfoItem" className="flex items-center gap-2.5 w-full">
      <div className="text-white shrink-0">
        <Icon size={20} strokeWidth={1.5} />
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-white text-[14px] truncate">{label}</span>
        <span className="text-[#e10908] text-[12px] truncate">{value}</span>
      </div>
    </div>
  )
}

export default function AboutMe({ profile }) {
  if (!profile) return null

  const infoItems = [
    { icon: Star, label: 'Favorite Brand', value: profile.favoriteBrand || '—' },
    { icon: Car, label: 'Dream Car', value: profile.dreamCar || '—' },
    { icon: Camera, label: 'Occupation', value: profile.occupation || '—' },
    { icon: Flag, label: 'Drive', value: profile.driveStyle || '—' },
  ]

  return (
    <div data-component="AboutMe" className="bg-[#0a0d12] rounded-xl p-4 w-full lg:w-[243px] h-full flex flex-col gap-2.5">
      {/* Title */}
      <h3 className="text-white text-[20px] font-normal">About Me</h3>
      <div className="w-11 h-0.5 bg-[#e10908] mb-1" />

      {/* Bio */}
      <p className="text-[#AAAAAA] text-[14px] leading-relaxed">
        {profile.aboutMe || 'No bio yet — edit your profile to tell the community about yourself.'}
      </p>

      {/* Info items */}
      <div className="flex flex-col gap-3 mt-auto">
        {infoItems.map((item, i) => (
          <InfoItem key={i} icon={item.icon} label={item.label} value={item.value} />
        ))}
      </div>
    </div>
  )
}
