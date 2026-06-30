// Firebase Cloud Messaging Service Worker
// This file handles push notifications when the app is in the background.
// Firebase config will be added when credentials are provided.

self.addEventListener('install', (event) => {
  console.log('[FCM SW] Installed')
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  console.log('[FCM SW] Activated')
  event.waitUntil(clients.claim())
})

self.addEventListener('push', (event) => {
  let data = {}
  try {
    data = event.data?.json() || {}
  } catch {
    data = { title: 'CarShow Tracker', body: event.data?.text() || 'New update' }
  }

  const title = data.title || 'CarShow Tracker'
  const options = {
    body: data.body || 'You have a new update',
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    data: { url: data.url || '/' },
    vibrate: [200, 100, 200],
  }

  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const url = event.notification.data?.url || '/'
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((windowClients) => {
      const existing = windowClients.find((c) => c.url === url)
      if (existing) {
        existing.focus()
      } else {
        clients.openWindow(url)
      }
    })
  )
})
