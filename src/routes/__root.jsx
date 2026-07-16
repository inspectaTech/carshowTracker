import { HeadContent, Scripts, createRootRoute, useLocation } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { useState, useEffect } from 'react'
import { ThemeProvider } from '@mui/material/styles'
import Header from '../components/Header'
import Footer from '../components/Footer'
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
        <HeadContent />
      </head>
      <body 
        className="font-sans antialiased [overflow-wrap:anywhere] selection:bg-[rgba(79,184,178,0.24)]"
        suppressHydrationWarning
      >
        <ThemeProvider theme={muiTheme}>
          {!hideRootShell && <Header />}
          <main className="min-h-screen">
            {children}
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
