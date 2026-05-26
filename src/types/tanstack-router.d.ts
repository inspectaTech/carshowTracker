import { getRouter } from '../router.jsx'

// Get the router type from the return type of getRouter()
type Router = ReturnType<typeof getRouter>

declare module '@tanstack/react-router' {
  interface Register {
    router: Router
  }
}