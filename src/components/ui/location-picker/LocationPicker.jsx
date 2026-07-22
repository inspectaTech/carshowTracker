import { useState, useRef, useEffect, useCallback } from 'react'

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org'
const DEFAULT_CENTER = [34.0522, -118.2437] // Los Angeles
const DEFAULT_ZOOM = 10

/**
 * Build a clean, short address from Nominatim's structured address object.
 * Skips noisy OSM metadata (neighbourhood, county) to produce something like:
 * "4165 Swift Avenue, San Diego, CA 92104"
 */
function formatCleanAddress(addr) {
  const parts = []

  // Street: "4165 Swift Avenue"
  const street = [addr.house_number, addr.road].filter(Boolean).join(' ')
  if (street) parts.push(street)

  // City/town/village
  const city = addr.city || addr.town || addr.village
  if (city) parts.push(city)

  // State + zip
  const stateZip = [addr.state, addr.postcode].filter(Boolean).join(' ')
  if (stateZip) parts.push(stateZip)

  // Country (only if no state — for international results)
  if (!addr.state && addr.country) parts.push(addr.country)

  return parts.join(', ')
}

/** Convert decimal degrees to Degrees-Minutes-Seconds format */
function dms(coord, type) {
  const abs = Math.abs(coord)
  const deg = Math.floor(abs)
  const min = Math.floor((abs - deg) * 60)
  const sec = ((abs - deg - min / 60) * 3600).toFixed(2)
  const dir = type === 'lat' ? (coord >= 0 ? 'N' : 'S') : (coord >= 0 ? 'E' : 'W')
  return `${deg}°${min}'${sec}"${dir}`
}

