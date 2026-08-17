import { useEffect, useRef } from 'react'
import { loadLeaflet } from '#/lib/leaflet-client'

const DEFAULT_CENTER = [34.0522, -118.2437] // Los Angeles
const DEFAULT_ZOOM = 10

/**
 * Read-only Leaflet map for the event detail page. Centers on the event's
 * coordinates (lat/lng) with a marker. No click-to-edit — display only.
 *
 * Props:
 *   - lat, lng: coordinates to center on (both required to show a marker)
 *   - label: popup text (e.g. the event location)
 *   - height: CSS height (default 220)
 */
export default function EventMap({ lat, lng, label, height = 220 }) {
  const mapRef = useRef(null)
  const mapInstance = useRef(null)

  // Accept numbers or numeric strings; reject null/undefined/''/NaN/0-fallbacks.
  const toNum = (v) => {
    if (v === null || v === undefined || v === '') return NaN
    const n = typeof v === 'number' ? v : Number(v)
    return Number.isNaN(n) ? NaN : n
  }
  const numLat = toNum(lat)
  const numLng = toNum(lng)
  const hasCoords = Number.isFinite(numLat) && Number.isFinite(numLng) && (numLat !== 0 || numLng !== 0)

  useEffect(() => {
    if (!hasCoords || !mapRef.current) return
    if (mapInstance.current) return

    let cancelled = false
    async function initMap() {
      const L = await loadLeaflet()

      if (cancelled || !mapRef.current || mapInstance.current) return

      const map = L.map(mapRef.current, {
        center: [numLat, numLng],
        zoom: DEFAULT_ZOOM,
        zoomControl: false,
        attributionControl: false,
      })

      // Zoom controls bottom-right so they don't clash with page UI on mobile
      L.control.zoom({ position: 'bottomright' }).addTo(map)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://openstreetmap.org/copyright">OSM</a>',
      }).addTo(map)

      L.marker([numLat, numLng])
        .addTo(map)
        .bindPopup(label || 'Event location')

      mapInstance.current = map
      setTimeout(() => map.invalidateSize(), 250)
    }

    initMap()

    return () => {
      cancelled = true
      if (mapInstance.current) {
        mapInstance.current.remove()
        mapInstance.current = null
      }
    }
  }, [hasCoords, numLat, numLng, label])

  if (!hasCoords) {
    return (
      <div data-part="map-empty" className="w-full h-[220px] bg-[#0a0d12] rounded-xl flex items-center justify-center border border-[#1a1d22]">
        <div className="text-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#e10908" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-2">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <p className="text-[#555555] text-[14px]">Map coming soon</p>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={mapRef}
      data-part="event-map"
      className="relative z-0 w-full h-full rounded-xl overflow-hidden border border-[#1a1d22]"
      style={{ background: '#0a0d12', height }}
    />
  )
}
