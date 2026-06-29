import { useState } from 'react'
import { X, UploadCloud, Car, Camera, User } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const PHOTO_TYPES = [
  { id: 'car', label: 'Car Photo', icon: Car },
  { id: 'activity', label: 'Activity Photo', icon: Camera },
  { id: 'avatar', label: 'Avatar', icon: User },
]

export default function UploadPhotoModal({ isOpen, onClose, onUpload }) {
  const [selectedType, setSelectedType] = useState('car')
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  const handleFileSelect = (e) => {
    const f = e.target.files?.[0]
    if (f) setFile(f)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const f = e.dataTransfer?.files?.[0]
    if (f) setFile(f)
  }

  const handleUpload = async () => {
    if (!file) return
    setUploading(true)
    await new Promise((r) => setTimeout(r, 1500))
    if (onUpload) {
      onUpload({ file, type: selectedType })
    }
    setUploading(false)
    setFile(null)
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
            onClick={onClose}
          />
          <motion.div
            data-component="UploadPhotoModal"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-[#0a0d12] rounded-2xl w-full max-w-[520px] max-h-[90vh] flex flex-col pointer-events-auto shadow-2xl border border-[#1a1d22] overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 shrink-0 border-b border-[#1a1d22]">
                <h2 className="text-white text-[20px] sm:text-[22px] font-medium">Upload Photo</h2>
                <button data-part="close-btn" onClick={onClose} className="text-[#888888] hover:text-white transition-colors">
                  <X size={22} />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Drop zone */}
                <div
                  data-part="drop-zone"
                  onDrop={handleDrop}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                  onDragLeave={() => setDragOver(false)}
                  onClick={() => document.getElementById('photo-file-input')?.click()}
                  className={`w-full h-[240px] rounded-xl flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${
                    dragOver
                      ? 'bg-[#0e1116] border-2 border-dashed border-[#e10908]'
                      : file
                        ? 'bg-[#0e1116] border-2 border-solid border-[#e10908]'
                        : 'bg-[#04080b] border-2 border-dashed border-[#333333] hover:border-[#555555]'
                  }`}
                >
                  <input
                    id="photo-file-input"
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                  {file ? (
                    <>
                      <div className="w-16 h-16 rounded-lg bg-[#1a1d22] flex items-center justify-center">
                        <Camera size={32} className="text-[#e10908]" />
                      </div>
                      <p className="text-white text-[15px] font-medium">{file.name}</p>
                      <p className="text-[#666666] text-[13px]">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
                      <button
                        data-part="change-file-btn"
                        onClick={(e) => { e.stopPropagation(); setFile(null) }}
                        className="text-[#e10908] text-[13px] hover:underline"
                      >
                        Remove
                      </button>
                    </>
                  ) : (
                    <>
                      <UploadCloud size={48} className="text-[#555555]" />
                      <p className="text-[#888888] text-[16px]">Drag & drop your photo here</p>
                      <p className="text-[#555555] text-[13px]">or</p>
                      <span className="px-6 py-2.5 bg-[#e10908] text-white text-[14px] rounded-lg hover:bg-[#c00807] transition-colors">
                        Browse Files
                      </span>
                      <p className="text-[#444444] text-[12px]">PNG, JPG, WebP, GIF &bull; Max 10MB</p>
                    </>
                  )}
                </div>

                {/* Photo type selector */}
                <div>
                  <p className="text-white text-[15px] mb-3">Photo Type</p>
                  <div className="grid grid-cols-3 gap-3">
                    {PHOTO_TYPES.map((type) => {
                      const Icon = type.icon
                      const isActive = selectedType === type.id
                      return (
                        <button
                          key={type.id}
                          data-part={`type-${type.id}`}
                          onClick={() => setSelectedType(type.id)}
                          className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                            isActive
                              ? 'bg-[#0e1116] border-[#e10908]'
                              : 'bg-transparent border-[#333333] hover:border-[#555555]'
                          }`}
                        >
                          <Icon size={22} className={isActive ? 'text-[#e10908]' : 'text-[#888888]'} />
                          <span className={`text-[13px] ${isActive ? 'text-white' : 'text-[#888888]'}`}>
                            {type.label}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 px-6 py-4 shrink-0 border-t border-[#1a1d22]">
                <button data-part="cancel-btn" onClick={onClose}
                  className="px-5 py-2.5 bg-transparent border border-[#333333] text-[#888888] rounded-lg text-[15px] hover:text-white hover:border-[#555555] transition-colors">
                  Cancel
                </button>
                <button data-part="upload-btn" onClick={handleUpload} disabled={!file || uploading}
                  className="px-6 py-2.5 bg-[#e10908] text-white rounded-lg text-[15px] font-medium hover:bg-[#c00807] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  {uploading ? 'Uploading...' : 'Upload Photo'}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
