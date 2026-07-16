const STORAGE_KEY = 'cst_toolbar_layout'

export function getToolbarLayout() {
  if (typeof window === 'undefined') return 'scroll'
  return localStorage.getItem(STORAGE_KEY) || 'scroll'
}

export function setToolbarLayout(layout) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, layout)
  window.dispatchEvent(new CustomEvent('toolbarLayoutChange', { detail: layout }))
}

export function onToolbarLayoutChange(fn) {
  const handler = (e) => fn(e.detail)
  window.addEventListener('toolbarLayoutChange', handler)
  return () => window.removeEventListener('toolbarLayoutChange', handler)
}
