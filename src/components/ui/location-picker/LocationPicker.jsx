import { useState, useRef, useEffect, useCallback } from 'react'
import { loadLeaflet } from '#/lib/leaflet-client'
import LocationSummary from './LocationSummary'

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

export default function LocationPicker({ onLocationSelect, onClear, onZipCode, initialValue = null }) {
  // --- State ---
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [isSearching, setIsSearching] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // --- Refs ---
  const mapRef = useRef(null)
  const mapWrapperRef = useRef(null)
  const mapInstance = useRef(null)
  const markerInstance = useRef(null)
  const debounceTimer = useRef(null)
  const inputRef = useRef(null)
  const justSelected = useRef(false)
  const initializedRef = useRef(null)
  const programmaticQueryRef = useRef(null)
  const pressTimerRef = useRef(null)
  const pressStartRef = useRef(null)

  // Long-press threshold (ms) before the pin is placed. Prevents accidental
  // pin drops while scrolling/panning the map.
  const LONG_PRESS_MS = 500
  const PRESS_MOVE_TOLERANCE = 12 // px of finger/touch travel before cancel

  // --- Populate from an initial value (edit mode) ---
  // When the modal opens to edit an existing event, reflect its saved location
  // in the input, the map marker, and the summary panel below the map.
  useEffect(() => {
    if (!initialValue) return
    const { address, lat, lng } = initialValue
    const key = `${address}|${lat}|${lng}`
    if (initializedRef.current === key) return
    initializedRef.current = key

    setQuery(address || '')
    // Suppress the autocomplete search for this programmatically-set address
    programmaticQueryRef.current = address || ''

    if (typeof lat === 'number' && typeof lng === 'number' && !Number.isNaN(lat) && !Number.isNaN(lng)) {
      setSelectedLocation({ address: address || '', lat, lng })

      // Place the marker once the map instance is ready (map init is async)
      const tryPlace = () => {
        if (mapInstance.current) {
          placeMarker(lat, lng)
        } else {
          setTimeout(tryPlace, 50)
        }
      }
      tryPlace()
    } else {
      setSelectedLocation(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValue])

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

  // Keep the parent callbacks in refs so notifyLocation can stay stable. The
  // modal passes new inline functions every render; if notifyLocation changed
  // identity, the map-init effect below would re-run and DESTROY + rebuild the
  // map (wiping the pin and resetting to the initial view) on every re-render.
  const onLocationSelectRef = useRef(onLocationSelect)
  const onZipCodeRef = useRef(onZipCode)
  useEffect(() => { onLocationSelectRef.current = onLocationSelect }, [onLocationSelect])
  useEffect(() => { onZipCodeRef.current = onZipCode }, [onZipCode])

  // --- Notify parent of location change (stable identity) ---
  const notifyLocation = useCallback((loc, addrObj) => {
    setSelectedLocation(loc)
    if (onLocationSelectRef.current) onLocationSelectRef.current(loc)
    if (addrObj?.postcode && onZipCodeRef.current) onZipCodeRef.current(addrObj.postcode)
  }, [])

  // --- Initialize Leaflet map ---
  useEffect(() => {
    if (mapInstance.current || !mapRef.current) return

    async function initMap() {
      const L = await loadLeaflet()

      // Prevent double initialization
      if (mapRef.current._leaflet_map) return

      const map = L.map(mapRef.current, {
        center: DEFAULT_CENTER,
        zoom: DEFAULT_ZOOM,
        zoomControl: false,
        attributionControl: false,
        doubleClickZoom: false, // double-click zooms without moving the pin
      })

      // Zoom controls bottom-right (avoids mobile sidebar/fullscreen clash)
      L.control.zoom({ position: 'bottomright' }).addTo(map)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://openstreetmap.org/copyright">OSM</a>',
      }).addTo(map)

      // Long-press (hold ~LONG_PRESS_MS) to place a marker + reverse geocode.
      // The pin is placed WHILE still holding (before release). A quick tap,
      // drag, or scroll does NOT move the pin. Releasing/cancelling never
      // removes an already-placed pin — it only clears a still-pending press.
      // Uses Pointer Events (unified mouse/touch/pen) on the map container for
      // reliable mobile behavior — Leaflet's synthetic mouse events are not
      // dependable for touch long-press.
      const placeAt = async (lat, lng) => {
        placeMarker(lat, lng)
        try {
          const res = await fetch(
            `${NOMINATIM_URL}/reverse?lat=${lat}&lon=${lng}&format=json`,
            { headers: { 'User-Agent': 'CarshowTracker/1.0' } }
          )
          const data = await res.json()
          const address = data.address ? formatCleanAddress(data.address) : data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`
          notifyLocation({ address, lat, lng }, data.address)
          justSelected.current = true
          setQuery(address)
          setShowSuggestions(false)
        } catch {
          notifyLocation({ address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`, lat, lng })
          justSelected.current = true
          setQuery(`${lat.toFixed(6)}, ${lng.toFixed(6)}`)
          setShowSuggestions(false)
        }
      }

      const cancelPress = () => {
        if (pressTimerRef.current) {
          clearTimeout(pressTimerRef.current)
          pressTimerRef.current = null
        }
        pressStartRef.current = null
      }

      // Resolve pointer coordinates -> lat/lng. Guarded so it can never throw —
      // if the map pane isn't ready yet (first render inside the animated
      // modal), returns null and the press is ignored rather than crashing.
      const eventToLatLng = (e) => {
        try {
          const ll = map.mouseEventToLatLng(e)
          if (ll) return ll
        } catch { /* fall through */ }
        try {
          const rect = map.getContainer().getBoundingClientRect()
          const point = L.point(e.clientX - rect.left, e.clientY - rect.top)
          return map.containerPointToLatLng(point)
        } catch {
          return null
        }
      }

      const startPress = (e) => {
        // Ignore presses that begin on Leaflet controls (zoom buttons, etc.)
        if (e.target?.closest?.('.leaflet-control, a, button')) return
        cancelPress()
        const latlng = eventToLatLng(e)
        if (!latlng) return
        pressStartRef.current = { lat: latlng.lat, lng: latlng.lng, x: e.clientX, y: e.clientY }
        // Place the pin while still holding (before release).
        pressTimerRef.current = setTimeout(() => {
          const start = pressStartRef.current
          pressTimerRef.current = null
          if (start) placeAt(start.lat, start.lng)
        }, LONG_PRESS_MS)
      }

      const movePress = (e) => {
        if (!pressStartRef.current) return
        const dx = Math.abs(e.clientX - pressStartRef.current.x)
        const dy = Math.abs(e.clientY - pressStartRef.current.y)
        if (dx + dy > PRESS_MOVE_TOLERANCE) {
          cancelPress() // user is dragging/panning — don't place a pin
        }
      }

      // Pointer Events unify mouse/touch/pen and give us pointercancel (fires
      // when the browser takes over for scrolling/panning).
      const container = map.getContainer()
      container.addEventListener('pointerdown', startPress)
      container.addEventListener('pointermove', movePress)
      container.addEventListener('pointerup', cancelPress)
      container.addEventListener('pointercancel', cancelPress)
      container.addEventListener('pointerleave', cancelPress)
      container.addEventListener('contextmenu', (e) => e.preventDefault())

      mapInstance.current = map
      mapRef.current._leaflet_map = true

      // Fix first-render sizing: the map is inside an animating modal, so its
      // pane position may not be ready for the very first pointer event.
      setTimeout(() => {
        if (mapInstance.current) mapInstance.current.invalidateSize()
      }, 300)
    }

    initMap()

    return () => {
      if (pressTimerRef.current) {
        clearTimeout(pressTimerRef.current)
        pressTimerRef.current = null
      }
      pressStartRef.current = null
      if (mapInstance.current) {
        mapInstance.current.remove()
        mapInstance.current = null
      }
      if (mapRef.current) {
        mapRef.current._leaflet_map = false
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
    // Suppress search when query was set programmatically after selecting a suggestion
    if (justSelected.current) {
      justSelected.current = false
      return
    }
    // Suppress search when the query still equals the programmatically-set
    // initial address (edit mode prefill) — only search once the user types.
    if (programmaticQueryRef.current && query === programmaticQueryRef.current) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

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
      justSelected.current = true
      setQuery(address)
    } catch {
      notifyLocation({ address: s.display_name, lat, lng })
      justSelected.current = true
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
              onChange={(e) => {
                programmaticQueryRef.current = null
                setQuery(e.target.value)
              }}
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
        <LocationSummary
          address={selectedLocation.address}
          lat={selectedLocation.lat}
          lng={selectedLocation.lng}
          title="Selected Location"
        />
      ) : (
        <div className="border border-dashed border-[#333333] rounded-lg p-4 text-center text-sm text-[#555555]">
          No location selected yet. Type an address or click on the map.
        </div>
      )}
    </div>
  )
}
