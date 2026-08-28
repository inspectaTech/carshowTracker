import LocationForm from '#/components/ui/location-picker/LocationForm'

/**
 * NearLocationModal — thin overlay wrapper around the placement-agnostic
 * LocationForm composite. Keeps the existing props so the Explore/Settings
 * hosts don't change; the picker + intent action bar live in LocationForm.
 */
export default function NearLocationModal({
  isOpen,
  onClose,
  initialValue,
  homeLocation,
  intent = 'near',
  onApply,
  onSetHome,
  onClearHome,
}) {
  if (!isOpen) return null

  return (
    <LocationForm
      overlay
      initialValue={initialValue}
      homeLocation={homeLocation}
      intent={intent}
      headerTitle="Near a location"
      onSubmit={onApply}
      onSetHome={onSetHome}
      onClearHome={onClearHome}
      onClose={onClose}
    />
  )
}
