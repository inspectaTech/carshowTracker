import { Bell } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function NotificationOptIn({ isOpen, onClose, onOptIn }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-[#0a0d12] rounded-2xl w-full max-w-sm pointer-events-auto shadow-2xl border border-[#1a1d22] p-8 text-center">
              <div className="w-16 h-16 bg-[#e10908]/10 rounded-full flex items-center justify-center mx-auto mb-5">
                <Bell className="h-8 w-8 text-[#e10908]" />
              </div>
              <h2 className="text-white text-[22px] font-medium mb-2">Get Notified</h2>
              <p className="text-[#888888] text-[15px] mb-8 leading-relaxed">
                Get notified and keep up with interactions and updates.
              </p>
              <div className="flex flex-col gap-3">
                <button data-part="opt-in-btn" onClick={onOptIn}
                  className="w-full py-3 bg-[#e10908] text-white text-[16px] font-medium rounded-xl hover:bg-[#c00807] transition-colors">
                  I&apos;m In
                </button>
                <button data-part="skip-btn" onClick={onClose}
                  className="w-full py-3 bg-transparent text-[#888888] text-[16px] rounded-xl hover:text-white hover:bg-[#0e1116] transition-colors">
                  Skip
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
