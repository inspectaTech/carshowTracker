import { useState } from 'react'
import { X, Camera } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const EMPTY_STATE = {
  displayName: 'Gearhead_23',
  bio: 'Car enthusiast since day one. I live for weekend drives, track days, and late night builds.',
  location: 'Los Angeles, CA',
  socialLinks: '',
  aboutMe: 'Car enthusiast since day one. I live for weekend drives, track days, and late night builds. JDM at heart. Always chasing the next build.',
  favoriteBrand: 'Nissan',
  dreamCar: 'Nissan GT-R R34',
  occupation: 'Automotive Photographer',
  driveStyle: 'Performance & Style',
}

export default function EditProfileModal({ isOpen, onClose, profile, onUploadPhoto }) {
  const [form, setForm] = useState({
    displayName: profile?.username || EMPTY_STATE.displayName,
    bio: profile?.aboutMe || EMPTY_STATE.bio,
    location: profile?.location || EMPTY_STATE.location,
    socialLinks: '',
    aboutMe: profile?.aboutMe || EMPTY_STATE.aboutMe,
    favoriteBrand: profile?.favoriteBrand || EMPTY_STATE.favoriteBrand,
    dreamCar: profile?.dreamCar || EMPTY_STATE.dreamCar,
    occupation: profile?.occupation || EMPTY_STATE.occupation,
    driveStyle: profile?.driveStyle || EMPTY_STATE.driveStyle,
  })
  const [saving, setSaving] = useState(false)

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    // Simulate save
    await new Promise((r) => setTimeout(r, 800))
    setSaving(false)
    onClose()
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
                <div data-part="field-display-name">
                  <label className="block text-white text-[14px] mb-1.5">Display Name</label>
                  <input
                    type="text"
                    value={form.displayName}
                    onChange={(e) => handleChange('displayName', e.target.value)}
                    data-part="input-display-name"
                    className="w-full px-4 py-3 bg-[#04080b] border border-[#333333] rounded-lg text-white placeholder-[#555555] focus:outline-none focus:border-[#e10908] transition-colors"
                  />
                </div>

                {/* Bio */}
                <div data-part="field-bio">
                  <label className="block text-white text-[14px] mb-1.5">Bio</label>
                  <textarea
                    value={form.bio}
                    onChange={(e) => handleChange('bio', e.target.value)}
                    data-part="input-bio"
                    rows={4}
                    className="w-full px-4 py-3 bg-[#04080b] border border-[#333333] rounded-lg text-white placeholder-[#555555] focus:outline-none focus:border-[#e10908] transition-colors resize-none"
                  />
                </div>

                {/* Location */}
                <div data-part="field-location">
                  <label className="block text-white text-[14px] mb-1.5">Location</label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                    data-part="input-location"
                    className="w-full px-4 py-3 bg-[#04080b] border border-[#333333] rounded-lg text-white placeholder-[#555555] focus:outline-none focus:border-[#e10908] transition-colors"
                  />
                </div>

                {/* Social Links */}
                <div data-part="field-social">
                  <label className="block text-white text-[14px] mb-1.5">Social Links</label>
                  <input
                    type="text"
                    value={form.socialLinks}
                    onChange={(e) => handleChange('socialLinks', e.target.value)}
                    data-part="input-social"
                    placeholder="Instagram, YouTube, TikTok URLs"
                    className="w-full px-4 py-3 bg-[#04080b] border border-[#333333] rounded-lg text-white placeholder-[#555555] focus:outline-none focus:border-[#e10908] transition-colors"
                  />
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-[#333333]" />

                {/* About Me section */}
                <div data-part="about-me-section">
                  <h3 className="text-white text-[18px] font-medium mb-1">About Me</h3>
                  <p className="text-[#888888] text-[13px] mb-4">Tell the community about yourself — your car preferences, style, and story.</p>

                  <div className="space-y-5">
                    <div data-part="field-aboutme">
                      <label className="block text-white text-[14px] mb-1.5">About Me</label>
                      <textarea value={form.aboutMe} onChange={(e) => handleChange('aboutMe', e.target.value)}
                        data-part="input-aboutme" rows={3}
                        className="w-full px-4 py-3 bg-[#04080b] border border-[#333333] rounded-lg text-white placeholder-[#555555] focus:outline-none focus:border-[#e10908] transition-colors resize-none" />
                    </div>
                    <div data-part="field-favbrand">
                      <label className="block text-white text-[14px] mb-1.5">Favorite Brand</label>
                      <input type="text" value={form.favoriteBrand} onChange={(e) => handleChange('favoriteBrand', e.target.value)}
                        data-part="input-favbrand" placeholder="e.g. Nissan"
                        className="w-full px-4 py-3 bg-[#04080b] border border-[#333333] rounded-lg text-white placeholder-[#555555] focus:outline-none focus:border-[#e10908] transition-colors" />
                    </div>
                    <div data-part="field-dreamcar">
                      <label className="block text-white text-[14px] mb-1.5">Dream Car</label>
                      <input type="text" value={form.dreamCar} onChange={(e) => handleChange('dreamCar', e.target.value)}
                        data-part="input-dreamcar" placeholder="e.g. Nissan GT-R R34"
                        className="w-full px-4 py-3 bg-[#04080b] border border-[#333333] rounded-lg text-white placeholder-[#555555] focus:outline-none focus:border-[#e10908] transition-colors" />
                    </div>
                    <div data-part="field-occupation">
                      <label className="block text-white text-[14px] mb-1.5">Occupation</label>
                      <input type="text" value={form.occupation} onChange={(e) => handleChange('occupation', e.target.value)}
                        data-part="input-occupation" placeholder="e.g. Automotive Photographer"
                        className="w-full px-4 py-3 bg-[#04080b] border border-[#333333] rounded-lg text-white placeholder-[#555555] focus:outline-none focus:border-[#e10908] transition-colors" />
                    </div>
                    <div data-part="field-drive">
                      <label className="block text-white text-[14px] mb-1.5">Drive Style</label>
                      <input type="text" value={form.driveStyle} onChange={(e) => handleChange('driveStyle', e.target.value)}
                        data-part="input-drive" placeholder="e.g. Performance & Style"
                        className="w-full px-4 py-3 bg-[#04080b] border border-[#333333] rounded-lg text-white placeholder-[#555555] focus:outline-none focus:border-[#e10908] transition-colors" />
                    </div>
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
