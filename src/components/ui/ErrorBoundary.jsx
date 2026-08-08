import { Component } from 'react'

/**
 * ErrorBoundary — catches render/child errors and shows a friendly fallback
 * instead of letting a single bad piece of data (a mis-rendered Date, a null
 * field, a broken image, etc.) crash the entire page / site.
 *
 * Usage:
 *   <ErrorBoundary fallback={<p>This section failed to load.</p>}>
 *     <MyList items={items} />
 *   </ErrorBoundary>
 *
 *   <ErrorBoundary>            // uses the default fallback
 *     <EventCard event={e} />
 *   </ErrorBoundary>
 *
 * Props:
 *   - fallback: React node shown when a child throws (default = defaultFallback)
 *   - onError: optional callback (error, errorInfo) for logging/telemetry
 *   - resetKey: optional — when this value changes, the boundary resets and
 *     retries rendering its children (useful for list items keyed by data id)
 */
const defaultFallback = (
  <div className="p-4 rounded-lg bg-[#1a1d22] border border-[#333333]">
    <p className="text-white text-[14px] font-medium mb-1">This section couldn't be displayed.</p>
    <p className="text-[#888888] text-[13px]">Something went wrong rendering this content. The rest of the page is unaffected.</p>
  </div>
)

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    // Never let an unhandled render error go silent — always log a clear,
    // comprehensive message so it shows up in the debug panel / console even in
    // production. Includes the boundary name, the thrown error, its stack, and
    // the React component stack (which tells you exactly which component broke).
    const boundaryName = this.props.name || 'ErrorBoundary'
    const componentStack = errorInfo?.componentStack || '(no component stack)'

    if (typeof window !== 'undefined') {
      try {
        window.__DEBUG_ERRORS = window.__DEBUG_ERRORS || []
        window.__DEBUG_ERRORS.push({
          msg: 'BOUNDARY(' + boundaryName + '): ' + String(error?.message || error),
          stack: String(error?.stack || ''),
          componentStack,
        })
      } catch { /* ignore */ }
    }

    // Clear, comprehensive console output — one header + full details.
    // eslint-disable-next-line no-console
    console.error(
      `%c[ErrorBoundary:${boundaryName}] A component failed to render and was caught. The rest of the page is unaffected.`,
      'background:#e10908;color:#fff;font-weight:bold;padding:2px 6px;border-radius:3px;'
    )
    // eslint-disable-next-line no-console
    console.error('Error:', error)
    // eslint-disable-next-line no-console
    console.error('Component stack (where it broke):', componentStack)

    if (this.props.onError) this.props.onError(error, errorInfo)
  }

  componentDidUpdate(prevProps) {
    // If a resetKey is provided and changes (e.g. a new item id), retry.
    if (this.state.hasError && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ hasError: false, error: null })
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || defaultFallback
    }
    return this.props.children
  }
}
