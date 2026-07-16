import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GripHorizontal, Minimize2, Maximize2, Pen, UndoDot } from 'lucide-react'
import LexicalToolbar from './LexicalToolbar'

export default function FloatingToolbar({ editor, activeFormats, onFormat }) {
  const [mode, setMode] = useState('parked') // 'parked' | 'floating' | 'minimized'
  const [position, setPosition] = useState({ x: 20, y: 100 })
  const posRef = useRef(position)
  const dragging = useRef(false)
  const dragStart = useRef({ x: 0, y: 0 })
  const posStart = useRef({ x: 0, y: 0 })
  const toolbarRef = useRef(null)
  const snapThreshold = 60

  // Keep posRef in sync
  useEffect(() => { posRef.current = position }, [position])

  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false

  const clampPosition = useCallback((x, y) => {
    const w = toolbarRef.current?.offsetWidth || 360
    const h = toolbarRef.current?.offsetHeight || 48
    const vw = window.innerWidth
    const vh = window.innerHeight
    const margin = isMobile ? 24 : 12
    return {
      x: Math.max(margin, Math.min(x, vw - w - margin)),
      y: Math.max(margin, Math.min(y, vh - h - margin)),
    }
  }, [isMobile])

  const handlePointerMove = useCallback((e) => {
    if (!dragging.current) return
    e.preventDefault()
    const dx = e.clientX - dragStart.current.x
    const dy = e.clientY - dragStart.current.y
    // Use RAF throttle for smooth movement
    setPosition(clampPosition(posStart.current.x + dx, posStart.current.y + dy))
  }, [clampPosition])

  const handlePointerUp = useCallback(() => {
    dragging.current = false
    document.removeEventListener('pointermove', handlePointerMove)
    document.removeEventListener('pointerup', handlePointerUp)

    // Snap to right edge → auto-minimize to FAB
    if (toolbarRef.current) {
      const rect = toolbarRef.current.getBoundingClientRect()
      const vw = window.innerWidth
      if (vw - rect.right < snapThreshold) {
        setPosition((prev) => ({
          x: Math.max(12, vw - 48 - 24),
          y: prev.y,
        }))
        setTimeout(() => setMode('minimized'), 150)
      }
    }
  }, [handlePointerMove, snapThreshold])

  const handlePointerDown = useCallback((e) => {
    e.preventDefault()
    dragging.current = true
    dragStart.current = { x: e.clientX, y: e.clientY }
    posStart.current = { ...posRef.current }
    document.addEventListener('pointermove', handlePointerMove, { passive: false })
    document.addEventListener('pointerup', handlePointerUp, { passive: false })
  }, [handlePointerMove, handlePointerUp])

  // Clean up listeners on unmount
  useEffect(() => {
    return () => {
      dragging.current = false
      document.removeEventListener('pointermove', handlePointerMove)
      document.removeEventListener('pointerup', handlePointerUp)
    }
  }, [handlePointerMove, handlePointerUp])

  // Center the floating toolbar on first detach
  const handleDetach = useCallback(() => {
    const x = Math.max(12, (window.innerWidth - 400) / 2)
    const y = Math.max(12, (window.innerHeight - 100) / 2)
    setPosition({ x, y })
    setMode('floating')
  }, [])

  // Parked mode — renders inline below the editor
  if (mode === 'parked') {
    return (
      <div data-part="toolbar-parked" className="relative flex items-start gap-0">
        <div className="flex-1 overflow-x-auto overflow-y-hidden scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none]">
          <LexicalToolbar editor={editor} activeFormats={activeFormats} onFormat={onFormat} />
        </div>
        <button
          data-part="detach-btn"
          onClick={handleDetach}
          title="Detach toolbar"
          className="shrink-0 w-9 h-10 rounded-md flex items-center justify-center text-[#555555] hover:text-white hover:bg-[#1a1d22] active:bg-[#1a1d22] transition-colors touch-manipulation"
        >
          <Maximize2 size={16} />
        </button>
      </div>
    )
  }

  // Minimized mode — small circular FAB, also draggable
  if (mode === 'minimized') {
    return (
      <AnimatePresence>
        <motion.button
          ref={toolbarRef}
          data-part="toolbar-fab"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          onPointerDown={handlePointerDown}
          onPointerUp={(e) => {
            // Only expand if we didn't drag (pointer didn't move much)
            const dx = Math.abs(e.clientX - dragStart.current.x)
            const dy = Math.abs(e.clientY - dragStart.current.y)
            if (dx < 5 && dy < 5) {
              setMode('floating')
            }
          }}
          title="Expand toolbar"
          className="fixed w-11 h-11 sm:w-12 sm:h-12 bg-[#e10908] rounded-full flex items-center justify-center shadow-lg shadow-black/40 hover:bg-[#c00807] active:bg-[#c00807] transition-colors z-50 cursor-grab active:cursor-grabbing touch-none select-none"
          style={{ left: position.x, top: position.y }}
        >
          <Pen size={18} className="text-white pointer-events-none sm:size-5" />
        </motion.button>
      </AnimatePresence>
    )
  }

  // Floating mode — fixed-position draggable card
  return (
    <AnimatePresence>
      <motion.div
        ref={toolbarRef}
        data-part="toolbar-floating"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        className="fixed z-50 bg-[#0a0d12] border border-[#333333] rounded-xl shadow-2xl shadow-black/50 flex items-center gap-0 overflow-hidden select-none max-w-[85vw] sm:max-w-[400px]"
        style={{ left: position.x, top: position.y }}
      >
        {/* Drag handle — bigger touch target on mobile */}
        <div
          data-part="drag-handle"
          onPointerDown={handlePointerDown}
          className="flex items-center justify-center w-10 h-10 shrink-0 cursor-grab active:cursor-grabbing text-[#555555] hover:text-white hover:bg-[#1a1d22] active:bg-[#1a1d22] transition-colors touch-none select-none"
        >
          <GripHorizontal size={18} />
        </div>

        {/* Toolbar buttons — scrollable on mobile */}
        <div className="flex-1 min-w-0 overflow-x-auto overflow-y-hidden scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none]">
          <LexicalToolbar editor={editor} activeFormats={activeFormats} onFormat={onFormat} />
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-0.5 pr-1 shrink-0">
          <button
            data-part="minimize-btn"
            onClick={() => setMode('minimized')}
            title="Minimize"
            className="w-7 h-7 rounded-md flex items-center justify-center text-[#555555] hover:text-white hover:bg-[#1a1d22] transition-colors"
          >
            <Minimize2 size={14} />
          </button>
          <button
            data-part="park-btn"
            onClick={() => setMode('parked')}
            title="Park toolbar"
            className="w-7 h-7 rounded-md flex items-center justify-center text-[#555555] hover:text-white hover:bg-[#1a1d22] transition-colors"
          >
            <UndoDot size={14} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
