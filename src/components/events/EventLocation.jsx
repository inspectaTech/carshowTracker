import EventMap from './EventMap'
import LocationSummary from '#/components/ui/location-picker/LocationSummary'

/**
 * Read-only event location display for the event detail page — packages the
 * same map + summary used in the Create/Edit Event form, but display-only:
 *
 *   - Leaflet map centered on the event's coordinates (marker)
 *   - Location summary: address, coordinates (decimal + DMS), and links to
 *     Google / Apple / Waze maps + Copy / Share
 *
 * Props:
 *   - event: the event object (location, lat, lng, zipCode)
 */
export default function EventLocation({ event }) {
  const toNum = (v) => {
    if (v === null || v === undefined || v === '') return NaN
    const n = typeof v === 'number' ? v : Number(v)
    return Number.isNaN(n) ? NaN : n
  }
  const lat = toNum(event?.lat)
  const lng = toNum(event?.lng)
  const hasCoords = Number.isFinite(lat) && Number.isFinite(lng) && (lat !== 0 || lng !== 0)

  return (
    <div data-component="EventLocation" className="space-y-4">
      <EventMap lat={event?.lat} lng={event?.lng} label={event?.location} height={220} />

      {hasCoords ? (
        <LocationSummary
          address={event?.location || `${lat}, ${lng}`}
          lat={lat}
          lng={lng}
          title="Location"
        />
      ) : (
        <div className="bg-[#0a0d12] rounded-xl p-5 flex items-center gap-2.5 text-white text-[15px]">
          {event?.location || 'Location not available'}
        </div>
      )}

      {event?.zipCode && (
        <div className="bg-[#0a0d12] rounded-xl p-5 flex items-center gap-2.5 text-white text-[15px]">
          <span className="text-[#888888] text-[17px] leading-none">#</span> Zip Code: {event.zipCode}
        </div>
      )}
    </div>
  )
}
