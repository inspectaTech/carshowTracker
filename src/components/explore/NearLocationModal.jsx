import { useState, useEffect } from 'react'
import LocationPicker from '#/components/ui/location-picker/LocationPicker'
import { Home as HomeIcon, MapPin, Pencil, X } from 'lucide-react'

/**
 * Full-screen modal for "Near a location…". Embeds the real LocationPicker
 * (Nominatim search + long-press map pin) so the address dropdown is never
 * clipped by other UI, and doubles as the place to set / edit / clear Home.
 */
export default function NearLocationModal({
  isOpen,
  onClose,
  initialValue,
  homeLocation,
  onApply,
  onSetHome,
  onClearHome,
}) {
  const [selected, setSelected] = useState(null)
  const [pickerInitial, setPickerInitial] = useState(null)
  const [pickerReload, setPickerReload] = useState(0)

  // Seed the selection + picker from the starting point (current pick, or Home
  // when editing it) each time the modal opens.
  useEffect(() => {
    if (isOpen) {
      const seed =
        initialValue && typeof initialValue.lat === 'number'
          ? { address: initialValue.address || '', lat: initialValue.lat, lng: initialValue.lng }
          : null
      setPickerInitial(seed)
      setSelected(seed)
    }
  }, [isOpen, initialValue])

  // "Edit" button: load the saved Home onto the map (marker + address). This is
  // just a map updater — the user must press "Set as Home" again to save a change.
  // Bumping pickerReload forces LocationPicker to re-apply the prefill on the map
  // (otherwise its guard would skip a value it already saw).
  const handleEditHome = () => {
    if (!homeLocation || typeof homeLocation.lat !== 'number') return
    const h = { address: homeLocation.address || '', lat: homeLocation.lat, lng: homeLocation.lng }
    setPickerInitial(h)
    setSelected(h)
    setPickerReload((n) => n + 1)
  }

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const hasSelection = selected && typeof selected.lat === 'number'

  return (
    <div
      data-component="near-location-modal"
      className="fixed inset-0 z-[3000] flex items-center justify-center p-3 sm:p-6 bg-black/70"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[92vh] flex flex-col bg-[#0a0d12] border border-[#333333] rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1a1d22] shrink-0">
          <div className="flex items-center gap-2 text-white">
            <MapPin className="h-5 w-5 text-[#e10908]" />
            <h2 className="text-[16px] font-medium">Near a location</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            title="Close"
            className="w-8 h-8 flex items-center justify-center text-[#888888] hover:text-white hover:bg-[#1a1d22] rounded-md transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body — LocationPicker (search + map) */}
        <div className="flex-1 overflow-y-auto p-5">
          <LocationPicker
            onLocationSelect={(loc) => setSelected(loc)}
            onClear={() => setSelected(null)}
            initialValue={pickerInitial}
            reloadToken={pickerReload}
          />

          {/* Home indicator — same as the dropdown's Home row: shows the saved
              Home, an Edit (loads it onto the map) and a Clear (unset) button. */}
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
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-[#1a1d22] flex items-center justify-end gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 h-9 rounded-lg text-[13px] text-[#888888] hover:text-white hover:bg-[#1a1d22] transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => hasSelection && onSetHome(selected)}
            disabled={!hasSelection}
            className="flex items-center gap-2 px-4 h-9 rounded-lg text-[13px] bg-[#1a1d22] text-white hover:bg-[#2a2d32] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <HomeIcon size={14} /> Set as Home
          </button>
          <button
            type="button"
            onClick={() => hasSelection && onApply(selected)}
            disabled={!hasSelection}
            className="flex items-center gap-2 px-4 h-9 rounded-lg text-[13px] bg-[#e10908] text-white hover:bg-[#c90808] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Use this location
          </button>
        </div>
      </div>
    </div>
  )
}
