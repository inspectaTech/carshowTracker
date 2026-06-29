import { useState, useEffect } from 'react'
import Sidebar from '#/components/dashboard/Sidebar'
import { getDashboardData } from '#/server/db-actions'
import { Link } from '@tanstack/react-router'
import { Plus, Search, Car } from 'lucide-react'

const MOCK_VEHICLES = [
  { id: '1', name: 'Nissan GT-R R34', year: 2000, hp: 600, drivetrain: 'AWD', tags: ['JDM', 'Track Ready'] },
  { id: '2', name: 'Toyota Supra MK4', year: 1998, hp: 320, drivetrain: 'RWD', tags: ['JDM', 'Legend'] },
  { id: '3', name: 'Honda Civic Type R', year: 2021, hp: 306, drivetrain: 'FWD', tags: ['FWD', 'Hot Hatch'] },
  { id: '4', name: 'Mazda RX-7 FD', year: 1995, hp: 276, drivetrain: 'RWD', tags: ['Rotary', 'JDM Classic'] },
  { id: '5', name: 'Ford Mustang GT', year: 2023, hp: 450, drivetrain: 'RWD', tags: ['American', 'V8'] },
  { id: '6', name: 'Porsche 911 GT3', year: 2024, hp: 502, drivetrain: 'RWD', tags: ['German', 'Track Weapon'] },
]

function CarCard({ car }) {
  return (
    <div
      data-component="CarCard"
      className="bg-[#0a0d12] rounded-xl overflow-hidden hover:border-[#e10908]/30 hover:border transition-all duration-200"
    >
      {/* Photo placeholder */}
      <div data-part="car-photo" className="h-[140px] bg-[#1a1d22] flex items-center justify-center">
        <Car className="h-10 w-10 text-[#333333]" />
      </div>
      {/* Info */}
      <div data-part="car-info" className="p-3 sm:p-4 space-y-2">
        <h3 data-part="car-name" className="text-white text-[16px] sm:text-[18px] font-medium truncate">
          {car.name}
        </h3>
        <p data-part="car-specs" className="text-[#888888] text-[12px] sm:text-[13px]">
          {car.year} &bull; {car.hp} HP &bull; {car.drivetrain}
        </p>
        <div data-part="car-tags" className="flex gap-1.5 flex-wrap">
          {car.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 bg-[#1a1d22] text-[#e10908] text-[11px] rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function GaragePage() {
  const [profile, setProfile] = useState(null)
  const [vehicles, setVehicles] = useState(MOCK_VEHICLES)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    async function loadData() {
      try {
        const result = await getDashboardData({ data: { userId: 'user_001' } })
        setProfile(result.profile)
        if (result.vehicles && result.vehicles.length > 0) {
          setVehicles(result.vehicles)
        }
      } catch (err) {
        console.error('[Garage] Failed to load data:', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const filteredVehicles = vehicles.filter((v) =>
    v.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div data-component="garage-page" className="min-h-screen bg-[#04080b] flex flex-col lg:flex-row">
      <Sidebar profile={profile} activeNav="garage" />

      <main
        data-part="main-content"
        className="flex-1 flex flex-col min-h-screen lg:min-h-0 overflow-y-auto"
      >
        {/* Header bar */}
        <header
          data-part="page-header"
          className="bg-[#0a0d12] px-4 sm:px-8 py-4 sm:py-5 flex items-center justify-between shrink-0"
        >
          <div data-part="title-block" className="flex items-center gap-3">
            <Car className="h-6 w-6 sm:h-7 sm:w-7 text-[#e10908]" />
            <div>
              <h1 className="text-white text-[22px] sm:text-[28px] font-medium leading-tight">
                My Garage
              </h1>
              <p className="text-[#888888] text-[13px] sm:text-[14px]">
                {vehicles.length} vehicles
              </p>
            </div>
          </div>
          <button
            data-part="add-car-btn"
            className="flex items-center gap-2 px-4 sm:px-5 py-2.5 bg-[#e10908] hover:bg-[#c00807] text-white text-[14px] sm:text-[15px] font-medium rounded-lg transition-colors shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Car</span>
          </button>
        </header>

        {/* Search/filter bar */}
        <div
          data-part="filter-bar"
          className="bg-[#04080b] px-4 sm:px-8 py-3 flex items-center gap-3 sm:gap-4 flex-wrap shrink-0 border-b border-[#1a1d22]"
        >
          <div data-part="search-field" className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#555555]" />
            <input
              type="text"
              data-part="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search vehicles..."
              className="w-full pl-9 pr-3 py-2 bg-[#0a0d12] text-white text-[14px] placeholder-[#555555] rounded-lg border border-[#1a1d22] focus:outline-none focus:border-[#e10908] transition-colors"
            />
          </div>
          <span className="text-[#666666] text-[13px] sm:text-[14px] cursor-pointer hover:text-white transition-colors">
            Make ▾
          </span>
          <span className="text-[#666666] text-[13px] sm:text-[14px] cursor-pointer hover:text-white transition-colors">
            Year ▾
          </span>
          <span className="text-[#666666] text-[13px] sm:text-[14px] cursor-pointer hover:text-white transition-colors">
            Sort: Newest ▾
          </span>
        </div>

        {/* Car grid */}
        <div
          data-part="car-grid"
          className="flex-1 p-4 sm:p-8 overflow-y-auto"
        >
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#e10908] border-t-transparent" />
            </div>
          ) : filteredVehicles.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <Car className="h-12 w-12 text-[#333333] mb-3" />
              <p className="text-[#888888] text-[16px]">
                {searchQuery ? 'No vehicles match your search' : 'Your garage is empty'}
              </p>
              {!searchQuery && (
                <p className="text-[#666666] text-[14px] mt-1">
                  Add your first car to get started
                </p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {filteredVehicles.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
