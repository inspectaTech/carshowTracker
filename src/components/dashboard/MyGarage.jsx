import { Link } from '@tanstack/react-router'
import { Heart, MessageCircle, MoreHorizontal } from 'lucide-react'

export function CarEntry({ name, specs }) {
  return (
    <div data-component="CarEntry" className="w-full">
      <div className="border-l-2 border-[#e10908] pl-3 py-1">
        <span className="text-white text-[16px] font-normal block">{name}</span>
        <span className="text-[#888888] text-[12px] block">{specs}</span>
      </div>
    </div>
  )
}

export default function MyGarage({ vehicles }) {
  return (
    <div data-component="MyGarage" className="bg-[#0a0d12] rounded-xl w-full h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3">
        <h3 className="text-white text-[20px] font-normal">My Garage</h3>
        <Link to="/garage" className="text-[#e10908] text-[20px] cursor-pointer hover:underline">View All</Link>
      </div>

      <div className="w-full h-px bg-[#333333]" />

      {/* Car entries */}
      <div className="flex flex-wrap lg:flex-nowrap items-center gap-2 px-5 py-4 lg:flex-1">
        {vehicles?.length > 0 ? (
          vehicles.map((car, i) => (
            <CarEntry key={i} name={car.name} specs={car.specs} />
          ))
        ) : (
          <p className="text-[#888888] text-[14px]">No cars in garage yet</p>
        )}
      </div>
    </div>
  )
}
