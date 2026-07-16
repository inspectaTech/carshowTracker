import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ImagePlus, DollarSign } from 'lucide-react'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import FlatpickrInput from '#/components/ui/FlatpickrInput'
import LexicalEditor from './LexicalEditor'

const CATEGORIES = ['Meetup', 'JDM', 'Classic', 'Euro', 'Import']

export default function CreateEventModal({ isOpen, onClose }) {
  const [form, setForm] = useState({
    title: '',
    date: null,
    startTime: null,
    endTime: null,
    location: '',
    zipCode: '',
    description: '',
    costType: 'free',
    price: '',
    category: '',
    photo: null,
  })
  const [saving, setSaving] = useState(false)

  const handleChange = useCallback((field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }, [])

  const handleDateChange = useCallback((date) => {
    setForm((prev) => ({ ...prev, date }))
  }, [])

  const handleStartTimeChange = useCallback((date) => {
    setForm((prev) => ({ ...prev, startTime: date }))
  }, [])

  const handleEndTimeChange = useCallback((date) => {
    setForm((prev) => ({ ...prev, endTime: date }))
  }, [])

  const handleDescriptionChange = useCallback((html) => {
    setForm((prev) => ({ ...prev, description: html }))
  }, [])

  const handleSubmit = async () => {
    if (!form.title) return
    setSaving(true)
    await new Promise((r) => setTimeout(r, 800))
    setSaving(false)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          data-component="create-event-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="absolute inset-0 bg-black/50" onClick={onClose} />

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
              <h2 className="text-white text-[22px] font-normal">Create Event</h2>
              <button data-part="close-btn" onClick={onClose} className="text-[#888888] hover:text-white transition-colors">
                <X size={22} />
              </button>
            </div>

            <div className="h-px bg-[#333333] shrink-0" />

            {/* Form */}
            <div data-part="form-area" className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Photo area */}
              <div
                data-part="photo-area"
                className="flex flex-col items-center justify-center h-[140px] bg-[#04080b] rounded-lg border border-dashed border-[#333333] cursor-pointer hover:border-[#e10908]/50 transition-colors"
                onClick={() => document.getElementById('event-photo-input')?.click()}
              >
                <ImagePlus className="h-8 w-8 text-[#555555] mb-2" />
                <span className="text-[#555555] text-[14px]">Add event photo (optional)</span>
                <input id="event-photo-input" type="file" accept="image/*" className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleChange('photo', f) }} />
              </div>

              {/* Event Title */}
              <TextField
                label="Event Title"
                placeholder="Enter event name..."
                value={form.title}
                onChange={(e) => handleChange('title', e.target.value)}
                fullWidth
                size="small"
                required
              />

              {/* Row: Date | Start Time | End Time */}
              <div data-part="form-row" className="flex gap-4">
                <div className="w-[240px]">
                  <FlatpickrInput
                    label="Date"
                    value={form.date}
                    onChange={handleDateChange}
                    dateFormat="D, M d, Y"
                    placeholder="Sat, Jul 25, 2026"
                  />
                </div>
                <div className="w-[190px]">
                  <FlatpickrInput
                    label="Start Time"
                    value={form.startTime}
                    onChange={handleStartTimeChange}
                    enableTime
                    noCalendar
                    dateFormat="h:i K"
                    placeholder="7:00 PM"
                  />
                </div>
                <div className="w-[190px]">
                  <FlatpickrInput
                    label="End Time"
                    value={form.endTime}
                    onChange={handleEndTimeChange}
                    enableTime
                    noCalendar
                    dateFormat="h:i K"
                    placeholder="10:00 PM"
                  />
                </div>
              </div>

              {/* Location */}
              <TextField
                label="Location"
                placeholder="Los Angeles Convention Center, CA"
                value={form.location}
                onChange={(e) => handleChange('location', e.target.value)}
                fullWidth
                size="small"
              />

              {/* Zip Code */}
              <div className="w-[200px]">
                <TextField
                  label="Zip Code"
                  placeholder="90001"
                  value={form.zipCode}
                  onChange={(e) => handleChange('zipCode', e.target.value)}
                  fullWidth
                  size="small"
                />
              </div>

              {/* Cost: Free / Paid toggle */}
              <div data-part="field" className="space-y-1.5">
                <label className="text-white text-[14px]">Cost</label>
                <div data-part="cost-row" className="flex items-center gap-3">
                  <button
                    data-part="toggle-free"
                    onClick={() => handleChange('costType', 'free')}
                    className={`h-12 px-4 rounded-lg text-[16px] font-normal transition-colors ${
                      form.costType === 'free'
                        ? 'bg-[#e10908] text-white'
                        : 'bg-[#1a1d22] text-white hover:bg-[#2a2d32]'
                    }`}
                  >Free</button>
                  <button
                    data-part="toggle-paid"
                    onClick={() => handleChange('costType', 'paid')}
                    className={`h-12 px-4 rounded-lg text-[16px] font-normal transition-colors ${
                      form.costType === 'paid'
                        ? 'bg-[#e10908] text-white'
                        : 'bg-[#1a1d22] text-white hover:bg-[#2a2d32]'
                    }`}
                  >Paid</button>
                  {form.costType === 'paid' && (
                    <TextField
                      label="Price"
                      placeholder="0.00"
                      value={form.price}
                      onChange={(e) => handleChange('price', e.target.value)}
                      size="small"
                      sx={{ width: 140 }}
                      InputProps={{
                        startAdornment: <InputAdornment position="start"><DollarSign className="h-4 w-4 text-[#555555]" /></InputAdornment>,
                      }}
                    />
                  )}
                </div>
              </div>

              {/* Description — Lexical Rich Text */}
              <div data-part="field" className="space-y-1.5">
                <label className="text-white text-[14px]">Description</label>
                <LexicalEditor
                  initialHtml={form.description}
                  onChange={handleDescriptionChange}
                />
              </div>

              {/* Category Tags */}
              <div data-part="field" className="space-y-1.5">
                <label className="text-white text-[14px]">Category</label>
                <div data-part="tag-row" className="flex items-center gap-2.5 flex-wrap">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      data-part={`tag-${cat.toLowerCase()}`}
                      onClick={() => handleChange('category', cat)}
                      className={`h-9 px-3.5 rounded-md text-[14px] font-normal transition-colors ${
                        form.category === cat
                          ? 'bg-[#e10908] text-white'
                          : 'bg-[#1a1d22] text-white hover:bg-[#2a2d32]'
                      }`}
                    >{cat}</button>
                  ))}
                </div>
              </div>

              <div className="h-4" />
            </div>

            {/* Button Row */}
            <div className="shrink-0 px-6 py-4 border-t border-[#333333]">
              <div data-part="button-row" className="flex items-center justify-end gap-3">
                <button data-part="cancel-btn" onClick={onClose}
                  className="h-11 px-5 rounded-lg text-white text-[16px] border border-[#333333] hover:bg-[#1a1d22] transition-colors"
                >
                  Cancel
                </button>
                <button
                  data-part="create-btn"
                  onClick={handleSubmit}
                  disabled={!form.title || saving}
                  className="h-11 px-5 rounded-lg bg-[#e10908] hover:bg-[#c00807] disabled:bg-[#551111] disabled:text-[#888888] text-white text-[16px] transition-colors flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      Creating...
                    </>
                  ) : (
                    'Create Event'
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
