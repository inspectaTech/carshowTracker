import { createAuthClient } from 'better-auth/react'

export const authClient = createAuthClient({
  baseURL:
    process.env.NODE_ENV === 'production'
      ? 'https://cst.sunzao.win'
      : 'http://localhost:3000',
})
