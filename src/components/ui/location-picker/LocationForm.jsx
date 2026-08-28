import { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react'
import LocationPicker from './LocationPicker'
import { Home as HomeIcon, MapPin, Pencil, X } from 'lucide-react'

/**
 * LocationForm — a placement-agnostic composite that bundles:
 *  - the LocationPicker (map + search + selected summary, a pure leaf)
 *  - the home indicator (saved Home address + Edit + Clear)
 *  - the intent-driven action bar (Set as Home / Use this location)
 * and manages the selected-location state itself.
 *
 * Modes:
 *  - intent 'home': single red "Set as Home" submit (set/update home only).
 *  - intent 'near': "Set as Home" (secondary) + "Use this location" (red submit)
 *    — explore from a point, optionally saving it as home.
 *  - overlay: render as a full-screen dialog (default). Set overlay=false to
 *    render inline (e.g. inside the Edit Profile form) — only the wrapper
 *    element changes, so the picker + action row behave identically anywhere.
 *
 * Callback contract (hosts never re-implement buttons):
 *  - onSubmit(loc, { homeChanged })  — user pressed the red submit (Use this
 *    location / Set as Home in intent 'home'). Host closes modal + processes.
 *  - onCancel(dirty)                 — user cancelled. Host decides revert.
 *  - onSetHome(loc)                  — user pressed "Set as Home" (intent 'near'
 *    secondary). Host saves home, keeps the form open to continue.
 *  - onClearHome()                   — user cleared the saved home.
 *  - onSubmit ref handle getValue()  — host form can read the current selection.
 *
 * Props:
 *  - initialValue: {address,lat,lng} | null — pre-fill (editing home/near).
 *  - homeLocation: {address,lat,lng} | null — the saved home (for the indicator).
 *  - intent: 'home' | 'near'
 *  - overlay: boolean (default true)
 *  - headerTitle: string (overlay header title)
 *  - onClose: the overlay's close / cancel action (overlay mode).
 */
const LocationForm = forwardRef(function LocationForm(
  {
    initialValue = null,
    homeLocation = null,
    intent = 'near',
    overlay = true,
    compact = false,
    headerTitle = 'Near a location',
    onSubmit,
    onCancel,
    onSetHome,
    onClearHome,
    onZipCode,
    onClose,
  },
  ref
) {
  const [selected, setSelected] = useState(null)
  const [pickerInitial, setPickerInitial] = useState(null)
  const [pickerReload, setPickerReload] = useState(0)
  const startedHome = useRef(!!(homeLocation && typeof homeLocation.lat === 'number'))

  // Seed selection + picker from the starting point each time initialValue changes.
  useEffect(() => {
    const seed =
      initialValue && typeof initialValue.lat === 'number'
        ? { address: initialValue.address || '', lat: initialValue.lat, lng: initialValue.lng }
        : null
    setPickerInitial(seed)
    setSelected(seed)
  }, [initialValue])

  // "Edit home": load the saved Home onto the map (map updater only).
  const handleEditHome = () => {
    if (!homeLocation || typeof homeLocation.lat !== 'number') return
    const h = { address: homeLocation.address || '', lat: homeLocation.lat, lng: homeLocation.lng }
    setPickerInitial(h)
    setSelected(h)
    setPickerReload((n) => n + 1)
  }

  const hasSelection = selected && typeof selected.lat === 'number'
  const homeChanged =
    (startedHome.current && !(homeLocation && typeof homeLocation.lat === 'number')) ||
    (hasSelection &&
      homeLocation &&
      typeof homeLocation.lat === 'number' &&
      (selected.lat !== homeLocation.lat || selected.lng !== homeLocation.lng))

  // Expose a getValue handle so a host form can read the selection for validation.
  useImperativeHandle(ref, () => ({
    getValue: () => (hasSelection ? { address: selected.address, lat: selected.lat, lng: selected.lng } : null),
    hasSelection,
  }), [hasSelection, selected])

  // Escape closes the overlay.
  useEffect(() => {
    if (!overlay) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [overlay, onClose])

  const handleCancel = () => {
    onCancel?.(homeChanged)
    onClose?.()
  }

  const isHomeIntent = intent === 'home'

  // ---- The picker + home indicator + action row (shared by both modes) ----
  const body = (
    <>
      {/* LocationPicker */}
      <LocationPicker
        onLocationSelect={(loc) => setSelected(loc)}
        onClear={() => setSelected(null)}
        onZipCode={onZipCode}
        initialValue={pickerInitial}
        reloadToken={pickerReload}
        compact={compact}
      />

      {/* Home indicator */}
      <div className="mt-4 pt-4 border-t border-[#1a1d22] flex items-center gap-2">
        <HomeIcon className="h-4 w-4 text-[#e10908] shrink-0" />
        {homeLocation && typeof homeLocation.lat === 'number' ? (
          <>
            <p className="flex-1 text-[13px] text-[#888888] truncate" title={homeLocation.address}>
              Home: {homeLocation.address || 'Home'}
            </p>
            <button
              type="button"
              onClick={handleEditHome}
              title="Load home on the map"
              className="w-8 h-8 flex items-center justify-center text-[#888888] hover:text-white hover:bg-[#1a1d22] rounded-md transition-colors shrink-0"
            >
              <Pencil size={14} />
            </button>
            <button
              type="button"
              onClick={onClearHome}
              title="Remove home location"
              className="w-8 h-8 flex items-center justify-center text-[#888888] hover:text-[#e10908] hover:bg-[#1a1d22] rounded-md transition-colors shrink-0"
            >
              <X size={16} />
            </button>
          </>
        ) : (
          <p className="text-[12px] text-[#555555]">
            No home set yet — pick a spot, then press “Set as Home”.
          </p>
        )}
      </div>

      {/* Action bar */}
      <div className="flex items-center justify-end gap-2.5 mt-4">
        <button
          type="button"
          onClick={handleCancel}
          className="px-4 h-9 rounded-lg text-[13px] text-[#888888] hover:text-white hover:bg-[#1a1d22] transition-colors"
        >
          Cancel
        </button>
        {isHomeIntent ? (
          <button
            type="button"
            onClick={() => hasSelection && onSubmit?.(selected, { homeChanged })}
            disabled={!hasSelection}
            className="flex items-center gap-2 px-4 h-9 rounded-lg text-[13px] bg-[#e10908] text-white hover:bg-[#c90808] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <HomeIcon size={14} /> Set as Home
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={() => hasSelection && onSetHome?.(selected)}
              disabled={!hasSelection}
              className="flex items-center gap-2 px-4 h-9 rounded-lg text-[13px] bg-[#1a1d22] text-white hover:bg-[#2a2d32] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <HomeIcon size={14} /> Set as Home
            </button>
            <button
              type="button"
              onClick={() => hasSelection && onSubmit?.(selected, { homeChanged })}
              disabled={!hasSelection}
              className="flex items-center gap-2 px-4 h-9 rounded-lg text-[13px] bg-[#e10908] text-white hover:bg-[#c90808] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Use this location
            </button>
          </>
        )}
      </div>
    </>
  )

  // ---- Overlay mode: full-screen dialog wrapper ----
  if (overlay) {
    return (
      <div
        data-component="LocationForm"
        className="fixed inset-0 z-[3000] flex items-center justify-center p-3 sm:p-6 bg-black/70"
        onClick={handleCancel}
      >
        <div
          className="w-full max-w-2xl max-h-[92vh] flex flex-col bg-[#0a0d12] border border-[#333333] rounded-2xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#1a1d22] shrink-0">
            <div className="flex items-center gap-2 text-white">
              <MapPin className="h-5 w-5 text-[#e10908]" />
              <h2 className="text-[16px] font-medium">{headerTitle}</h2>
            </div>
            <button
              type="button"
              onClick={handleCancel}
              title="Close"
              className="w-8 h-8 flex items-center justify-center text-[#888888] hover:text-white hover:bg-[#1a1d22] rounded-md transition-colors"
            >
              <X size={18} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto overscroll-contain p-5">{body}</div>
        </div>
      </div>
    )
  }

  // ---- Inline mode: plain div wrapper (for forms / settings rows) ----
  return (
    <div data-component="LocationForm" className="w-full">
      {body}
    </div>
  )
})

export default LocationForm