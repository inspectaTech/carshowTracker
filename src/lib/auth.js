// Placeholder for Auth.js configuration
// This will be implemented with @auth/tanstack-start-adapter and @auth/mongodb-adapter
// For now, this is a minimal placeholder to show authentication structure

export const authConfig = {
  // Placeholder configuration for Auth.js
  providers: [],
  adapter: 'mongodb',
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id
        session.user.email = token.email
        session.user.name = token.name
      }
      return session
    },
  },
}

// Simulated user data for development
export const mockUsers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'organizer',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'participant',
  },
]

// Simulated authentication functions
export const authUtils = {
  async signIn(email, password) {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = mockUsers.find(u => u.email === email)
        if (user) {
          resolve({
            success: true,
            user,
            message: 'Signed in successfully',
          })
        } else {
          resolve({
            success: false,
            message: 'Invalid credentials',
          })
        }
      }, 1000)
    })
  },

  async signUp(name, email, password) {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const newUser = {
          id: String(mockUsers.length + 1),
          name,
          email,
          role: 'organizer',
        }
        // In real implementation, this would save to database
        resolve({
          success: true,
          user: newUser,
          message: 'Account created successfully',
        })
      }, 1000)
    })
  },

  async signOut() {
    // Simulate sign out
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'Signed out successfully',
        })
      }, 500)
    })
  },

  async getCurrentUser() {
    // Simulate getting current user from session
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockUsers[0]) // Return first user as "logged in"
      }, 500)
    })
  },

  async checkAuth() {
    // Simulate authentication check
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          authenticated: true,
          user: mockUsers[0],
        })
      }, 300)
    })
  },
}

export default {
  authConfig,
  mockUsers,
  authUtils,
}