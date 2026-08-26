import { Home as HomeIcon, Pencil, X } from 'lucide-react'

/**
 * Reusable "Home Location" control — the bottom section of the vicinity menu,
 * extracted so it can also live on the Settings page.
 *
 * Shows one of two states:
 *  - No home set: a "Set home location" button (opens the picker via onSetHome).
 *  - Home set: the home address with an Edit (pencil) and Remove (X) button.
 *
 * Props:
 *  - homeLocation: { address, lat, lng } | null
 *  - onSetHome: () => void — open the home-location picker
 *  - onEditHome: () => void — open the picker pre-filled with home
 *  - onClearHome: () => void — remove the home
 */
export default function HomeLocationControl({ homeLocation, onSetHome, onEditHome, onClearHome }) {
  const hasHome = homeLocation && typeof homeLocation.lat === 'number'

  return (
    <div data-component="home-location-control" className="flex items-center gap-2">
      <HomeIcon className="h-4 w-4 text-[#e10908] shrink-0" />
      {hasHome ? (
        <>
          <p className="flex-1 text-[13px] text-[#888888] truncate" title={homeLocation.address}>
            {homeLocation.address || 'Home'}
          </p>
          <button
            type="button"
            onClick={onEditHome}
            title="Edit home location"
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
        <button
          type="button"
          onClick={onSetHome}
          className="flex-1 flex items-center justify-center gap-2 h-9 rounded-lg text-[13px] bg-[#1a1d22] text-white hover:bg-[#2a2d32] transition-colors"
        >
          <HomeIcon size={14} /> Set home location
        </button>
      )}
    </div>
  )
}