export default function LocationPicker({ onLocationSelect, onClear, onZipCode }) {
  // --- State ---
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [isSearching, setIsSearching] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [copied, setCopied] = useState(false)

  // --- Refs ---
  const mapRef = useRef(null)
  const mapWrapperRef = useRef(null)
  const mapInstance = useRef(null)
  const markerInstance = useRef(null)
  const debounceTimer = useRef(null)
  const inputRef = useRef(null)

  // --- Helper: remove existing marker ---
  const clearMarker = useCallback(() => {
    if (markerInstance.current) {
      markerInstance.current.remove()
      markerInstance.current = null
    }
  }, [])

  // --- Helper: place marker on map ---
  const placeMarker = useCallback((lat, lng) => {
    if (!mapInstance.current) return
    clearMarker()
    import('leaflet').then((L) => {
      markerInstance.current = L.marker([lat, lng]).addTo(mapInstance.current)
      mapInstance.current.setView([lat, lng], mapInstance.current.getZoom())
    })
  }, [clearMarker])

  // --- Notify parent of location change ---
  const notifyLocation = useCallback((loc, addrObj) => {
    setSelectedLocation(loc)
    if (onLocationSelect) onLocationSelect(loc)
    if (addrObj?.postcode && onZipCode) onZipCode(addrObj.postcode)
  }, [onLocationSelect, onZipCode])

  // --- Initialize Leaflet map ---
  useEffect(() => {
    if (mapInstance.current || !mapRef.current) return

    async function initMap() {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)

      const L = await import('leaflet')

      // Fix icon paths
      delete L.Icon.Default.prototype._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })

      const map = L.map(mapRef.current, {
        center: DEFAULT_CENTER,
        zoom: DEFAULT_ZOOM,
        zoomControl: true,
        attributionControl: false,
      })

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://openstreetmap.org/copyright">OSM</a>',
      }).addTo(map)

      // Click on map -> reverse geocode + place marker
      map.on('click', async (e) => {
        const { lat, lng } = e.latlng
        placeMarker(lat, lng)

        try {
          const res = await fetch(
            `${NOMINATIM_URL}/reverse?lat=${lat}&lon=${lng}&format=json`,
            { headers: { 'User-Agent': 'CarshowTracker/1.0' } }
          )
          const data = await res.json()
          const address = data.address ? formatCleanAddress(data.address) : data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`
          notifyLocation({ address, lat, lng }, data.address)
          setQuery(address)
          setShowSuggestions(false)
        } catch {
          notifyLocation({ address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`, lat, lng })
          setQuery(`${lat.toFixed(6)}, ${lng.toFixed(6)}`)
          setShowSuggestions(false)
        }
      })

      mapInstance.current = map
    }

    initMap()

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove()
        mapInstance.current = null
      }
    }
  }, [placeMarker, notifyLocation])

  // --- Invalidate map size when fullscreen toggles ---
  useEffect(() => {
    if (mapInstance.current) {
      setTimeout(() => mapInstance.current.invalidateSize(), 200)
    }
  }, [isFullscreen])

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((v) => !v)
  }, [])

  // --- Debounced Nominatim search ---
  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current)

    if (!query || query.trim().length < 3) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    debounceTimer.current = setTimeout(async () => {
      setIsSearching(true)
      try {
        const res = await fetch(
          `${NOMINATIM_URL}/search?q=${encodeURIComponent(query.trim())}&format=json&limit=5`,
          { headers: { 'User-Agent': 'CarshowTracker/1.0' } }
        )
        const data = await res.json()
        setSuggestions(data)
        setShowSuggestions(data.length > 0)
      } catch {
        setSuggestions([])
        setShowSuggestions(false)
      } finally {
        setIsSearching(false)
      }
    }, 400)

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current)
    }
  }, [query])

  // --- Select suggestion ---
  const handleSelectSuggestion = useCallback(async (s) => {
    const lat = parseFloat(s.lat)
    const lng = parseFloat(s.lon)
    setShowSuggestions(false)
    placeMarker(lat, lng)

    try {
      const res = await fetch(
        `${NOMINATIM_URL}/reverse?lat=${lat}&lon=${lng}&format=json`,
        { headers: { 'User-Agent': 'CarshowTracker/1.0' } }
      )
      const data = await res.json()
      const address = data.address ? formatCleanAddress(data.address) : data.display_name || s.display_name
      notifyLocation({ address, lat, lng }, data.address)
      setQuery(address)
    } catch {
      notifyLocation({ address: s.display_name, lat, lng })
      setQuery(s.display_name)
    }
  }, [placeMarker, notifyLocation])

  // --- Clear selection ---
  const handleClear = useCallback(() => {
    setQuery('')
    setSelectedLocation(null)
    setSuggestions([])
    setShowSuggestions(false)
    clearMarker()
    if (mapInstance.current) {
      mapInstance.current.setView(DEFAULT_CENTER, DEFAULT_ZOOM)
    }
    if (onClear) onClear()
  }, [clearMarker, onClear])

  return (
    <div>
      {/* === Input Row === */}
      <div className="relative mb-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder="Search for an address or click the map..."
              className="w-full px-3.5 py-2.5 bg-[#0a0d12] border border-[#333333] rounded-lg text-white text-[14px] placeholder-[#555555] focus:outline-none focus:border-[#e10908] transition-colors"
            />
            {isSearching && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#555555]">
                searching...
              </span>
            )}
          </div>
          <button
            onClick={handleClear}
            className="px-3.5 py-2.5 text-sm text-[#888888] border border-[#333333] rounded-lg hover:text-white hover:bg-[#1a1d22] transition-colors"
          >
            Clear
          </button>
        </div>

        {/* Autocomplete dropdown */}
        {showSuggestions && (
          <ul className="absolute z-[2000] left-0 right-0 top-full mt-1 bg-[#0a0d12] border border-[#333333] rounded-lg shadow-lg max-h-60 overflow-auto">
            {suggestions.map((s, i) => (
              <li
                key={i}
                onMouseDown={() => handleSelectSuggestion(s)}
                className="px-3.5 py-2.5 text-sm text-[#cccccc] hover:bg-[#1a1d22] hover:text-white cursor-pointer border-b border-[#333333] last:border-b-0 transition-colors"
              >
                {s.display_name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* === Map === */}
      <div ref={mapWrapperRef} className={`relative rounded-lg border border-[#333333] mb-3 group ${isFullscreen ? 'fixed inset-0 z-[9999] rounded-none border-0' : 'w-full h-[260px]'}`}>
        <div
          ref={mapRef}
          className="w-full h-full"
          style={{ background: '#04080b', height: isFullscreen ? '100vh' : '260px' }}
        />

        {/* Fullscreen toggle button */}
        <button
          onClick={toggleFullscreen}
          title={isFullscreen ? 'Exit fullscreen' : 'Expand map to full screen'}
          className={`absolute top-2 right-2 z-[2000] w-8 h-8 bg-[#0a0d12]/80 hover:bg-[#0a0d12] border border-[#333333] rounded-md shadow flex items-center justify-center text-[#888888] hover:text-white transition-colors ${isFullscreen ? '' : 'opacity-0 group-hover:opacity-100'}`}
        >
          {isFullscreen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 3v3a2 2 0 0 1-2 2H3" />
              <path d="M21 8h-3a2 2 0 0 1-2-2V3" />
              <path d="M16 21v-3a2 2 0 0 1 2-2h3" />
              <path d="M3 16h3a2 2 0 0 1 2 2v3" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 3H5a2 2 0 0 0-2 2v3" />
              <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
              <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
              <path d="M3 16v3a2 2 0 0 0 2 2h3" />
            </svg>
          )}
        </button>

        {/* Exit hint on mobile */}
        {isFullscreen && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[2000] bg-black/60 text-white text-xs px-3 py-1.5 rounded-full">
            Tap the expand button or use the back gesture to exit
          </div>
        )}
      </div>

      {/* === Output Panel === */}
      {selectedLocation ? (
        <div className="border border-[#333333] rounded-lg p-3 bg-[#0a0d12]">
          <h3 className="text-xs font-semibold text-[#888888] uppercase tracking-wider mb-2">
            Selected Location
          </h3>
          <div className="space-y-1.5 text-sm">
            <div>
              <span className="text-[#888888] text-xs">Address:</span>
              <p className="text-white mt-0.5 text-[13px] leading-relaxed">{selectedLocation.address}</p>
            </div>
            <div className="flex gap-4">
              <div>
                <span className="text-[#888888] text-xs">Latitude:</span>
                <p className="text-white mt-0.5 font-mono text-[12px]">{selectedLocation.lat.toFixed(6)}</p>
              </div>
              <div>
                <span className="text-[#888888] text-xs">Longitude:</span>
                <p className="text-white mt-0.5 font-mono text-[12px]">{selectedLocation.lng.toFixed(6)}</p>
              </div>
            </div>
            <div>
              <span className="text-[#888888] text-xs">DMS:</span>
              <p className="text-white mt-0.5 font-mono text-[11px]">
                {dms(selectedLocation.lat, 'lat')}, {dms(selectedLocation.lng, 'lng')}
              </p>
            </div>

            {/* Open in maps apps + Copy + Share */}
            <div className="pt-2 border-t border-[#333333] mt-2">
              <span className="text-[#888888] text-[11px]">Open in:</span>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                <a
                  href={`https://www.google.com/maps?q=${encodeURIComponent(selectedLocation.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-md bg-[#1a1d22] border border-[#333333] text-[#cccccc] hover:text-white hover:bg-[#2a2d32] transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="10" r="3"/><path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z"/></svg>
                  Google Maps
                </a>
                <a
                  href={`https://maps.apple.com/?q=${encodeURIComponent(selectedLocation.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-md bg-[#1a1d22] border border-[#333333] text-[#cccccc] hover:text-white hover:bg-[#2a2d32] transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 20H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5"/><path d="M9 17l3 3 3-3"/><path d="M12 20V9"/></svg>
                  Apple Maps
                </a>
                <a
                  href={`https://waze.com/ul?q=${encodeURIComponent(selectedLocation.address)}&navigate=yes`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-md bg-[#1a1d22] border border-[#333333] text-[#cccccc] hover:text-white hover:bg-[#2a2d32] transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                  Waze
                </a>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(selectedLocation.address)
                    setCopied(true)
                    setTimeout(() => setCopied(false), 2000)
                  }}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-md bg-[#1a1d22] border border-[#333333] text-[#cccccc] hover:text-white hover:bg-[#2a2d32] transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                <button
                  onClick={() => {
                    navigator.share?.({
                      title: 'Location',
                      text: selectedLocation.address,
                    })
                  }}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-md bg-[#1a1d22] border border-[#333333] text-[#cccccc] hover:text-white hover:bg-[#2a2d32] transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/></svg>
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="border border-dashed border-[#333333] rounded-lg p-4 text-center text-sm text-[#555555]">
          No location selected yet. Type an address or click on the map.
        </div>
      )}
    </div>
  )
}
