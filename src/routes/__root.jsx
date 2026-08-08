import { HeadContent, Scripts, createRootRoute, useLocation } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { useState, useEffect } from 'react'
import { ThemeProvider } from '@mui/material/styles'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ErrorBoundary from '../components/ui/ErrorBoundary'
import muiTheme from '../lib/mui-theme'

import appCss from '../styles/global.css?url'

const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');var mode=(stored==='light'||stored==='dark'||stored==='auto')?stored:'auto';var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=mode==='auto'?(prefersDark?'dark':'light'):mode;var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(resolved);if(mode==='auto'){root.removeAttribute('data-theme')}else{root.setAttribute('data-theme',mode)}root.style.colorScheme=resolved;}catch(e){}})();`

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        name: 'theme-color',
        content: '#04080b',
      },
      {
        title: 'CarShow Tracker - Track and Manage Car Shows',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
      {
        rel: 'manifest',
        href: '/manifest.json',
      },
    ],
  }),
  shellComponent: RootDocument,
  notFoundComponent: () => (
    <div className="min-h-screen bg-[#04080b] flex flex-col items-center justify-center p-8">
      <h1 className="text-white text-[28px] font-medium mb-2">Page Not Found</h1>
      <p className="text-[#888888] text-[16px] mb-6">This page doesn't exist yet.</p>
      <a href="/dashboard" className="h-11 px-5 rounded-lg bg-[#e10908] hover:bg-[#c00807] text-white text-[16px] flex items-center transition-colors">
        Go to Dashboard
      </a>
    </div>
  ),
})

function RootDocument({ children }) {
  const [showDevtools, setShowDevtools] = useState(false)

  useEffect(() => {
    setShowDevtools(true)
  }, [])

  // Dashboard, Garage, and other app pages have their own sidebar, so we hide the root Header and Footer there.
  const location = useLocation()
  const hideRootShell = ['/dashboard', '/garage', '/explore', '/settings', '/community', '/my-events', '/admin'].includes(location.pathname)

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <script dangerouslySetInnerHTML={{ __html: `
// Debug mode: add ?debug=true to URL or localStorage.setItem('cst_debug','true')
window.__DEBUG_MODE = (function(){try{return new URLSearchParams(location.search).get('debug')==='true'||localStorage.getItem('cst_debug')==='true'}catch(e){return false}})();

window.__DEBUG_ERRORS = [];
window.__HYDRATION_CHECKED = false;

// Always track errors silently
window.onerror = function(msg, url, line, col, err) {
  window.__DEBUG_ERRORS.push({ msg: String(msg), url: url, line: line, col: col });
  if (window.__DEBUG_MODE) console.error('[DEBUG] GLOBAL ERROR:', msg, url, line, col);
};
window.addEventListener('unhandledrejection', function(e) {
  window.__DEBUG_ERRORS.push({ msg: 'PROMISE: ' + String(e.reason) });
  if (window.__DEBUG_MODE) console.error('[DEBUG] UNHANDLED REJECTION:', e.reason);
});
window.addEventListener('error', function(e) {
  if (window.__DEBUG_MODE && e.target && e.target.tagName === 'IMG') console.warn('[DEBUG] IMG LOAD ERROR:', e.target.src);
}, true);

// Only show bars when debug mode is on
if (window.__DEBUG_MODE) {
// Hydration diagnostics
function dumpDiagnostics(label) {
  var html = '';
  html += '[' + label + '] ';
  html += 'entry=' + (window.__ENTRY_LOADED ? 'YES' : 'NO');
  html += ' | $_TSR=' + (typeof window.$_TSR);
  if (window.$_TSR) {
    html += ' | init=' + window.$_TSR.initialized;
    html += ' | router=' + (window.$_TSR.router ? 'YES' : 'NO');
    html += ' | bufLen=' + (window.$_TSR.buffer ? window.$_TSR.buffer.length : '?');
    html += ' | eDone=' + (window.$_TSR.streamEnded);
    html += ' | hDone=' + (window.$_TSR.hydrated);
  }
  html += ' | errors=' + window.__DEBUG_ERRORS.length;
  var d = document.createElement('div');
  d.style.cssText = 'position:fixed;top:' + (25 + window.__DIAG_COUNT * 20) + 'px;left:0;right:0;background:#ff6600;color:white;padding:2px 8px;font-size:10px;z-index:99998;font-family:monospace;white-space:pre';
  d.textContent = 'DIAG: ' + html;
  document.body.appendChild(d);
  window.__DIAG_COUNT = (window.__DIAG_COUNT || 0) + 1;
}

window.__DIAG_COUNT = 0;

setTimeout(function() { dumpDiagnostics('2s'); }, 2000);
setTimeout(function() { dumpDiagnostics('5s'); }, 5000);
setTimeout(function() { dumpDiagnostics('10s'); }, 10000);
setTimeout(function() { dumpDiagnostics('20s'); }, 20000);

document.addEventListener('DOMContentLoaded', function() {
  setTimeout(function() {
    if (window.__DEBUG_ERRORS.length > 0) {
      var d = document.createElement('div');
      d.style.cssText = 'position:fixed;bottom:0;left:0;right:0;background:#e10908;color:white;padding:8px;font-size:12px;z-index:99999;font-family:monospace;max-height:120px;overflow:auto';
      d.textContent = 'JS Errors: ' + window.__DEBUG_ERRORS.length + ' - ' + window.__DEBUG_ERRORS.map(function(e) { return e.msg; }).join(' | ');
      document.body.appendChild(d);
    }
  }, 3000);
});
}
`}} />
        <HeadContent />
      </head>
      <body 
        className="font-sans antialiased [overflow-wrap:anywhere] selection:bg-[rgba(79,184,178,0.24)]"
        suppressHydrationWarning
      >
        <ThemeProvider theme={muiTheme}>
          {!hideRootShell && <Header />}
          <main className="min-h-screen">
            <ErrorBoundary
              name="AppShell"
              resetKey={location.pathname}
              onError={(err) => {
                // Surface the crash so it's impossible to miss in dev/prod
                if (typeof window !== 'undefined' && window.__DEBUG_MODE) {
                  // eslint-disable-next-line no-console
                  console.error('[AppShell] Page crashed while rendering:', err)
                }
              }}
              fallback={
                <div className="min-h-[60vh] bg-[#04080b] flex flex-col items-center justify-center p-8">
                  <h1 className="text-white text-[24px] font-medium mb-2">Something went wrong</h1>
                  <p className="text-[#888888] text-[15px] mb-6">This page hit an unexpected error. Try reloading, or head back to the dashboard.</p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => window.location.reload()}
                      className="h-11 px-5 rounded-lg bg-[#e10908] hover:bg-[#c00807] text-white text-[16px] transition-colors"
                    >
                      Reload Page
                    </button>
                    <a href="/dashboard" className="h-11 px-5 rounded-lg border border-[#333333] text-white text-[16px] flex items-center hover:bg-[#1a1d22] transition-colors">
                      Go to Dashboard
                    </a>
                  </div>
                </div>
              }
            >
              {children}
            </ErrorBoundary>
          </main>
          {!hideRootShell && <Footer />}
        </ThemeProvider>
        {showDevtools && (
          <TanStackDevtools
            config={{
              position: 'bottom-right',
            }}
            plugins={[
              {
                name: 'Tanstack Router',
                render: <TanStackRouterDevtoolsPanel />,
              },
            ]}
          />
        )}
        <Scripts />
      </body>
    </html>
  )
}
