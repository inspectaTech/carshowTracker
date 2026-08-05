import { useState } from 'react'

/** Convert decimal degrees to Degrees-Minutes-Seconds format */
export function dms(coord, type) {
  const abs = Math.abs(coord)
  const deg = Math.floor(abs)
  const min = Math.floor((abs - deg) * 60)
  const sec = ((abs - deg - min / 60) * 3600).toFixed(2)
  const dir = type === 'lat' ? (coord >= 0 ? 'N' : 'S') : (coord >= 0 ? 'E' : 'W')
  return `${deg}°${min}'${sec}"${dir}`
}

/**
 * Reusable location summary — the "Selected Location" output panel used in the
 * Create/Edit Event form. Also rendered read-only on the event detail page.
 *
 * Shows the address, coordinates two ways (decimal + DMS), links to Google /
 * Apple / Waze maps, and Copy / Share actions.
 *
 * Props:
 *   - address: display address string
 *   - lat, lng: numeric coordinates (decimal degrees)
 *   - title: optional section heading (default "Selected Location")
 */
export default function LocationSummary({ address, lat, lng, title = 'Selected Location' }) {
  const [copied, setCopied] = useState(false)

  const hasCoords =
    typeof lat === 'number' && typeof lng === 'number' && !Number.isNaN(lat) && !Number.isNaN(lng)

  const copy = () => {
    if (!address) return
    navigator.clipboard?.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const share = () => {
    if (!address) return
    navigator.share?.({
      title: 'Location',
      text: address,
    })
  }

  const linkCls =
    'inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-md bg-[#1a1d22] border border-[#333333] text-[#cccccc] hover:text-white hover:bg-[#2a2d32] transition-colors'

  return (
    <div data-component="location-summary" className="border border-[#333333] rounded-lg p-3 bg-[#0a0d12]">
      <h3 className="text-xs font-semibold text-[#888888] uppercase tracking-wider mb-2">{title}</h3>
      <div className="space-y-1.5 text-sm">
        <div>
          <span className="text-[#888888] text-xs">Address:</span>
          <p className="text-white mt-0.5 text-[13px] leading-relaxed">{address || '—'}</p>
        </div>

        {hasCoords && (
          <>
            <div className="flex gap-4">
              <div>
                <span className="text-[#888888] text-xs">Latitude:</span>
                <p className="text-white mt-0.5 font-mono text-[12px]">{lat.toFixed(6)}</p>
              </div>
              <div>
                <span className="text-[#888888] text-xs">Longitude:</span>
                <p className="text-white mt-0.5 font-mono text-[12px]">{lng.toFixed(6)}</p>
              </div>
            </div>
            <div>
              <span className="text-[#888888] text-xs">DMS:</span>
              <p className="text-white mt-0.5 font-mono text-[11px]">
                {dms(lat, 'lat')}, {dms(lng, 'lng')}
              </p>
            </div>
          </>
        )}

        {/* Open in maps apps + Copy + Share */}
        <div className="pt-2 border-t border-[#333333] mt-2">
          <span className="text-[#888888] text-[11px]">Open in:</span>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            <a
              href={`https://www.google.com/maps?q=${encodeURIComponent(address || `${lat},${lng}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className={linkCls}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="10" r="3"/><path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z"/></svg>
              Google Maps
            </a>
            <a
              href={`https://maps.apple.com/?q=${encodeURIComponent(address || `${lat},${lng}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className={linkCls}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 20H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5"/><path d="M9 17l3 3 3-3"/><path d="M12 20V9"/></svg>
              Apple Maps
            </a>
            <a
              href={`https://waze.com/ul?q=${encodeURIComponent(address || `${lat},${lng}`)}&navigate=yes`}
              target="_blank"
              rel="noopener noreferrer"
              className={linkCls}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              Waze
            </a>
            <button onClick={copy} className={linkCls}>
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              {copied ? 'Copied!' : 'Copy'}
            </button>
            <button onClick={share} className={linkCls}>
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/></svg>
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
