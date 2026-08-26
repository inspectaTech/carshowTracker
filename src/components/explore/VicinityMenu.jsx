import { Globe, Navigation, Home as HomeIcon, MapPin, Loader2, Pencil, X, Search } from 'lucide-react'
import HomeLocationControl from './HomeLocationControl'

const MODES = [
  { id: 'everywhere', label: 'Everywhere', icon: Globe },
  { id: 'current', label: 'Current Vicinity', icon: Navigation },
  { id: 'home', label: 'Home', icon: HomeIcon },
  { id: 'near', label: 'Near a location…', icon: MapPin },
]
const RADII = [10, 25, 50, 100]

/**
 * Dropdown for the Explore "Current Vicinity" chip — pick a location mode +
 * radius. "Near a location…" opens a full modal (LocationPicker map + search)
 * via onOpenNearModal; Home has edit (pencil) and unset (X) controls.
 */
export default function VicinityMenu({
  mode,
  radius,
  homeLocation,
  vicinityStatus,
  vicinityLabel,
  savedHome,
  onModeChange,
  onRadiusChange,
  onSetAsHome,
  onOpenNearModal, // (intent) => void — 'home' or 'near'
  onEditHome,
  onClearHome,
}) {
  const isProximity = mode === 'current' || mode === 'home' || mode === 'near'

  return (
    <div
      data-component="vicinity-menu"
      className="absolute right-0 top-full mt-2 w-80 bg-[#0a0d12] border border-[#333333] rounded-xl shadow-2xl z-50 overflow-hidden"
    >
      <div className="px-4 py-3 border-b border-[#1a1d22]">
        <p className="text-white text-[14px] font-medium">Location filter</p>
      </div>

      {/* Modes */}
      <div className="p-2">
        {MODES.map((m) => {
          const Icon = m.icon
          const active = mode === m.id
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => onModeChange(m.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                active
                  ? 'bg-[#e10908]/15 text-white border border-[#e10908]/40'
                  : 'text-[#AAAAAA] hover:bg-[#1a1d22] hover:text-white border border-transparent'
              }`}
            >
              <Icon size={18} className={active ? 'text-[#e10908]' : 'text-[#555555]'} />
              <span className="text-[14px]">{m.label}</span>
            </button>
          )
        })}
      </div>

      {/* Proximity extras */}
      {isProximity && (
        <div className="px-4 pb-3 border-t border-[#1a1d22]">
          {/* Radius */}
          <p className="text-[#888888] text-[12px] mt-3 mb-1.5">Radius</p>
          <div className="flex items-center gap-2">
            {RADII.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => onRadiusChange(r)}
                className={`h-8 px-3 rounded-md text-[13px] transition-colors ${
                  radius === r ? 'bg-[#e10908] text-white' : 'bg-[#1a1d22] text-white hover:bg-[#2a2d32]'
                }`}
              >
                {r} mi
              </button>
            ))}
          </div>

          {/* Status / labels */}
          {mode === 'current' && vicinityStatus === 'detecting' && (
            <p className="flex items-center gap-2 text-[#888888] text-[13px] mt-3">
              <Loader2 size={14} className="animate-spin" /> Detecting location…
            </p>
          )}
          {mode === 'home' && (
            <div className="mt-3">
              {vicinityStatus === 'missing-home' && (
                <p className="text-[#e10908] text-[13px] mb-2">No home set yet.</p>
              )}
              <HomeLocationControl
                homeLocation={homeLocation}
                onSetHome={() => onOpenNearModal('home')}
                onEditHome={onEditHome}
                onClearHome={onClearHome}
              />
            </div>
          )}
          {mode === 'current' && vicinityStatus === 'ready' && (
            <p className="text-[#888888] text-[13px] mt-3 truncate">📍 {vicinityLabel || 'Current location'}</p>
          )}
          {vicinityStatus === 'error' && (
            <p className="text-[#e10908] text-[13px] mt-3">
              Couldn't get location — showing all events.
            </p>
          )}

          {/* Near a location — opens the full modal (LocationPicker map + search) */}
          {mode === 'near' && (
            <div className="mt-3">
              {vicinityStatus === 'ready' && vicinityLabel ? (
                <div className="flex items-center gap-2">
                  <p className="flex-1 text-[#888888] text-[13px] truncate" title={vicinityLabel}>
                    📍 {vicinityLabel}
                  </p>
                  <button
                    type="button"
                    onClick={onSetAsHome}
                    disabled={savedHome}
                    className={`flex items-center gap-1.5 h-8 px-3 rounded-md text-[12px] transition-colors shrink-0 ${
                      savedHome
                        ? 'bg-[#1a2a1d] text-[#7ad48a] cursor-default'
                        : 'bg-[#1a1d22] text-white hover:bg-[#2a2d32]'
                    }`}
                  >
                    <HomeIcon size={14} />
                    {savedHome ? 'Saved as Home' : 'Set as Home'}
                  </button>
                  <button
                    type="button"
                    onClick={() => onOpenNearModal('near')}
                    title="Change location"
                    className="w-8 h-8 flex items-center justify-center text-[#888888] hover:text-white hover:bg-[#1a1d22] rounded-md transition-colors shrink-0"
                  >
                    <Pencil size={14} />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => onOpenNearModal('near')}
                  className="w-full flex items-center justify-center gap-2 h-10 rounded-lg text-[13px] text-[#AAAAAA] bg-[#1a1d22] hover:bg-[#2a2d32] hover:text-white transition-colors"
                >
                  <Search size={14} />
                  Search an address or place a pin on the map
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
