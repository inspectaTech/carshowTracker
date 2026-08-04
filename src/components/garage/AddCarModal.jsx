import { X, ImagePlus } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm, Controller } from 'react-hook-form'
import React from 'react'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import LexicalEditor from '#/components/ui/lexical-editor'

const defaultValues = {
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
  const { control, handleSubmit, reset, formState: { isDirty } } = useForm({ defaultValues })
  const [confirmClose, setConfirmClose] = React.useState(false)

  // Reset form when opening
  const prevOpen = React.useRef(isOpen)
  React.useEffect(() => {
    if (isOpen && !prevOpen.current) {
      if (editCar) {
        reset({
          make: editCar.make || '',
          model: editCar.model || '',
          year: String(editCar.year || ''),
          hp: String(editCar.hp || ''),
          drivetrain: editCar.drivetrain || '',
          color: editCar.color || '',
          mods: '',
        })
      } else {
        reset()
      }
      setConfirmClose(false)
    }
    prevOpen.current = isOpen
  }, [isOpen, editCar, reset])

  const handleClose = () => {
    if (isDirty) {
      setConfirmClose(true)
    } else {
      onClose()
    }
  }

  const onSubmit = async (data) => {
    await new Promise((r) => setTimeout(r, 800))
    if (onSave) {
      onSave({
        ...data,
        year: parseInt(data.year) || 2000,
        hp: parseInt(data.hp) || 0,
      })
    }
    onClose()
  }

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
            onClick={handleClose}
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
                <button data-part="close-btn" onClick={handleClose} className="text-[#888888] hover:text-white transition-colors">
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
                  <Controller
                    name="make"
                    control={control}
                    rules={{ required: 'Make is required' }}
                    render={({ field }) => (
                      <TextField {...field} label="Make" select fullWidth size="small">
                        <MenuItem value="" disabled>Select make</MenuItem>
                        {MAKES.map((opt) => (
                          <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                  <Controller
                    name="model"
                    control={control}
                    rules={{ required: 'Model is required' }}
                    render={({ field }) => (
                      <TextField {...field} label="Model" placeholder="Enter model" fullWidth size="small" />
                    )}
                  />
                </div>

                {/* Row 2: Year + HP */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Controller
                    name="year"
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} label="Year" select fullWidth size="small">
                        <MenuItem value="" disabled>Select year</MenuItem>
                        {YEARS.map((opt) => (
                          <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                  <Controller
                    name="hp"
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} label="Horsepower" placeholder="Enter HP" fullWidth size="small" />
                    )}
                  />
                </div>

                {/* Row 3: Drivetrain + Color */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Controller
                    name="drivetrain"
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} label="Drivetrain" select fullWidth size="small">
                        <MenuItem value="" disabled>Select drivetrain</MenuItem>
                        {DRIVETRAINS.map((opt) => (
                          <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                  <Controller
                    name="color"
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} label="Color" placeholder="Enter color" fullWidth size="small" />
                    )}
                  />
                </div>

                {/* Modifications — Lexical Rich Text */}
                <div data-part="field" className="space-y-1.5">
                  <label className="text-white text-[14px]">Modifications / Notes</label>
                  <Controller
                    name="mods"
                    control={control}
                    render={({ field }) => (
                      <LexicalEditor
                        initialHtml={field.value}
                        onChange={(html) => field.onChange(html)}
                      />
                    )}
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 px-6 py-4 shrink-0 border-t border-[#1a1d22]">
                <button data-part="cancel-btn" onClick={handleClose}
                  className="px-5 py-2.5 bg-transparent border border-[#333333] text-[#888888] rounded-lg text-[15px] hover:text-white hover:border-[#555555] transition-colors">
                  Cancel
                </button>
                <button data-part="save-btn" onClick={handleSubmit(onSubmit)}
                  className="px-6 py-2.5 bg-[#e10908] text-white rounded-lg text-[15px] font-medium hover:bg-[#c00807] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  {isEditing ? 'Save Changes' : 'Add Vehicle'}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Confirm close modal */}
          <AnimatePresence>
            {confirmClose && (
              <>
                <motion.div
                  key="confirm-close-overlay"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60]"
                  onClick={() => setConfirmClose(false)}
                />
                <motion.div
                  key="confirm-close-modal"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none"
                >
                  <div className="bg-[#0a0d12] rounded-2xl w-full max-w-[380px] p-6 pointer-events-auto shadow-2xl border border-[#1a1d22]">
                    <h3 className="text-white text-[18px] font-medium mb-2">Discard changes?</h3>
                    <p className="text-[#888888] text-[14px] mb-6">You have unsaved changes. Are you sure you want to close?</p>
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => setConfirmClose(false)}
                        className="px-4 py-2 bg-transparent border border-[#333333] text-[#888888] rounded-lg text-[14px] hover:text-white transition-colors"
                      >
                        Keep Editing
                      </button>
                      <button
                        onClick={() => { setConfirmClose(false); onClose() }}
                        className="px-4 py-2 bg-[#e10908] text-white rounded-lg text-[14px] hover:bg-[#c00807] transition-colors"
                      >
                        Discard
                      </button>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  )
}
