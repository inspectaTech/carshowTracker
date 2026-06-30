// PWA utility — service worker registration + push notification helpers

export async function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) {
    console.log('[PWA] Service workers not supported')
    return null
  }

  try {
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
      scope: '/',
    })
    console.log('[PWA] Service worker registered:', registration.scope)
    return registration
  } catch (err) {
    console.error('[PWA] Service worker registration failed:', err)
    return null
  }
}

export async function requestNotificationPermission() {
  // Step 1: Register the service worker first
  const registration = await registerServiceWorker()
  if (!registration) return { granted: false, error: 'Service worker not available' }

  // Step 2: Request permission from the browser
  const permission = await Notification.requestPermission()
  if (permission !== 'granted') {
    return { granted: false, error: 'Permission denied' }
  }

  // Step 3: Get push subscription (FCM token will be added when Firebase is configured)
  try {
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: null, // Will be set with VAPID key from Firebase
    })
    console.log('[PWA] Push subscription:', subscription)
    return { granted: true, subscription }
  } catch (err) {
    console.error('[PWA] Push subscription failed:', err)
    return { granted: false, error: err.message }
  }
}
