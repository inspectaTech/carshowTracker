import { CheckCircle2, AlertCircle, Info } from 'lucide-react'

const ICONS = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
}

const STYLES = {
  success: 'border-[#2a5d34]/60 text-[#7ad48a]',
  error: 'border-[#e10908]/50 text-[#ffb3b3]',
  info: 'border-[#333333] text-[#cccccc]',
}

/**
 * Minimal toast stack — fixed bottom-center. Each toast is a card the user can
 * click to dismiss; they auto-dismiss after a few seconds (handled by parent).
 * `toasts`: [{ id, type: 'success'|'error'|'info', message }]
 */
export default function ToastStack({ toasts = [], onDismiss }) {
  if (!toasts.length) return null
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[4000] flex flex-col items-center gap-2 px-4 w-full max-w-md pointer-events-none">
      {toasts.map((t) => {
        const Icon = ICONS[t.type] || Info
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onDismiss?.(t.id)}
            title="Dismiss"
            className={`pointer-events-auto w-full flex items-center gap-2.5 px-4 py-3 rounded-lg bg-[#0a0d12] border text-[13px] shadow-xl ${STYLES[t.type] || STYLES.info}`}
          >
            <Icon size={16} className="shrink-0" />
            <span className="flex-1 text-left leading-snug">{t.message}</span>
          </button>
        )
      })}
    </div>
  )
}
