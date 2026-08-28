import { useState, useEffect, useRef } from 'react'
import { X, Camera, MapPin } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import { updateProfile, updateHomeLocation, checkHandleAvailable } from '#/server/session'
import LocationForm from '#/components/ui/location-picker/LocationForm'
import LocationPicker from '#/components/ui/location-picker/LocationPicker'
import HomeLocationControl from '#/components/explore/HomeLocationControl'

const HANDLE_REGEX = /^[a-zA-Z0-9_]{2,30}$/

const EMPTY_STATE = {
  handle: '',
  displayName: '',
  bio: '',
  location: '',
  socialLinks: '',
  aboutMe: '',
  favoriteBrand: '',
  dreamCar: '',
  occupation: '',
  driveStyle: '',
}

// Shorten a full address to "City, State" (+ zip if present) — used to populate
// the public city/state from a home location.
function shortenToCityState(address, zip) {
  if (!address) return ''
  const parts = address.split(',').map((p) => p.trim()).filter(Boolean)
  let city = ''
  let state = ''
  if (parts.length >= 2) {
    city = parts[parts.length - 2]
    state = parts[parts.length - 1].replace(/[\d-]+/g, '').trim()
  }
  if (city && state) return zip ? `${city}, ${state} ${zip}` : `${city}, ${state}`
  return address
}

