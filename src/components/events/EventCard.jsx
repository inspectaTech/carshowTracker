import { MapPin, Clock, Users, Pencil, ChevronRight } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']

function eventDate(ev) {
  return ev.date ? new Date(ev.date) : null
}

// Safe string coercion — guards against a raw Date object (which React cannot
// render directly and would throw "[object Date] is not valid as a React child").
function timeStr(v) {
  if (v == null || v === '') return ''
  if (v instanceof Date) {
    let h = v.getHours()
    const m = String(v.getMinutes()).padStart(2, '0')
    const ampm = h >= 12 ? 'PM' : 'AM'
    h = h % 12 || 12
    return `${h}:${m} ${ampm}`
  }
  return String(v)
}

// Shorten a location string to just "City, State" for the card — the full
// address stays on the event page. Handles "City, State" and
// "Street, City, State zip" formats; strips a trailing postal code.
function shortLocation(location) {
  if (!location) return ''
  const parts = location
    .split(',')
    .map((p) => p.trim())
    .filter(Boolean)
  if (parts.length === 0) return ''
  if (parts.length === 1) return parts[0]
  const city = parts[parts.length - 2]
  const state = parts[parts.length - 1].replace(/[\d-]+/g, '').trim()
  return [city, state].filter(Boolean).join(', ')
}

/**
 * Shared site-wide event card — the "My Events" display (big calendar date badge).
 * Used by both My Events and Explore so events render identically everywhere.
 *
 * Props:
 *   - event: the event object (slugId, title, date, startTime, endTime, location, attending, category)
 *   - onNavigate: optional override for what happens on click (defaults to /event/{slugId})
 *   - editable: when true, replaces the chevron with an edit button (creator edit flow)
 *   - onEdit: called with the event when the edit button is clicked
 */
export default function EventCard({ event, onNavigate, editable, onEdit }) {
  const navigate = useNavigate()

  const d = eventDate(event)
  const month = d ? MONTHS[d.getMonth()] : '—'
  const day = d ? String(d.getDate()).padStart(2, '0') : '—'

  const handleClick = () => {
    if (onNavigate) {
      onNavigate(event)
    } else if (event.slugId) {
      navigate({ to: `/event/${event.slugId}` })
    }
  }

  return (
    <div
      key={event.slugId || event.title}
      data-component="EventCard"
      onClick={handleClick}
      className="bg-[#0a0d12] rounded-xl px-4 sm:px-6 py-4 sm:py-5 flex items-center gap-4 sm:gap-5 hover:bg-[#0e1116] transition-colors border border-transparent hover:border-[#1a1d22] cursor-pointer group"
    >
      {/* Date badge */}
      <div data-part="date-badge" className="w-[70px] h-[80px] bg-[#04080b] rounded-lg flex flex-col items-center justify-center gap-0.5 shrink-0">
        <span className="text-[#e10908] text-[12px] font-bold uppercase leading-none">{month}</span>
        <span className="text-white text-[28px] font-bold leading-none mt-1">{day}</span>
      </div>

      {/* Event info */}
      <div data-part="event-info" className="flex-1 min-w-0 space-y-1">
        <h3 className="text-white text-[16px] sm:text-[18px] font-medium truncate">{event.title}</h3>
        <p className="text-[#888888] text-[13px] sm:text-[14px] flex items-center gap-1.5 flex-wrap">
          <MapPin size={14} className="shrink-0" />
          <span title={event.location}>{shortLocation(event.location)}</span>
          <span className="mx-1 text-[#444]">•</span>
          <Clock size={14} className="shrink-0" />
          {timeStr(event.startTime) || timeStr(event.endTime) || '—'}
          <span className="mx-1 text-[#444]">•</span>
          <Users size={14} className="shrink-0" />
          {event.attending} attending
        </p>
        <div data-part="status-row" className="flex items-center gap-2">
          <span className="text-[#e10908] text-[12px]">{event.category}</span>
        </div>
      </div>

      {/* Edit button (creator) or chevron */}
      {editable ? (
        <button
          type="button"
          data-part="edit-btn"
          title="Edit event"
          onClick={(e) => {
            e.stopPropagation()
            if (onEdit) onEdit(event)
          }}
          className="w-10 h-10 shrink-0 flex items-center justify-center rounded-lg bg-[#1a1d22] hover:bg-[#e10908] text-[#e6e6e6] transition-colors"
        >
          <Pencil size={17} />
        </button>
      ) : (
        <ChevronRight className="h-5 w-5 text-[#555555] group-hover:text-white transition-colors shrink-0" />
      )}
    </div>
  )
}
