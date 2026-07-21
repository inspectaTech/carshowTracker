import { useState, useRef, useCallback, useEffect } from 'react'
import { GripHorizontal, Maximize2, Minimize2, UndoDot, Pen, Lock, Settings } from 'lucide-react'
import LexicalToolbar from './LexicalToolbar'

// Inlined localStorage persistence for toolbar layout preference
// (self-contained — no external dependencies)
const STORAGE_KEY = 'cst_toolbar_layout'

function getToolbarLayout() {
  if (typeof window === 'undefined') return 'scroll'
  return localStorage.getItem(STORAGE_KEY) || 'scroll'
}

function setToolbarLayout(layout) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, layout)
  window.dispatchEvent(new CustomEvent('toolbarLayoutChange', { detail: layout }))
}

function onToolbarLayoutChange(fn) {
  const handler = (e) => fn(e.detail)
  window.addEventListener('toolbarLayoutChange', handler)
  return () => window.removeEventListener('toolbarLayoutChange', handler)
}

export default function FloatingToolbar({ editor, activeFormats, onFormat, canUndo, canRedo }) {
  const [mode, setMode] = useState('parked') // 'parked' | 'floating' | 'minimized'
  const [layout, setLayout] = useState(getToolbarLayout)
  const [isLocked, setIsLocked] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [position, setPosition] = useState(() => ({
    x: 12,
    y: typeof window !== 'undefined' ? window.innerHeight * 0.3 : 200,
  }))
  const [width, setWidth] = useState(null) // dynamic squeeze width, null = natural
  const dragging = useRef(false)
  const dragOffset = useRef({ x: 0, y: 0 })
  const toolbarRef = useRef(null)
  const naturalWidth = useRef(null) // stable reference: full content width
  const squeezeWidth = useRef(null) // tracks squeezed width during drag
  const lockedWidth = useRef(null) // width locked when lock is active
  const fabStart = useRef({ x: 0, y: 0 })
  const fabOffset = useRef({ x: 0, y: 0 })
  const fabDragging = useRef(false)

  const margin = 12
  const minWidth = typeof window !== 'undefined'
    ? Math.round(window.innerWidth < 768 ? window.innerWidth * 0.5 : window.innerWidth * 0.2)
    : 160

  // Listen for toolbar layout changes in real-time
  useEffect(() => {
    return onToolbarLayoutChange(setLayout)
  }, [])

  // Toolbar drag — squeeze width when pushed against right edge
  const handlePointerMove = useCallback((e) => {
    if (!dragging.current) return
    e.preventDefault()
    const vw = window.innerWidth
    const vh = window.innerHeight

    if (isLocked && lockedWidth.current) {
      // Locked mode — fixed width, no squeeze, just drag within bounds
      const w = lockedWidth.current
      let rawX = e.clientX - dragOffset.current.x
      let x = Math.max(margin, Math.min(rawX, vw - margin - w))
      setPosition({ x, y: Math.max(margin, Math.min(e.clientY - dragOffset.current.y, vh - 48 - margin)) })
      return
    }

    // Capture natural width once
    if (naturalWidth.current === null && toolbarRef.current) {
      naturalWidth.current = toolbarRef.current.scrollWidth
    }
    const baseW = naturalWidth.current || 320

    // Initialize squeeze ref if not set
    const curW = squeezeWidth.current ?? baseW

    let rawX = e.clientX - dragOffset.current.x
    let x = Math.max(margin, rawX)
    const room = (vw - margin) - x // how much room to the right edge

    let newW
    if (room >= baseW) {
      // Enough room for full width
      newW = baseW
    } else if (room < minWidth) {
      // Cramped — minimum width
      newW = minWidth
    } else {
      // Between min and max — track progressively
      newW = Math.max(minWidth, Math.min(baseW, curW + (room - curW) * 0.3))
    }

    squeezeWidth.current = newW
    // Clamp x so toolbar stays within viewport (left margin to right margin)
    x = Math.max(margin, Math.min(x, vw - margin - newW))

    if (newW >= baseW) {
      setWidth(null)
    } else {
      setWidth(newW)
    }

    setPosition({ x, y: Math.max(margin, Math.min(e.clientY - dragOffset.current.y, vh - 48 - margin)) })
  }, [margin, minWidth, isLocked])

  const handlePointerUp = useCallback(() => {
    dragging.current = false
    squeezeWidth.current = null
    // Keep naturalWidth — it's stable for the component's lifetime
    document.removeEventListener('pointermove', handlePointerMove)
    document.removeEventListener('pointerup', handlePointerUp)
  }, [handlePointerMove])

  const startDrag = useCallback((e) => {
    e.preventDefault()
    dragging.current = true
    const rect = toolbarRef.current?.getBoundingClientRect()
    dragOffset.current = {
      x: e.clientX - (rect?.left || position.x),
      y: e.clientY - (rect?.top || position.y),
    }
    // Capture locked width when starting a drag while locked
    if (isLocked) {
      lockedWidth.current = toolbarRef.current?.offsetWidth || null
    }
    // Initialize squeeze width to current rendered width so re-grab starts smoothly
    squeezeWidth.current = toolbarRef.current?.offsetWidth || null
    document.addEventListener('pointermove', handlePointerMove, { passive: false })
    document.addEventListener('pointerup', handlePointerUp)
  }, [position, handlePointerMove, handlePointerUp, isLocked])

  // FAB drag
  const fabPointerMove = useCallback((e) => {
    e.preventDefault()
    const dx = Math.abs(e.clientX - fabStart.current.x)
    const dy = Math.abs(e.clientY - fabStart.current.y)
    if (dx > 5 || dy > 5) fabDragging.current = true
    if (!fabDragging.current) return
    const vw = window.innerWidth
    const vh = window.innerHeight
    const margin = 12
    setPosition({
      x: Math.max(margin, Math.min(e.clientX - fabOffset.current.x, vw - 44 - margin)),
      y: Math.max(margin, Math.min(e.clientY - fabOffset.current.y, vh - 44 - margin)),
    })
  }, [])

  const fabPointerUp = useCallback((e) => {
    document.removeEventListener('pointermove', fabPointerMove)
    document.removeEventListener('pointerup', fabPointerUp)
    if (!fabDragging.current) {
      setMode('floating')
    }
    fabDragging.current = false
  }, [fabPointerMove])

  const fabPointerDown = useCallback((e) => {
    fabDragging.current = false
    fabStart.current = { x: e.clientX, y: e.clientY }
    fabOffset.current = { x: e.clientX - position.x, y: e.clientY - position.y }
    document.addEventListener('pointermove', fabPointerMove, { passive: false })
    document.addEventListener('pointerup', fabPointerUp)
  }, [position, fabPointerMove, fabPointerUp])

  useEffect(() => {
    return () => {
      document.removeEventListener('pointermove', handlePointerMove)
      document.removeEventListener('pointerup', handlePointerUp)
      document.removeEventListener('pointermove', fabPointerMove)
      document.removeEventListener('pointerup', fabPointerUp)
    }
  }, [handlePointerMove, handlePointerUp, fabPointerMove, fabPointerUp])

  // Parked mode — inline
  if (mode === 'parked') {
    return (
      <div data-part="toolbar-parked" className="relative flex items-start gap-0">
        <div className="flex-1 overflow-x-auto overflow-y-hidden scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none]">
          <LexicalToolbar editor={editor} activeFormats={activeFormats} onFormat={onFormat} layout={layout} canUndo={canUndo} canRedo={canRedo} />  </div>
        <button
          data-part="detach-btn"
          onClick={() => setMode('floating')}
          title="Float toolbar"
          className="shrink-0 w-9 h-10 rounded-md flex items-center justify-center text-[#555555] hover:text-white hover:bg-[#1a1d22] active:bg-[#1a1d22] transition-colors touch-manipulation"
        >
          <Maximize2 size={16} />
        </button>
      </div>
    )
  }

  // Minimized mode — draggable red FAB
  if (mode === 'minimized') {
    return (
      <div
        ref={toolbarRef}
        data-part="toolbar-fab"
        onPointerDown={fabPointerDown}
        className="fixed z-50 w-11 h-11 bg-[#e10908] rounded-full flex items-center justify-center shadow-lg shadow-black/40 hover:bg-[#c00807] active:bg-[#c00807] transition-colors cursor-grab active:cursor-grabbing touch-none select-none"
        style={{ left: position.x, top: position.y }}
      >
        <Pen size={18} className="text-white pointer-events-none" />
      </div>
    )
  }

  // Floating mode
  return (
    <>
    <div
      ref={toolbarRef}
      data-part="floating-toolbar"
      className="fixed z-50 bg-[#0a0d12] border border-[#333333] rounded-xl shadow-2xl shadow-black/50 flex items-center gap-0 overflow-hidden select-none"
      style={{ left: position.x, top: position.y, width: width || 'auto' }}
    >
      <div
        onPointerDown={startDrag}
        className="flex items-center justify-center w-10 self-stretch cursor-grab active:cursor-grabbing text-white bg-[#e10908] hover:bg-[#c00807] active:bg-[#c00807] transition-colors touch-none shrink-0"
      >
        <GripHorizontal size={18} />
      </div>

      <div className="flex-1 min-w-0 overflow-x-auto overflow-y-hidden scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none]">
<LexicalToolbar editor={editor} activeFormats={activeFormats} onFormat={onFormat} layout={layout} canUndo={canUndo} canRedo={canRedo} />
      </div>

      {/* Action buttons — 2x2 grid */}
      <div className="grid grid-cols-2 gap-px shrink-0">
        <button
          data-part="minimize-btn"
          onClick={() => setMode('minimized')}
          title="Minimize"
          className="w-7 h-7 rounded-md flex items-center justify-center text-[#555555] hover:text-white hover:bg-[#1a1d22] transition-colors"
        >
          <Minimize2 size={12} />
        </button>
        <button
          data-part="park-btn"
          onClick={() => setMode('parked')}
          title="Park toolbar"
          className="w-7 h-7 rounded-md flex items-center justify-center text-[#555555] hover:text-white hover:bg-[#1a1d22] transition-colors"
        >
          <UndoDot size={12} />
        </button>
        <button
          data-part="lock-btn"
          onClick={() => {
            setIsLocked((v) => !v)
            if (!isLocked) {
              lockedWidth.current = toolbarRef.current?.offsetWidth || null
            }
          }}
          title={isLocked ? 'Unlock toolbar' : 'Lock toolbar'}
          className={`w-7 h-7 rounded-md flex items-center justify-center transition-colors ${
            isLocked ? 'text-[#e10908] bg-[#e10908]/10' : 'text-[#555555] hover:text-white hover:bg-[#1a1d22]'
          }`}
        >
          <Lock size={12} />
        </button>
        <button
          data-part="settings-btn"
          onClick={() => setShowSettings(true)}
          title="Toolbar settings"
          className="w-7 h-7 rounded-md flex items-center justify-center text-[#555555] hover:text-white hover:bg-[#1a1d22] transition-colors"
        >
          <Settings size={12} />
        </button>
      </div>
    </div>

      {/* Settings modal */}
      {showSettings && (
        <div
          data-part="settings-overlay"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50"
          onClick={() => setShowSettings(false)}
        >
          <div
            data-part="settings-modal"
            className="bg-[#0a0d12] border border-[#333333] rounded-xl p-5 w-[280px] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-white text-[16px] font-medium mb-4">Toolbar Settings</h3>
            <label className="text-white text-[14px] block mb-2">Layout Style</label>
            <p className="text-[#888888] text-[12px] mb-3">Choose how the editor toolbar displays its buttons.</p>
            <div className="flex items-center gap-3">
              <button
                data-part="modal-layout-scroll"
                onClick={() => { setLayout('scroll'); setToolbarLayout('scroll') }}
                className={`flex-1 h-10 rounded-lg text-[13px] font-normal transition-colors ${
                  layout === 'scroll'
                    ? 'bg-[#e10908] text-white'
                    : 'bg-[#1a1d22] text-white hover:bg-[#2a2d32]'
                }`}
              >
                Single Row
              </button>
              <button
                data-part="modal-layout-wrap"
                onClick={() => { setLayout('wrap'); setToolbarLayout('wrap') }}
                className={`flex-1 h-10 rounded-lg text-[13px] font-normal transition-colors ${
                  layout === 'wrap'
                    ? 'bg-[#e10908] text-white'
                    : 'bg-[#1a1d22] text-white hover:bg-[#2a2d32]'
                }`}
              >
                Grid
              </button>
            </div>
            <button
              data-part="modal-close"
              onClick={() => setShowSettings(false)}
              className="mt-4 w-full h-9 rounded-lg text-[13px] text-[#888888] border border-[#333333] hover:text-white hover:border-[#555555] transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </>
  )
}