export default function EditProfileModal({ isOpen, onClose, profile, onUploadPhoto, onSaved }) {
  const initialHomeLocation = profile?.homeLocation || null
  // If the city/state field is empty but a home is set, populate it from the
  // home (shortened to city/state) so the field is never blank on edit.
  const initialLocation = profile?.location || (initialHomeLocation ? shortenToCityState(initialHomeLocation.address, initialHomeLocation.zip) : '')
  const [form, setForm] = useState({
    handle: (profile?.handle || '').replace(/^@/, ''),
    displayName: profile?.username || EMPTY_STATE.displayName,
    bio: profile?.bio || EMPTY_STATE.bio,
    location: initialLocation,
    socialLinks: Array.isArray(profile?.socialLinks) ? profile.socialLinks.join(', ') : '',
    aboutMe: profile?.aboutMe || EMPTY_STATE.aboutMe,
    favoriteBrand: profile?.favoriteBrand || EMPTY_STATE.favoriteBrand,
    dreamCar: profile?.dreamCar || EMPTY_STATE.dreamCar,
    occupation: profile?.occupation || EMPTY_STATE.occupation,
    driveStyle: profile?.driveStyle || EMPTY_STATE.driveStyle,
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [handleStatus, setHandleStatus] = useState({ state: 'idle', msg: '' })
  const debounceRef = useRef(null)
  const [homeLocation, setHomeLocation] = useState(initialHomeLocation)
  const [showHomeEditor, setShowHomeEditor] = useState(false)
  // Which picker is active: 'home' (Set Home Location) or 'city' (Set City/State).
  const [locationMode, setLocationMode] = useState('home')
  // Structured city/state location (address, city, state, lat, lng, zip) — the
  // public-facing location with coords for admin/ad purposes (NOT a tracked home).
  const [locationData, setLocationData] = useState(
    profile?.locationData ||
      (initialHomeLocation
        ? {
            address: initialHomeLocation.address || '',
            city: '',
            state: '',
            lat: initialHomeLocation.lat ?? null,
            lng: initialHomeLocation.lng ?? null,
            zip: initialHomeLocation.zip || '',
          }
        : null)
  )
  // Zip code captured from the picker (emitted separately from the location).
  const [zipCode, setZipCode] = useState(profile?.locationData?.zip || initialHomeLocation?.zip || '')

  // Save a picked point as the user's Home (inline editor submit). Also fills
  // the public city/state (location + locationData) from the home's coords, so
  // the city requirement is met automatically. Preserves the zip code.
  const handleSetHomeFromPicker = async (loc) => {
    const zip = loc.zip || zipCode || ''
    const home = { address: loc.address || 'Home', lat: loc.lat, lng: loc.lng, zip }
    try {
      const res = await updateHomeLocation({ data: { homeLocation: home } })
      if (res?.success) {
        setHomeLocation(home)
        setZipCode(zip)
        setShowHomeEditor(false)
        // Fill city/state from the home location (overwrites any prior city).
        const cityState = deriveCityState(loc)
        setForm((prev) => ({ ...prev, location: cityState.label }))
        setLocationData(cityState.data)
      } else {
        setError(res?.error === 'Not authenticated' ? "Couldn't set home — please sign in." : `Couldn't set home: ${res?.error || 'unknown error'}`)
      }
    } catch (err) {
      setError("Couldn't set home — network error.")
    }
  }

  // Set the public city/state from a picked location (coords within the city).
  // Does NOT touch the home location — it's an independent data point.
  const handleSetCityState = (loc) => {
    if (loc.zip) setZipCode(loc.zip)
    const cityState = deriveCityState(loc)
    setForm((prev) => ({ ...prev, location: cityState.label }))
    setLocationData(cityState.data)
  }

  // Derive a display label + structured data from a picked location. The label
  // shows ONLY "City, State" (+ zip) — never the street address. Keeps the full
  // address + lat/lng/zip in the structured data for admin/ad purposes.
  const deriveCityState = (loc) => {
    const addr = loc.address || ''
    const parts = addr.split(',').map((p) => p.trim()).filter(Boolean)
    let city = ''
    let state = ''
    if (parts.length >= 2) {
      city = parts[parts.length - 2]
      state = parts[parts.length - 1].replace(/[\d-]+/g, '').trim()
    }
    // Prefer the zip attached to the picked location (available immediately),
    // falling back to the zipCode state (which may lag one render behind).
    const zip = loc.zip || zipCode || ''
    // Display: "City, State" (+ zip if present). Fall back to the address if
    // no city/state could be parsed.
    let label = addr
    if (city && state) {
      label = zip ? `${city}, ${state} ${zip}` : `${city}, ${state}`
    }
    return {
      label,
      data: {
        address: addr,
        city,
        state,
        lat: typeof loc.lat === 'number' ? loc.lat : null,
        lng: typeof loc.lng === 'number' ? loc.lng : null,
        zip,
      },
    }
  }

  const handleClearHome = async () => {
    try {
      const res = await updateHomeLocation({ data: { homeLocation: null } })
      if (res?.success) {
        setHomeLocation(null)
      } else {
        setError(res?.error === 'Not authenticated' ? "Couldn't clear home — please sign in." : `Couldn't clear home: ${res?.error || 'unknown error'}`)
      }
    } catch (err) {
      setError("Couldn't clear home — network error.")
    }
  }

  // Debounced live availability check for the @handle field.
  useEffect(() => {
    const raw = (form.handle || '').trim().replace(/^@/, '')
    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (!raw) {
      setHandleStatus({ state: 'idle', msg: 'Your unique @handle — letters, numbers, underscores' })
      return
    }
    if (!HANDLE_REGEX.test(raw)) {
      setHandleStatus({ state: 'invalid', msg: '2–30 chars: letters, numbers, underscores only' })
      return
    }

    setHandleStatus({ state: 'checking', msg: 'Checking availability…' })
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await checkHandleAvailable({ data: { handle: raw } })
        if (res?.available) {
          setHandleStatus({
            state: res.isOwn ? 'own' : 'available',
            msg: res.isOwn ? "That's your current handle" : '✓ Available',
          })
        } else {
          setHandleStatus({ state: 'taken', msg: res?.reason || 'That handle is already taken' })
        }
      } catch (err) {
        setHandleStatus({ state: 'idle', msg: '' })
      }
    }, 400)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [form.handle])

  const handleError = handleStatus.state === 'invalid' || handleStatus.state === 'taken'
  const handleBlocking = handleStatus.state === 'checking' || handleError

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    try {
      // Require a city if there's no actual home location set — the profile's
      // location string acts as the fallback "home city" for proximity.
      const hasHome = homeLocation && typeof homeLocation.lat === 'number'
      const city = (form.location || '').trim()
      if (!hasHome && !city) {
        setError('Please set a Home Location or a City/State.')
        return
      }
      const result = await updateProfile({ data: { ...form, locationData } })
      if (!result?.success) {
        setError(result?.error || 'Could not save profile')
        return
      }
      if (onSaved) onSaved()
      onClose()
    } catch (err) {
      setError(err.message || 'Could not save profile')
    } finally {
      setSaving(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            data-part="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            data-component="EditProfileModal"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-[#0a0d12] rounded-2xl w-full max-w-[600px] max-h-[90vh] flex flex-col pointer-events-auto shadow-2xl border border-[#1a1d22] overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 shrink-0 border-b border-[#1a1d22]">
                <h2 className="text-white text-[20px] sm:text-[22px] font-medium">Edit Profile</h2>
                <button
                  data-part="close-btn"
                  onClick={onClose}
                  className="text-[#888888] hover:text-white transition-colors"
                >
                  <X size={22} />
                </button>
              </div>

              {/* Form */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Avatar section */}
                <div data-part="avatar-section" className="flex items-center gap-5">
                  <div className="relative w-[80px] h-[80px] shrink-0">
                    <div className="w-full h-full rounded-full bg-[#1a1d22] border-2 border-[#e10908] flex items-center justify-center text-white text-2xl">
                      {profile?.username?.charAt(0) || 'U'}
                    </div>
                    <button
                      data-part="change-photo-btn"
                      onClick={onUploadPhoto}
                      className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#e10908] rounded-full flex items-center justify-center hover:bg-[#c00807] transition-colors"
                    >
                      <Camera size={14} className="text-white" />
                    </button>
                  </div>
                  <div>
                    <p className="text-white text-[16px] font-medium">Profile Photo</p>
                    <button
                      data-part="change-photo-text"                      onClick={onUploadPhoto}                      className="text-[#888888] text-[14px] bg-[#04080b] border border-[#333333] rounded-lg px-3 py-1.5 mt-1 hover:text-white transition-colors"
                    >
                      Change Photo
                    </button>
                  </div>
                </div>

                {/* Display Name */}
                <TextField
                  label="Display Name"
                  value={form.displayName}
                  onChange={(e) => handleChange('displayName', e.target.value)}
                  inputProps={{ 'data-part': 'input-display-name' }}
                  fullWidth
                  size="small"
                />

                {/* Handle */}
                <TextField
                  label="Handle"
                  value={form.handle}
                  onChange={(e) => handleChange('handle', e.target.value)}
                  slotProps={{
                    htmlInput: { 'data-part': 'input-handle' },
                    input: {
                      startAdornment: (
                        <InputAdornment position="start" sx={{ color: '#555555' }}>
                          @
                        </InputAdornment>
                      ),
                    },
                    formHelperText: {
                      style:
                        handleStatus.state === 'available' || handleStatus.state === 'own'
                          ? { color: '#4ade80' }
                          : undefined,
                    },
                  }}
                  error={handleError}
                  helperText={handleStatus.msg}
                  fullWidth
                  size="small"
                />

                {/* Bio */}
                <TextField
                  label="Bio"
                  value={form.bio}
                  onChange={(e) => handleChange('bio', e.target.value)}
                  inputProps={{ 'data-part': 'input-bio' }}
                  multiline
                  rows={4}
                  fullWidth
                  size="small"
                />

                {/* Location */}
                {/* Location — two-button toggle: Set Home Location | Set City/State */}
                <div data-part="profile-location" className="bg-[#04080b] rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="h-4 w-4 text-[#e10908]" />
                    <span className="text-white text-[14px] font-medium">Location</span>
                  </div>

                  {/* Toggle buttons */}
                  <div className="flex items-center gap-2 mb-3">
                    <button
                      type="button"
                      data-part="toggle-home"
                      onClick={() => setLocationMode('home')}
                      className={`flex-1 h-9 rounded-lg text-[13px] transition-colors ${
                        locationMode === 'home'
                          ? 'bg-[#e10908] text-white'
                          : 'bg-[#1a1d22] text-white hover:bg-[#2a2d32]'
                      }`}
                    >
                      Set Home Location
                    </button>
                    <button
                      type="button"
                      data-part="toggle-city"
                      onClick={() => setLocationMode('city')}
                      className={`flex-1 h-9 rounded-lg text-[13px] transition-colors ${
                        locationMode === 'city'
                          ? 'bg-[#e10908] text-white'
                          : 'bg-[#1a1d22] text-white hover:bg-[#2a2d32]'
                      }`}
                    >
                      Set City/State
                    </button>
                  </div>

                  {/* Hidden location field — always populated with the current
                      city/state label so the form data stays in sync even when
                      the picker isn't visible. */}
                  <input
                    type="text"
                    data-part="input-location"
                    value={form.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                    className="hidden"
                    aria-hidden="true"
                    tabIndex={-1}
                  />

                  {/* Home picker — only mounted when active. Only ONE Leaflet map
                      exists at a time (mounting two maps, one hidden via CSS,
                      causes broken/black tiles because Leaflet measures a
                      display:none container at 0×0). The hidden location input
                      above keeps the form data in sync regardless. */}
                  {locationMode === 'home' && (
                    <div data-part="profile-home">
                      {showHomeEditor ? (
                        <div data-part="profile-home-editor">
                          <LocationForm
                            overlay={false}
                            compact
                            intent="home"
                            homeLocation={homeLocation}
                            initialValue={homeLocation}
                            onCancel={() => setShowHomeEditor(false)}
                            onSubmit={handleSetHomeFromPicker}
                            onZipCode={(zip) => setZipCode(zip || '')}
                          />
                        </div>
                      ) : (
                        <HomeLocationControl
                          homeLocation={homeLocation}
                          onSetHome={() => setShowHomeEditor(true)}
                          onEditHome={() => setShowHomeEditor(true)}
                          onClearHome={handleClearHome}
                        />
                      )}
                    </div>
                  )}

                  {/* City/State picker — only mounted when active (see above). */}
                  {locationMode === 'city' && (
                    <div data-part="profile-city">
                      <LocationPicker
                        compact
                        cityStateOnly
                        onLocationSelect={handleSetCityState}
                        onZipCode={(zip) => setZipCode(zip || '')}
                        onClear={() => {
                          setForm((prev) => ({ ...prev, location: '' }))
                          setLocationData(null)
                          setZipCode('')
                        }}
                        initialValue={locationData ? { address: locationData.address, lat: locationData.lat, lng: locationData.lng } : null}
                      />
                      {form.location && (
                        <p className="mt-2 text-[13px] text-[#888888]">
                          City/State: <span className="text-white">{form.location}</span>
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Social Links */}
                <TextField
                  label="Social Links"
                  value={form.socialLinks}
                  onChange={(e) => handleChange('socialLinks', e.target.value)}
                  inputProps={{ 'data-part': 'input-social' }}
                  placeholder="Instagram, YouTube, TikTok URLs"
                  fullWidth
                  size="small"
                />

                {/* Divider */}
                <div className="w-full h-px bg-[#333333]" />

                {/* About Me section */}
                <div data-part="about-me-section">
                  <h3 className="text-white text-[18px] font-medium mb-1">About Me</h3>
                  <p className="text-[#888888] text-[13px] mb-4">Tell the community about yourself — your car preferences, style, and story.</p>

                  <div className="space-y-5">
                    <TextField
                      label="About Me"
                      value={form.aboutMe}
                      onChange={(e) => handleChange('aboutMe', e.target.value)}
                      inputProps={{ 'data-part': 'input-aboutme' }}
                      multiline
                      rows={3}
                      fullWidth
                      size="small"
                    />
                    <TextField
                      label="Favorite Brand"
                      value={form.favoriteBrand}
                      onChange={(e) => handleChange('favoriteBrand', e.target.value)}
                      inputProps={{ 'data-part': 'input-favbrand' }}
                      placeholder="e.g. Nissan"
                      fullWidth
                      size="small"
                    />
                    <TextField
                      label="Dream Car"
                      value={form.dreamCar}
                      onChange={(e) => handleChange('dreamCar', e.target.value)}
                      inputProps={{ 'data-part': 'input-dreamcar' }}
                      placeholder="e.g. Nissan GT-R R34"
                      fullWidth
                      size="small"
                    />
                    <TextField
                      label="Occupation"
                      value={form.occupation}
                      onChange={(e) => handleChange('occupation', e.target.value)}
                      inputProps={{ 'data-part': 'input-occupation' }}
                      placeholder="e.g. Automotive Photographer"
                      fullWidth
                      size="small"
                    />
                    <TextField
                      label="Drive Style"
                      value={form.driveStyle}
                      onChange={(e) => handleChange('driveStyle', e.target.value)}
                      inputProps={{ 'data-part': 'input-drive' }}
                      placeholder="e.g. Performance & Style"
                      fullWidth
                      size="small"
                    />
                  </div>
                </div>
              </div>

              {/* Footer buttons */}
              <div className="flex items-center justify-end gap-3 px-6 py-4 shrink-0 border-t border-[#1a1d22]">
                <button
                  data-part="cancel-btn"
                  onClick={onClose}
                  className="px-5 py-2.5 bg-transparent border border-[#333333] text-[#888888] rounded-lg text-[15px] hover:text-white hover:border-[#555555] transition-colors"
                >
                  Cancel
                </button>
                <button
                  data-part="save-btn"
                  onClick={handleSave}
                  disabled={saving || handleBlocking}
                  className="px-6 py-2.5 bg-[#e10908] text-white rounded-lg text-[15px] font-medium hover:bg-[#c00807] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
