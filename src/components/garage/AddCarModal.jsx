import { useState } from 'react'
import { X, ImagePlus } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const INITIAL_STATE = {
  make: '',
  model: '',
  year: '',
  hp: '',
  drivetrain: '',
  color: '',
  mods: '',
}

const MAKES = ['Nissan', 'Toyota', 'Honda', 'Mazda', 'Ford', 'Porsche', 'Chevrolet', 'BMW', 'Mercedes', 'Subaru', 'Mitsubishi', 'Other']
const YEARS = Array.from({ length: 40 }, (_, i) => String(2026 - i))
const DRIVETRAINS = ['AWD', 'RWD', 'FWD', '4WD']

export default function AddCarModal({ isOpen, onClose, onSave, editCar }) {
  const isEditing = !!editCar
  const [form, setForm] = useState(INITIAL_STATE)
  const [saving, setSaving] = useState(false)

  // Reset form when opening
  useState(() => {
    if (isOpen) {
      if (editCar) {
        setForm({
          make: editCar.make || '',
          model: editCar.model || '',
          year: String(editCar.year || ''),
          hp: String(editCar.hp || ''),
          drivetrain: editCar.drivetrain || '',
          color: editCar.color || '',
          mods: '',
        })
      } else {
        setForm(INITIAL_STATE)
      }
    }
  }, [isOpen, editCar])

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    if (!form.make || !form.model) return
    setSaving(true)
    await new Promise((r) => setTimeout(r, 800))
    if (onSave) {
      onSave({
        ...form,
        year: parseInt(form.year) || 2000,
        hp: parseInt(form.hp) || 0,
      })
    }
    setSaving(false)
    onClose()
  }

  const Select = ({ label, value, options, placeholder, onChange }) => (
    <div className="space-y-1.5">
      <label className="text-white text-[14px]">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 bg-[#04080b] border border-[#333333] rounded-lg text-white focus:outline-none focus:border-[#e10908] transition-colors appearance-none cursor-pointer"
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  )

  const Input = ({ label, value, placeholder, onChange }) => (
    <div className="space-y-1.5">
      <label className="text-white text-[14px]">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 bg-[#04080b] border border-[#333333] rounded-lg text-white placeholder-[#555555] focus:outline-none focus:border-[#e10908] transition-colors"
      />
    </div>
  )

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            data-part="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            data-component="AddCarModal"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-[#0a0d12] rounded-2xl w-full max-w-[600px] max-h-[90vh] flex flex-col pointer-events-auto shadow-2xl border border-[#1a1d22] overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 shrink-0 border-b border-[#1a1d22]">
                <h2 className="text-white text-[20px] sm:text-[22px] font-medium">
                  {isEditing ? 'Edit Vehicle' : 'Add Vehicle'}
                </h2>
                <button data-part="close-btn" onClick={onClose} className="text-[#888888] hover:text-white transition-colors">
                  <X size={22} />
                </button>
              </div>

              {/* Form */}
              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                {/* Photo area */}
                <div
                  data-part="photo-area"
                  className="w-full h-[130px] bg-[#04080b] border-2 border-dashed border-[#333333] rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#555555] transition-colors"
                >
                  <ImagePlus size={32} className="text-[#555555]" />
                  <p className="text-[#555555] text-[14px]">Tap to upload car photo</p>
                  <p className="text-[#444444] text-[12px]">PNG, JPG up to 10MB</p>
                </div>

                {/* Row 1: Make + Model */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select label="Make" value={form.make} options={MAKES} placeholder="Select make ▾" onChange={(v) => handleChange('make', v)} />
                  <Input label="Model" value={form.model} placeholder="Enter model" onChange={(v) => handleChange('model', v)} />
                </div>

                {/* Row 2: Year + HP */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select label="Year" value={form.year} options={YEARS} placeholder="Select year ▾" onChange={(v) => handleChange('year', v)} />
                  <Input label="Horsepower" value={form.hp} placeholder="Enter HP" onChange={(v) => handleChange('hp', v)} />
                </div>

                {/* Row 3: Drivetrain + Color */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select label="Drivetrain" value={form.drivetrain} options={DRIVETRAINS} placeholder="Select drivetrain ▾" onChange={(v) => handleChange('drivetrain', v)} />
                  <Input label="Color" value={form.color} placeholder="Enter color" onChange={(v) => handleChange('color', v)} />
                </div>

                {/* Mods */}
                <div className="space-y-1.5">
                  <label className="text-white text-[14px]">Modifications / Notes</label>
                  <textarea
                    value={form.mods}
                    onChange={(e) => handleChange('mods', e.target.value)}
                    placeholder="List any modifications..."
                    rows={3}
                    className="w-full px-4 py-3 bg-[#04080b] border border-[#333333] rounded-lg text-white placeholder-[#555555] focus:outline-none focus:border-[#e10908] transition-colors resize-none"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 px-6 py-4 shrink-0 border-t border-[#1a1d22]">
                <button data-part="cancel-btn" onClick={onClose}
                  className="px-5 py-2.5 bg-transparent border border-[#333333] text-[#888888] rounded-lg text-[15px] hover:text-white hover:border-[#555555] transition-colors">
                  Cancel
                </button>
                <button data-part="save-btn" onClick={handleSubmit} disabled={saving || !form.make || !form.model}
                  className="px-6 py-2.5 bg-[#e10908] text-white rounded-lg text-[15px] font-medium hover:bg-[#c00807] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  {saving ? 'Saving...' : isEditing ? 'Save Changes' : 'Add Vehicle'}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
