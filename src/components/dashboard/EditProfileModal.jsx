import { useState } from 'react'
import { X, Camera } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import TextField from '@mui/material/TextField'
import { updateProfile } from '#/server/session'

const EMPTY_STATE = {
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

export default function EditProfileModal({ isOpen, onClose, profile, onUploadPhoto, onSaved }) {
  const [form, setForm] = useState({
    displayName: profile?.username || EMPTY_STATE.displayName,
    bio: profile?.bio || EMPTY_STATE.bio,
    location: profile?.location || EMPTY_STATE.location,
    socialLinks: Array.isArray(profile?.socialLinks) ? profile.socialLinks.join(', ') : '',
    aboutMe: profile?.aboutMe || EMPTY_STATE.aboutMe,
    favoriteBrand: profile?.favoriteBrand || EMPTY_STATE.favoriteBrand,
    dreamCar: profile?.dreamCar || EMPTY_STATE.dreamCar,
    occupation: profile?.occupation || EMPTY_STATE.occupation,
    driveStyle: profile?.driveStyle || EMPTY_STATE.driveStyle,
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    try {
      const result = await updateProfile({ data: { ...form } })
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
                <TextField
                  label="Location"
                  value={form.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  inputProps={{ 'data-part': 'input-location' }}
                  fullWidth
                  size="small"
                />

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
                  disabled={saving}
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
