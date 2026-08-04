// Shared route guard for user-only pages.
// Redirects unauthenticated users to /login.
import { redirect } from '@tanstack/react-router'

export async function requireAuth() {
  // Fetch the session via the server function (works on both SSR and client)
  const { getSessionUser } = await import('../server/session')
  const session = await getSessionUser()
  if (!session?.userId) {
    // TanStack Router treats a thrown redirect() as a navigation redirect
    throw redirect({ to: '/login' })
  }
  return { userId: session.userId, user: session.user }
}
