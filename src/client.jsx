if (typeof window !== 'undefined') {
  window.__DEBUG_MODE = (function(){try{return new URLSearchParams(location.search).get('debug')==='true'||localStorage.getItem('cst_debug')==='true'}catch(e){return false}})();
  if (window.__DEBUG_MODE) console.log('[CST] ENTRY_MODULE_LOADED')
  window.__ENTRY_LOADED = true
}

import { hydrateRoot } from 'react-dom/client'
import { StartClient } from '@tanstack/react-start/client'
import { getRouter } from './router'

const router = getRouter()

console.log('[CST] Router created, calling hydrateRoot')

// Suppress recoverable hydration errors (MUI ThemeProvider can cause
// structural DOM mismatches between SSR and client)
hydrateRoot(document, <StartClient router={router} />, {
  onRecoverableError: (err, errorInfo) => {
    // Log to debug but don't throw visible errors
    if (window.__DEBUG_MODE) {
      console.warn('[CST] Hydration recoverable:', err.message)
    }
  },
})
console.log('[CST] hydrateRoot called')
