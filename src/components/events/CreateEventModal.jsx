import { useState, useCallback, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ImagePlus, DollarSign } from 'lucide-react'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import FlatpickrInput from '#/components/ui/FlatpickrInput'
import LexicalEditor from '#/components/ui/lexical-editor'
import LocationPicker from '#/components/ui/location-picker'
import LinksSection from '#/components/links/LinksSection'
import { createEvent, updateEvent } from '#/server/events'

const CATEGORIES = ['Meetup', 'JDM', 'Classic', 'Euro', 'Import']

const DEFAULT_VALUES = {
  title: '',
  date: null,
  startTime: null,
  endTime: null,
  location: '',
  lat: null,
  lng: null,
  zipCode: '',
  description: '',
  costType: 'free',
  price: '',
  category: '',
  links: [],
}

const SKIP_CLOSE_KEY = 'cst_skip_close_confirm'

function getSkipCloseConfirm() {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(SKIP_CLOSE_KEY) === 'true'
}

export default function CreateEventModal({ isOpen, onClose, onCreated, onUpdated, editingEvent }) {
  const { control, handleSubmit, formState: { isDirty, errors }, reset, setValue, watch } = useForm({
    defaultValues: DEFAULT_VALUES,
  })
  const [photo, setPhoto] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [showConfirmClose, setShowConfirmClose] = useState(false)
  const [skipConfirm, setSkipConfirm] = useState(getSkipCloseConfirm)

  const costType = watch('costType')
  const isEdit = !!editingEvent

  // Reset form when modal opens — prefill when editing an event
  useEffect(() => {
    if (isOpen) {
      if (editingEvent) {
        reset({
          title: editingEvent.title || '',
          date: editingEvent.date || null,
          startTime: editingEvent.startTime || null,
          endTime: editingEvent.endTime || null,
          location: editingEvent.location || '',
          lat: editingEvent.lat ?? null,
          lng: editingEvent.lng ?? null,
          zipCode: editingEvent.zipCode || '',
          description: editingEvent.description || '',
          costType: editingEvent.costType || 'free',
          price: editingEvent.price ?? '',
          category: editingEvent.category || '',
          links: Array.isArray(editingEvent.links) ? editingEvent.links : [],
        })
        setPhoto(null)
      } else {
        reset(DEFAULT_VALUES)
        setPhoto(null)
      }
      setShowConfirmClose(false)
      setError('')
    }
  }, [isOpen, editingEvent, reset])

  // Intercept close — confirm if dirty and not skipped
  const handleRequestClose = useCallback(() => {
    if (isDirty && !skipConfirm) {
      setShowConfirmClose(true)
    } else {
      onClose()
    }
  }, [isDirty, skipConfirm, onClose])

  const confirmDiscard = useCallback(() => {
    if (skipConfirm) localStorage.setItem(SKIP_CLOSE_KEY, 'true')
    setShowConfirmClose(false)
    onClose()
  }, [skipConfirm, onClose])

  const onSubmit = useCallback(async (data) => {
    setSaving(true)
    setError('')
    try {
      if (isEdit && editingEvent?.slugId) {
        const result = await updateEvent({
          data: { ...data, slugId: editingEvent.slugId, photoUrl: photo ? photo.name : editingEvent.photoUrl },
        })
        if (!result?.success) {
          setError(result?.error || 'Could not update event')
          return
        }
        if (onUpdated) onUpdated(result.event)
      } else {
        const result = await createEvent({ data: { ...data, photoUrl: photo ? photo.name : null } })
        if (!result?.success) {
          setError(result?.error || 'Could not create event')
          return
        }
        if (onCreated) onCreated(result.event)
      }
      reset(DEFAULT_VALUES)
      setPhoto(null)
      onClose()
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }, [isEdit, editingEvent, onClose, photo, reset, onCreated, onUpdated])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="create-event-modal"
          data-component="create-event-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop — no click-to-close, prevents accidental data loss */}
          <div className="absolute inset-0 bg-black/50" />

          <motion.div
            data-part="modal-card"
            className="relative bg-[#0a0d12] rounded-2xl w-full max-w-[700px] max-h-[90vh] flex flex-col overflow-hidden shadow-2xl"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header */}
            <div data-part="modal-header" className="flex items-center justify-between px-5 py-4 shrink-0">
              <h2 className="text-white text-[22px] font-normal">{isEdit ? 'Edit Event' : 'Create Event'}</h2>
              <button data-part="close-btn" onClick={handleRequestClose} className="text-[#888888] hover:text-white transition-colors">
                <X size={22} />
              </button>
            </div>

            <div className="h-px bg-[#333333] shrink-0" />

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                {/* Photo area */}
                <div
                  data-part="photo-area"
                  className="flex flex-col items-center justify-center h-[140px] bg-[#04080b] rounded-lg border border-dashed border-[#333333] cursor-pointer hover:border-[#e10908]/50 transition-colors"
                  onClick={() => document.getElementById('event-photo-input')?.click()}
                >
                  <ImagePlus className="h-8 w-8 text-[#555555] mb-2" />
                  <span className="text-[#555555] text-[14px]">Add event photo (optional)</span>
                  <input id="event-photo-input" type="file" accept="image/*" className="hidden"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) setPhoto(f) }} />
                </div>

                {/* Event Title */}
                <Controller
                  name="title"
                  control={control}
                  rules={{ required: 'Event title is required' }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      label="Event Title"
                      placeholder="Enter event name..."
                      fullWidth
                      size="small"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />

                {/* Row: Date | Start Time | End Time */}
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Controller
                      name="date"
                      control={control}
                      render={({ field }) => (
                        <FlatpickrInput
                          label="Date"
                          value={field.value}
                          onChange={field.onChange}
                          dateFormat="D, M d, Y"
                        />
                      )}
                    />
                  </div>
                  <div className="flex-1">
                    <Controller
                      name="startTime"
                      control={control}
                      render={({ field }) => (
                        <FlatpickrInput
                          label="Start Time"
                          value={field.value}
                          onChange={field.onChange}
                          enableTime
                          noCalendar
                          dateFormat="h:i K"
                          placeholder="6:00 PM"
                        />
                      )}
                    />
                  </div>
                  <div className="flex-1">
                    <Controller
                      name="endTime"
                      control={control}
                      render={({ field }) => (
                        <FlatpickrInput
                          label="End Time"
                          value={field.value}
                          onChange={field.onChange}
                          enableTime
                          noCalendar
                          dateFormat="h:i K"
                          placeholder="10:00 PM"
                        />
                      )}
                    />
                  </div>
                </div>

                {/* Location Picker */}
                <div data-part="field" className="space-y-1.5">
                  <label className="text-white text-[14px]">Location</label>
                  <LocationPicker
                    initialValue={
                      editingEvent?.location
                        ? {
                            address: editingEvent.location,
                            lat: editingEvent.lat,
                            lng: editingEvent.lng,
                          }
                        : null
                    }
                    onLocationSelect={(loc) => {
                      setValue('location', loc.address, { shouldDirty: true })
                      setValue('lat', loc.lat, { shouldDirty: true })
                      setValue('lng', loc.lng, { shouldDirty: true })
                    }}
                    onZipCode={(zip) => setValue('zipCode', zip, { shouldDirty: true })}
                    onClear={() => {
                      setValue('location', '', { shouldDirty: false })
                      setValue('lat', null, { shouldDirty: false })
                      setValue('lng', null, { shouldDirty: false })
                      setValue('zipCode', '', { shouldDirty: false })
                    }}
                  />

                  {/* Zip Code — auto-filled from address, editable */}
                  <Controller
                    name="zipCode"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Zip Code"
                        placeholder="Auto-filled from address"
                        size="small"
                        sx={{ width: 200 }}
                      />
                    )}
                  />
                </div>

                {/* Links — shareable links (social + web) */}
                <div data-part="field" className="space-y-1.5">
                  <label className="text-white text-[14px]">Links</label>
                  <LinksSection
                    mode="edit"
                    value={watch('links') || []}
                    onChange={(links) => setValue('links', links, { shouldDirty: true })}
                  />
                </div>

                {/* Cost: Free / Paid toggle */}
                <div data-part="field" className="space-y-1.5">
                  <label className="text-white text-[14px]">Cost</label>
                  <div data-part="cost-row" className="flex items-center gap-3">
                    <button
                      type="button"
                      data-part="toggle-free"
                      onClick={() => setValue('costType', 'free', { shouldDirty: true })}
                      className={`h-12 px-4 rounded-lg text-[16px] font-normal transition-colors ${
                        costType === 'free'
                          ? 'bg-[#e10908] text-white'
                          : 'bg-[#1a1d22] text-white hover:bg-[#2a2d32]'
                      }`}
                    >Free</button>
                    <button
                      type="button"
                      data-part="toggle-paid"
                      onClick={() => setValue('costType', 'paid', { shouldDirty: true })}
                      className={`h-12 px-4 rounded-lg text-[16px] font-normal transition-colors ${
                        costType === 'paid'
                          ? 'bg-[#e10908] text-white'
                          : 'bg-[#1a1d22] text-white hover:bg-[#2a2d32]'
                      }`}
                    >Paid</button>
                    {costType === 'paid' && (
                      <Controller
                        name="price"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Price"
                            placeholder="0.00"
                            size="small"
                            sx={{ width: 140 }}
                            InputProps={{
                              startAdornment: <InputAdornment position="start"><DollarSign className="h-4 w-4 text-[#555555]" /></InputAdornment>,
                            }}
                          />
                        )}
                      />
                    )}
                  </div>
                </div>

                {/* Description — Lexical Rich Text */}
                <div data-part="field" className="space-y-1.5">
                  <label className="text-white text-[14px]">Description</label>
                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <LexicalEditor
                        initialHtml={field.value}
                        onChange={(html) => field.onChange(html)}
                      />
                    )}
                  />
                </div>

                {/* Category Tags */}
                <div data-part="field" className="space-y-1.5">
                  <label className="text-white text-[14px]">Category</label>
                  <div data-part="tag-row" className="flex items-center gap-2.5 flex-wrap">
                    {CATEGORIES.map((cat) => (
                      <button
                        type="button"
                        key={cat}
                        data-part={`tag-${cat.toLowerCase()}`}
                        onClick={() => setValue('category', cat, { shouldDirty: true })}
                        className={`h-9 px-3.5 rounded-md text-[14px] font-normal transition-colors ${
                          watch('category') === cat
                            ? 'bg-[#e10908] text-white'
                            : 'bg-[#1a1d22] text-white hover:bg-[#2a2d32]'
                        }`}
                      >{cat}</button>
                    ))}
                  </div>
                </div>

                <div className="h-4" />
              </div>

              {/* Submit error */}
              {error && (
                <div data-part="submit-error" className="px-6 pb-2">
                  <p className="px-4 py-2.5 bg-red-900/20 border border-red-900/30 text-[#e10908] text-[14px] rounded-lg">
                    {error}
                  </p>
                </div>
              )}

              {/* Button Row */}
              <div className="shrink-0 px-6 py-4 border-t border-[#333333]">
                <div data-part="button-row" className="flex items-center justify-end gap-3">
                  <button
                    type="button"
                    data-part="cancel-btn"
                    onClick={handleRequestClose}
                    className="h-11 px-5 rounded-lg text-white text-[16px] border border-[#333333] hover:bg-[#1a1d22] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    data-part="create-btn"
                    disabled={!!errors.title || saving}
                    className="h-11 px-5 rounded-lg bg-[#e10908] hover:bg-[#c00807] disabled:bg-[#551111] disabled:text-[#888888] text-white text-[16px] transition-colors flex items-center gap-2"
                  >
                    {saving ? (isEdit ? 'Saving...' : 'Creating...') : (isEdit ? 'Save Changes' : 'Create Event')}
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* Confirm Close Modal */}
      <AnimatePresence>
        {showConfirmClose && (
          <motion.div
            key="confirm-close-modal"
            data-component="confirm-close-modal"
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <div className="absolute inset-0 bg-black/60" onClick={() => setShowConfirmClose(false)} />
            <motion.div
              data-part="confirm-card"
              className="relative bg-[#0a0d12] rounded-xl w-full max-w-[380px] p-6 shadow-2xl border border-[#333333]"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
            >
              <h3 className="text-white text-[18px] font-medium mb-2">Unsaved Changes</h3>
              <p className="text-[#888888] text-[14px] mb-5 leading-relaxed">
                You have unsaved changes. Are you sure you want to close? Any information you've entered will be lost.
              </p>

              <label className="flex items-center gap-2 mb-5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={skipConfirm}
                  onChange={(e) => setSkipConfirm(e.target.checked)}
                  className="w-4 h-4 rounded border-[#333333] bg-[#1a1d22] accent-[#e10908]"
                />
                <span className="text-[#888888] text-[13px]">Don't ask again</span>
              </label>

              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setShowConfirmClose(false)}
                  className="h-10 px-4 rounded-lg text-white text-[14px] border border-[#333333] hover:bg-[#1a1d22] transition-colors"
                >
                  Keep Editing
                </button>
                <button
                  onClick={confirmDiscard}
                  className="h-10 px-4 rounded-lg bg-[#e10908] hover:bg-[#c00807] text-white text-[14px] transition-colors"
                >
                  Discard Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatePresence>
  )
}
