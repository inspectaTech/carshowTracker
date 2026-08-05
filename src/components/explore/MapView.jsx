import { useEffect, useRef } from 'react'
import { loadLeaflet } from '#/lib/leaflet-client'

const CENTER = [34.0522, -118.2437] // Los Angeles
const ZOOM = 10

const EVENTS = [
  { name: 'SoCal JDM Meet 2026', pos: [34.0522, -118.2437] },
  { name: 'JDM Legends Show', pos: [32.7157, -117.1611] },
  { name: 'Euro Night Cruise', pos: [34.0195, -118.4912] },
]

export default function MapView() {
  const mapRef = useRef(null)
  const mapInstance = useRef(null)

  useEffect(() => {
    // Dynamically load Leaflet to avoid SSR issues
    async function initMap() {
      if (mapInstance.current) return

      try {
        const L = await loadLeaflet()

        const map = L.map(mapRef.current, {
          center: CENTER,
          zoom: ZOOM,
          zoomControl: false,
          attributionControl: false,
        })

        // Add zoom controls to bottom-right (avoids clashing with mobile sidebar)
        L.control.zoom({ position: 'bottomright' }).addTo(map)

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; <a href="https://openstreetmap.org/copyright">OSM</a>',
        }).addTo(map)

        // Add event markers
        EVENTS.forEach((event) => {
          L.marker(event.pos)
            .addTo(map)
            .bindPopup(`<b>${event.name}</b>`)
        })

        mapInstance.current = map
      } catch (err) {
        console.error('[MapView] Failed to load Leaflet:', err)
      }
    }

    initMap()

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove()
        mapInstance.current = null
      }
    }
  }, [])

  return (
    <div
      ref={mapRef}
      data-part="leaflet-map"
      className="w-full h-full min-h-[220px]"
      style={{ background: '#0a0d12' }}
    />
  )
}
