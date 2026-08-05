// Shared client-side Leaflet bootstrap: injects the CSS, fixes marker icon
// paths, and applies our dark-theme + z-index overrides. Also fixes the mobile
// issue where zoom +/- buttons render UNDER the map panes (Leaflet's control
// containers default lower than the tile/map panes unless the CSS applies).
let injected = false

export function injectLeafletStyles() {
  if (injected || typeof document === 'undefined') return
  injected = true

  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
  document.head.appendChild(link)

  // Dark-theme + stacking overrides.
  // .leaflet-top/.leaflet-bottom must sit ABOVE the tile (200) & map (400)
  // panes so the zoom controls are tappable and visible.
  const style = document.createElement('style')
  style.textContent = `
    .leaflet-top, .leaflet-bottom { z-index: 1000 !important; pointer-events: none; }
    .leaflet-control { pointer-events: auto; }
    .leaflet-control-container { z-index: 1000; }
    .leaflet-bar { border: 1px solid #333333 !important; box-shadow: 0 2px 8px rgba(0,0,0,0.5); }
    .leaflet-bar a {
      width: 38px; height: 38px; line-height: 38px;
      background: #0a0d12 !important; color: #e6e6e6 !important;
      border-bottom: 1px solid #333333 !important; font-size: 20px;
    }
    .leaflet-bar a:hover { background: #1a1d22 !important; color: #ffffff !important; }
    .leaflet-bar a.leaflet-disabled { background: #0a0d12 !important; color: #444444 !important; }
    .leaflet-container { background: #0a0d12; }
    .leaflet-container a { color: #4da3ff; }
    .leaflet-popup-content-wrapper, .leaflet-popup-tip { background: #0a0d12; color: #ffffff; }
  `
  document.head.appendChild(style)
}

export async function loadLeaflet() {
  injectLeafletStyles()
  const L = await import('leaflet')

  // Fix Leaflet icon paths (broken with bundlers)
  delete L.Icon.Default.prototype._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  })

  return L
}
