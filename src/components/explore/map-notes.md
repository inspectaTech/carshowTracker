# Map Architecture Notes

## Q: Mapping Software Used

**A:** Two pieces working together:

- **OpenStreetMap (OSM)** — The map *data* provider. The actual geographic database: roads, buildings, venues, addresses. Free, community-maintained, covers the entire planet.
- **Leaflet.js** (v1.9.4) — The map *renderer*. A lightweight JS library that displays OSM tiles as an interactive map (pan, zoom, markers, popups). Loaded dynamically via `import('leaflet')` to avoid SSR issues.
- **react-leaflet** (v5.0.0) — React bindings installed but not currently used; the `MapView` component uses raw Leaflet with a `useRef` pattern.

---

## Q: How does address handling work with Leaflet/OSM?

**A:** Leaflet/OSM alone **cannot do address lookups**. They are a display layer + tile provider. For address functionality you need a **geocoding service**:

| Capability | What it does | Built into our stack? |
|---|---|---|
| **Address → Coordinates** (forward geocoding) | "1600 Amphitheatre Pkwy, Mountain View" → `[37.422, -122.084]` | ❌ Need a geocoding API |
| **Coordinates → Address** (reverse geocoding) | `[37.422, -122.084]` → "1600 Amphitheatre Pkwy, Mountain View, CA" | ❌ Need a geocoding API |
| **Address autocomplete** | Type "1600 Amp..." → suggestions dropdown | ❌ Need a geocoding API |
| **Show map with marker** | Display Leaflet map centered on coordinates | ✅ Already works |

---

## Q: What geocoding options are available?

### Free — Nominatim (OpenStreetMap's own geocoding API)

```js
// Forward: address → coordinates
const res = await fetch(
  'https://nominatim.openstreetmap.org/search?q=1600+Amphitheatre+Parkway&format=json&limit=5'
)
// Returns [{ lat, lon, display_name }]

// Reverse: coordinates → address
const res = await fetch(
  'https://nominatim.openstreetmap.org/reverse?lat=37.422&lon=-122.084&format=json'
)
// Returns { display_name, address: { road, city, state, postcode } }
```

**Rate limit:** 1 request/second. Must set a `User-Agent` header. Fine for low-traffic apps.

### Paid — Google Maps Geocoding API, Mapbox Geocoding API
Higher limits, proper autocomplete, better results. Both cost money.

---

## Q: Two proposed location input methods?

### Option A — Type an address
- Text input with debounced autocomplete firing Nominatim (or Mapbox) requests as the user types
- User selects a suggestion → store `{ address, lat, lng }`
- Marker drops on map automatically

### Option B — Pin on the map
- User taps a map icon → modal opens with a Leaflet map
- User clicks anywhere → marker drops
- Reverse-geocode the coordinates to get an address string
- Store `{ address, lat, lng }` either way

**Best practice:** Store **both** the typed/pinned address string AND the coordinates so you always have a fallback.

---

## Q: What to display when there's no written address?

- Show a scrollable mini Leaflet map with a marker at the stored coordinates
- Below it, show coordinates as fallback text: `34.0522° N, 118.2437° W`
- Optionally reverse-geocode on the event detail page to get a human-readable address

---

## File Locations

- **Map component:** `src/components/explore/MapView.jsx`
- **Explore page (uses the map):** `src/components/explore/ExplorePage.jsx`
- **Map styles:** `src/styles/global.css` (Leaflet dark theme overrides, zoom controls position)
