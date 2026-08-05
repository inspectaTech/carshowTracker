import { useState, useEffect } from 'react'
import { useLoaderData, useRouter, useNavigate, Link } from '@tanstack/react-router'
import { Calendar, Clock, MapPin, Share2, ArrowLeft, Users } from 'lucide-react'
import LinksSection from '#/components/links/LinksSection'
import EventMap from './EventMap'

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
  'August', 'September', 'October', 'November', 'December']

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return `${MONTHS[d.getMonth()].slice(0, 3)}, ${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
}

function formatDayMonth(dateStr) {
  if (!dateStr) return { month: '—', day: '—' }
  const d = new Date(dateStr)
  return { month: MONTHS[d.getMonth()].slice(0, 3).toUpperCase(), day: String(d.getDate()).padStart(2, '0') }
}

export default function EventDetailPage() {
  const { event } = useLoaderData({ from: '/event/$slugId' })
  const router = useRouter()
  const navigate = useNavigate()

  // Back-button logic:
  // - If there's navigation history (history index > 0) -> go back()
  // - Else -> if registered, go to /explore; if not, hide the button
  // We detect "has history" via the router's history state index.
  const hasHistory = typeof window !== 'undefined' && window.history.state?.idx > 0
  const [isRegistered, setIsRegistered] = useState(false)

  useEffect(() => {
    let active = true
    import('#/server/events').then(({ getSessionUser }) =>
      getSessionUser().then((s) => { if (active) setIsRegistered(!!s?.userId) })
    )
    return () => { active = false }
  }, [])

  const handleBack = () => {
    if (hasHistory) {
      router.history.back()
    } else if (isRegistered) {
      navigate({ to: '/explore' })
    }
  }

  const showBack = hasHistory || isRegistered

  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      try { await navigator.share({ title: event?.title, url }) } catch {}
    } else {
      try { await navigator.clipboard.writeText(url) } catch {}
    }
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-[#04080b] flex flex-col items-center justify-center p-6">
        <h1 className="text-white text-[28px] font-medium mb-2">Event not found</h1>
        <p className="text-[#888888] text-[16px] mb-6">This event may have been removed or the link is incorrect.</p>
        <Link to="/" className="text-[#e10908] hover:underline text-[15px]">← Back to home</Link>
      </div>
    )
  }

  const { month, day } = formatDayMonth(event.date)
  const dateLabel = formatDate(event.date)
  const timeLabel = [event.startTime, event.endTime].filter(Boolean).join(' – ')

  return (
    <div data-component="event-detail-page" className="min-h-screen bg-[#04080b] pb-16">
      {/* Hero image */}
      <div data-part="hero" className="w-full h-[260px] sm:h-[320px] bg-[#0a0d12] relative">
        {event.photoUrl ? (
          <img src={event.photoUrl} alt={event.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0e1116] to-[#1a1d22]">
            <span className="text-[#333333] text-[40px] font-semibold">{month} {day}</span>
          </div>
        )}
      </div>

      {/* Title bar */}
      <div data-part="title-bar" className="bg-[#0a0d12] border-b border-[#1a1d22] px-4 sm:px-8 py-5">
        <div data-part="top-row" className="max-w-[1200px] mx-auto flex items-center justify-between mb-4">
          {showBack ? (
            <button
              data-part="back-btn"
              onClick={handleBack}
              className="inline-flex items-center gap-2 text-[#AAAAAA] hover:text-white transition-colors text-[14px]"
            >
              <ArrowLeft size={16} />
              {hasHistory ? 'Back' : 'Explore more events'}
            </button>
          ) : <span />}
          <button
            data-part="share-btn"
            onClick={handleShare}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#333333] text-[#AAAAAA] hover:text-white hover:border-[#555555] transition-colors text-[14px]"
          >
            <Share2 size={15} />
            Share
          </button>
        </div>
        <div className="max-w-[1200px] mx-auto">
          <h1 className="text-white text-[26px] sm:text-[32px] font-medium">{event.title}</h1>
          <div data-part="meta-row" className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-3 text-[#AAAAAA] text-[15px]">
            {dateLabel && (
              <span className="inline-flex items-center gap-2">
                <Calendar size={17} className="text-[#888888]" /> {dateLabel}
              </span>
            )}
            {timeLabel && (
              <span className="inline-flex items-center gap-2">
                <Clock size={17} className="text-[#888888]" /> {timeLabel}
              </span>
            )}
            {event.location && (
              <span className="inline-flex items-center gap-2">
                <MapPin size={17} className="text-[#888888]" /> {event.location}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Body: two columns */}
      <div data-part="body" className="max-w-[1200px] mx-auto px-4 sm:px-8 mt-8 flex flex-col lg:flex-row gap-8">
        {/* Left column — event details */}
        <div data-part="left-col" className="flex-1 min-w-0 space-y-8">
          {/* Date & Time */}
          <section data-part="section-date-time">
            <h2 className="text-white text-[18px] font-medium mb-4">Date &amp; Time</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: 'Date', value: dateLabel, icon: Calendar },
                { label: 'Start Time', value: event.startTime || '—', icon: Clock },
                { label: 'End Time', value: event.endTime || '—', icon: Clock },
              ].map((s) => (
                <div key={s.label} className="bg-[#0a0d12] rounded-xl p-4 flex items-center gap-3">
                  <s.icon size={22} className="text-[#e10908] shrink-0" />
                  <div className="min-w-0">
                    <div className="text-[#888888] text-[13px]">{s.label}</div>
                    <div className="text-white text-[15px] truncate">{s.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Location + Map */}
          {event.location && (
            <section data-part="section-location">
              <h2 className="text-white text-[18px] font-medium mb-4">Location</h2>
              <EventMap
                lat={event.lat}
                lng={event.lng}
                label={event.location}
                height={220}
              />
              <div className="bg-[#0a0d12] rounded-xl p-5 mt-4">
                <div className="flex items-center gap-2.5 text-white text-[15px]">
                  <MapPin size={17} className="text-[#888888]" /> {event.location}
                </div>
                {event.zipCode && (
                  <div className="flex items-center gap-2.5 text-white text-[15px] mt-2">
                    <span className="text-[#888888] text-[17px] leading-none">#</span> Zip Code: {event.zipCode}
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Description */}
          {event.description && (
            <section data-part="section-description">
              <h2 className="text-white text-[18px] font-medium mb-4">About this event</h2>
              <div
                data-part="description"
                className="bg-[#0a0d12] rounded-xl p-5 text-[#AAAAAA] text-[15px] leading-relaxed prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: event.description }}
              />
            </section>
          )}

          {/* Cost */}
          <section data-part="section-cost">
            <h2 className="text-white text-[18px] font-medium mb-4">Cost</h2>
            <div className="bg-[#0a0d12] rounded-xl p-5 flex items-center gap-4">
              <span className="inline-flex items-center px-4 py-2 rounded-lg bg-[#e10908] text-white text-[15px]">
                {event.costType === 'paid' && event.price ? `$${event.price}` : 'Free'}
              </span>
              <span className="text-[#888888] text-[14px]">
                {event.costType === 'paid' && event.price ? 'Entry fee' : 'Free entry'}
              </span>
            </div>
          </section>

          {/* Links — shareable links (social icons + hyperlinks) */}
          {Array.isArray(event.links) && event.links.length > 0 && (
            <section data-part="section-links">
              <h2 className="text-white text-[18px] font-medium mb-4">Links</h2>
              <div className="bg-[#0a0d12] rounded-xl p-5">
                <LinksSection mode="display" value={event.links} />
              </div>
            </section>
          )}

          {/* Category */}
          {event.category && (
            <section data-part="section-category">
              <h2 className="text-white text-[18px] font-medium mb-4">Category</h2>
              <span className="inline-flex items-center px-3.5 py-1.5 rounded-md bg-[#1a1d22] text-[#e10908] text-[13px]">
                {event.category}
              </span>
            </section>
          )}
        </div>

        {/* Right column — action area */}
        <aside data-part="right-col" className="w-full lg:w-[360px] shrink-0 space-y-5">
          <button
            data-part="rsvp-btn"
            className="w-full h-14 rounded-xl bg-[#e10908] hover:bg-[#c00807] text-white text-[18px] font-medium transition-colors"
          >
            Get Tickets
          </button>

          <div data-part="attendee-card" className="bg-[#0a0d12] rounded-xl p-5">
            <div className="text-white text-[18px] font-medium">{event.attending} attending</div>
            <div className="flex items-center gap-2.5 mt-4">
              <div className="flex -space-x-2">
                {['#e10908', '#333333', '#555555', '#777777'].map((c, i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-[#0a0d12]" style={{ background: c }} />
                ))}
              </div>
              <span className="text-[#888888] text-[13px]">Join the crowd</span>
            </div>
            <p className="text-[#888888] text-[13px] mt-3">Interested? Tap Get Tickets to RSVP.</p>
          </div>

          <button
            data-part="share-card-btn"
            onClick={handleShare}
            className="w-full h-12 rounded-xl bg-[#04080b] border border-[#333333] hover:border-[#555555] text-white text-[15px] transition-colors inline-flex items-center justify-center gap-2"
          >
            <Share2 size={18} /> Share this event
          </button>
        </aside>
      </div>
    </div>
  )
}
