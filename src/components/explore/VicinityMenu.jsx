import { useState, useEffect, useRef, useCallback } from 'react'
import { Globe, Navigation, Home as HomeIcon, MapPin, Loader2 } from 'lucide-react'

const MODES = [
  { id: 'everywhere', label: 'Everywhere', icon: Globe },
  { id: 'current', label: 'Current Vicinity', icon: Navigation },
  { id: 'home', label: 'Home', icon: HomeIcon },
  { id: 'near', label: 'Near a location…', icon: MapPin },
]
const RADII = [10, 25, 50, 100]
const NOMINATIM_URL = 'https://nominatim.openstreetmap.org'

/**
 * Dropdown for the Explore "Current Vicinity" chip — pick a location mode +
 * radius. "Near a location…" embeds a Nominatim address search.
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
  onNearPicked,
  onSetAsHome,
}) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [searching, setSearching] = useState(false)
  const debounce = useRef(null)

  // Reset the search input whenever the menu is (re)opened.
  useEffect(() => {
    if (mode !== 'near') {
      setQuery('')
      setSuggestions([])
    }
  }, [mode])

  const search = useCallback(async (q) => {
    if (!q || q.trim().length < 3) {
      setSuggestions([])
      return
    }
    setSearching(true)
    try {
      const res = await fetch(
        `${NOMINATIM_URL}/search?q=${encodeURIComponent(q.trim())}&format=json&limit=5`,
        { headers: { 'User-Agent': 'CarshowTracker/1.0' } }
      )
      const data = await res.json()
      setSuggestions(Array.isArray(data) ? data : [])
    } catch {
      setSuggestions([])
    } finally {
      setSearching(false)
    }
  }, [])

  const onQueryChange = (val) => {
    setQuery(val)
    if (debounce.current) clearTimeout(debounce.current)
    debounce.current = setTimeout(() => search(val), 400)
  }

  const pickSuggestion = (s) => {
    const lat = parseFloat(s.lat)
    const lng = parseFloat(s.lon)
    onNearPicked({ lat, lng, label: s.display_name })
    setSuggestions([])
    setQuery('')
  }

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
          {mode === 'home' && vicinityStatus === 'missing-home' && (
            <p className="text-[#e10908] text-[13px] mt-3">
              No home set yet. Pick “Near a location…” to set one.
            </p>
          )}
          {mode === 'home' && vicinityStatus === 'ready' && (
            <p className="text-[#888888] text-[13px] mt-3 truncate">📍 {vicinityLabel || 'Home'}</p>
          )}
          {mode === 'current' && vicinityStatus === 'ready' && (
            <p className="text-[#888888] text-[13px] mt-3 truncate">📍 {vicinityLabel || 'Current location'}</p>
          )}
          {vicinityStatus === 'error' && (
            <p className="text-[#e10908] text-[13px] mt-3">
              Couldn't get location — showing all events.
            </p>
          )}

          {/* Near a location search */}
          {mode === 'near' && (
            <div className="relative mt-3">
              <input
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                placeholder="Search an address…"
                className="w-full px-3 py-2 bg-[#04080b] border border-[#333333] rounded-lg text-white text-[14px] placeholder-[#555555] focus:outline-none focus:border-[#e10908]"
              />
              {searching && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-[#555555]">
                  searching…
                </span>
              )}
              {suggestions.length > 0 && (
                <ul className="absolute left-0 right-0 top-full mt-1 bg-[#0a0d12] border border-[#333333] rounded-lg shadow-lg max-h-52 overflow-auto z-10">
                  {suggestions.map((s, i) => (
                    <li
                      key={i}
                      onMouseDown={() => pickSuggestion(s)}
                      className="px-3 py-2 text-[13px] text-[#cccccc] hover:bg-[#1a1d22] hover:text-white cursor-pointer"
                    >
                      {s.display_name}
                    </li>
                  ))}
                </ul>
              )}

              {/* Picked location → save as Home */}
              {vicinityStatus === 'ready' && vicinityLabel && (
                <div className="mt-3 pt-3 border-t border-[#1a1d22] flex items-center gap-2">
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
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
