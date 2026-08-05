# OAuth with Better Auth + TanStack Start + MongoDB — Tutorial

A step-by-step walkthrough of adding **Google OAuth** login to a **TanStack Start** (React) app backed by **MongoDB**, using **Better Auth**. Every step here is from a working, production-tested implementation — no dead ends, no failed attempts.

Use this to follow along in code, narrate a video, or build a course module.

---

## 1. Overview & Prerequisites

### What you'll build

By the end of this tutorial you'll have:

- A **login / sign-up page** with "Continue with Google" (plus email/password)
- A session that survives page reloads (cookies handled automatically)
- **Protected routes** — unauthenticated users get redirected to `/login`
- A **MongoDB user record** auto-created on first sign-in, plus a matching app profile document

### The stack

| Piece | What we use |
|-------|-------------|
| Framework | TanStack Start v1 (React) |
| Auth library | **Better Auth** v1.6.25 |
| Database | MongoDB 7 |
| OAuth provider | Google |

### Why Better Auth, not Auth.js?

We originally tried **Auth.js (NextAuth)**. It does **not** support TanStack Start — only Next.js, Qwik, SvelteKit, and Express. The Auth.js maintainers **joined the Better Auth project**, which is the framework-agnostic successor. For TanStack Start, **Better Auth is the correct choice.**

### Requirements checklist

- [ ] Node.js 18+ (with `npm`)
- [ ] A running MongoDB instance (local or remote)
- [ ] A Google Cloud project (free tier is fine)
- [ ] A TanStack Start app scaffolded (`npm create @tanstack/start@latest`)

---

## 2. Google Cloud Setup

This is where you get the credentials Better Auth uses to talk to Google.

### 2.1 Create the OAuth consent screen

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a project (or pick an existing one).
3. Navigate to **APIs & Services → OAuth consent screen**.
4. Choose **External** (lets real users sign in).
5. Fill in the app name and a support email. Save.

### 2.2 Create an OAuth 2.0 Client ID

1. Go to **APIs & Services → Credentials**.
2. Click **+ Create Credentials → OAuth client ID**.
3. Application type: **Web application**.
4. Under **Authorized redirect URIs**, add:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://your-production-domain.com/api/auth/callback/google`
5. Create. Google shows you a **Client ID** and **Client Secret**.

### 2.3 ⚠️ Download the credentials JSON (important!)

When the client is created, Google warns you that you may **only have one chance to copy the secret** (similar to LLM API keys). In practice you can usually view/copy it again from the Credentials page later — but don't rely on that.

**Always download the `client_secret_*.json` file** right there and save it somewhere safe on your computer (e.g. a `secrets/` folder outside your repo). It contains both the Client ID and the Client Secret. This gives you a reliable backup even if the "copy" option disappears.

### 2.4 Store credentials in `.env`

Create a `.env` in your project root (it's gitignored — never commit it):

```env
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
USE_MONGODB=true
MONGODB_URI=mongodb://127.0.0.1:27017
```

> 🔒 **Never commit `.env`.** Add it to `.gitignore` before anything else.

---

## 3. Install & Configure Better Auth

### 3.1 Install dependencies

```bash
npm install better-auth mongodb
```

### 3.2 Create the auth config — `src/lib/auth.js`

This is the heart of the setup. A single `betterAuth()` instance configures the database adapter, the Google provider, email/password, cookies, and signup hooks.

```js
// src/lib/auth.js
import { betterAuth } from 'better-auth'
import { mongodbAdapter } from 'better-auth/adapters/mongodb'
import { tanstackStartCookies } from 'better-auth/tanstack-start'
import { MongoClient } from 'mongodb'

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017'
const client = new MongoClient(MONGODB_URI, {
  serverSelectionTimeoutMS: 3000,
})

export const auth = betterAuth({
  database: mongodbAdapter(client.db('carshow_tracker'), {
    // Local standalone MongoDB doesn't support transactions
    transaction: false,
  }),
  plugins: [tanstackStartCookies()],
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
  advanced: {
    defaultCookieAttributes: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    },
  },
  user: {
    additionalFields: {
      // Mirrors the dashboard's profile shape
      username: { type: 'string', required: false, input: true },
      role: { type: 'string', required: false, defaultValue: 'user', input: false },
    },
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          // Auto-create a matching `profiles` document so the dashboard
          // can show real user data immediately after sign-up.
          try {
            const { connectToDatabase } = await import('./db')
            const { db } = await connectToDatabase()

            // Generate a unique @handle — base from the display name, then
            // append _1, _2, ... if the base is already taken.
            const base = (user.name || 'member').toLowerCase().replace(/[^a-z0-9_]/g, '').replace(/\s+/g, '_').slice(0, 30) || 'member'
            let handle = `@${base}`
            let suffix = 1
            while (await db.collection('profiles').findOne({ handle })) {
              handle = `@${base}_${suffix}`
              suffix += 1
            }

            await db.collection('profiles').insertOne({
              userId: user.id,
              username: user.name || 'New Member',
              handle,
              bio: '',
              avatarUrl: user.image || null,
              location: '',
              joinedAt: new Date().toISOString().slice(0, 10),
              socialLinks: [],
              aboutMe: '',
              favoriteBrand: '',
              dreamCar: '',
              occupation: '',
              driveStyle: '',
              stats: { totalPoints: 0, badges: 0, carsInGarage: 0, followers: 0, following: 0 },
              email: user.email || '',
              createdAt: new Date(),
            })
            console.log('[Auth] Created profile for user', user.id)
          } catch (err) {
            console.warn('[Auth] Failed to create profile:', err.message)
          }
        },
      },
    },
  },
})
```

**What each part does:**

| Option | Purpose |
|--------|---------|
| `mongodbAdapter(client.db(...), { transaction: false })` | Stores users/sessions in MongoDB. `transaction:false` is required for standalone MongoDB (no replica set). |
| `plugins: [tanstackStartCookies()]` | **Critical for TanStack Start** — handles setting/reading the session cookie through TanStack's server utilities. |
| `emailAndPassword` | Adds email/password sign-up and sign-in (auto-sign-in on signup). |
| `socialProviders.google` | Adds "Continue with Google". |
| `advanced.defaultCookieAttributes` | Secure cookies in production, `sameSite: 'lax'` everywhere. |
| `user.additionalFields` | Extra fields stored on the `user` collection (here: `username`, `role`). |
| `databaseHooks.user.create.after` | Runs after every new user is created — used to auto-create the app's `profiles` doc with a unique `@handle`. |

---

## 4. Wire the Auth API Route

Better Auth exposes everything through one catch-all route. Create `src/routes/api.auth.$.jsx`:

```jsx
// src/routes/api.auth.$.jsx
import { createFileRoute } from '@tanstack/react-router'
import { auth } from '../lib/auth'

export const Route = createFileRoute('/api/auth/$')({
  server: {
    handlers: {
      GET: ({ request }) => auth.handler(request),
      POST: ({ request }) => auth.handler(request),
    },
  },
})
```

That's the whole route. It forwards **every** request under `/api/auth/*` (login, callback, logout, session) to Better Auth's handler.

---

## 5. Client Setup & Login UI

### 5.1 Create the auth client — `src/lib/auth-client.js`

```js
// src/lib/auth-client.js
import { createAuthClient } from 'better-auth/react'

export const authClient = createAuthClient({
  baseURL:
    process.env.NODE_ENV === 'production'
      ? 'https://your-production-domain.com'
      : 'http://localhost:3000',
})
```

### 5.2 The login form

Use `authClient` to sign in via Google, email, or sign up. Here's the essential logic (from our working `LoginForm`):

```jsx
// Sign in with Google
await authClient.signIn.social({ provider: 'google', callbackURL: '/dashboard' })

// Sign in with email/password
const { error: signInError } = await authClient.signIn.email({
  email: formData.email,
  password: formData.password,
})

// Sign up with email/password
const { error: signUpError } = await authClient.signUp.email({
  email: formData.email,
  password: formData.password,
  name: formData.name || formData.email.split('@')[0],
})

// Sign out
await authClient.signOut()
```

**Key point:** after a successful sign-in, navigate to the protected page:

```jsx
navigate({ to: '/dashboard' })
```

**Form-field tips from our implementation:**

- Wrap email/password inputs with icons and labels (Mail/Lock icons, `Eye`/`EyeOff` toggle for password visibility).
- Show an inline red error box for failures (`Invalid credentials`, `Passwords do not match`, etc.).
- Use a segmented **Sign In / Sign Up** toggle instead of a separate sign-up page.

---

## 6. Sessions & Route Guards

### 6.1 Read the session server-side — `src/server/session.js`

Create server functions to look up the session. **Do not** import server-only modules directly into route files (see the client-bundle rule below).

```js
// src/server/session.js
import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'

export const getSessionUser = createServerFn({ method: 'GET' })
  .handler(async () => {
    try {
      const request = getRequest()
      const { auth } = await import('../lib/auth')
      const session = await auth.api.getSession({ headers: request?.headers })
      if (session?.user?.id) {
        return { userId: session.user.id, user: session.user }
      }
      return { userId: null, user: null }
    } catch (err) {
      console.warn('[getSessionUser] Failed to read session:', err.message)
      return { userId: null, user: null }
    }
  })
```

### 6.2 Create the route guard — `src/lib/route-guard.js`

```js
// src/lib/route-guard.js
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
```

### 6.3 Protect a route

```jsx
import { requireAuth } from '#/lib/route-guard'

export const Route = createFileRoute('/dashboard')({
  beforeLoad: requireAuth,
  // ...
})
```

Now visiting `/dashboard` while logged out **redirects (307) to `/login`**.

### ⚠️ The client-bundle rule (critical)

Server-only dependencies (like the MongoDB driver or `auth`) must **not** be imported at the top of route files or loaders — that pulls Node built-ins into the **client** bundle and breaks the build (e.g. `"createConnection" is not exported by "__vite-browser-external"`).

The pattern that works:

1. Put server logic in **`createServerFn`** modules (like `src/server/session.js`).
2. Inside the handler, load server-only code with **dynamic `import()`**:

```js
const { auth } = await import('../lib/auth')
const { connectToDatabase } = await import('./db')
```

This keeps the client bundle clean while the server still gets everything it needs.

---

## 7. Persistence & Gotchas

### 7.1 `mongodbAdapter` wants a `Db`, not a `MongoClient`

A common mistake is passing the `MongoClient` to the adapter. Better Auth's MongoDB adapter takes a **`Db` instance** plus a config object:

```js
mongodbAdapter(client.db('carshow_tracker'), { transaction: false })
```

### 7.2 `session.user.id` = `String(user._id)`

With MongoDB, user documents use `_id` (an ObjectId), while Better Auth exposes `id`. So **`session.user.id` is the string form of `user._id`**. When you query app collections by user, use `String(user._id)` as your foreign key:

```js
const userId = String(user._id)
db.collection('profiles').findOne({ userId })
```

### 7.3 Gotcha: orphaned profiles with `userId: null`

During development we ended up with a `profiles` document where `userId` was `null` (created before the user id was available). It sat there claiming a handle and blocking other users from using it. Guard against this by:

- Always writing `userId: user.id` in the signup hook, and
- Adding a cleanup script that deletes `userId: null` orphans:

```js
// scripts/cleanup-orphan-profiles.js (excerpt)
await db.collection('profiles').deleteMany({ userId: null })
```

### 7.4 Cookie configuration

- In production set `secure: true` (cookies only over HTTPS).
- Keep `sameSite: 'lax'` — required for the Google OAuth redirect flow.
- `tanstackStartCookies()` handles the actual cookie set/read through TanStack Start's server utilities — don't try to manage cookies manually.

### 7.5 Verification checklist

- [ ] **Sign up** with a new email → lands on the dashboard, profile auto-created
- [ ] **Sign in with Google** → returns to `/dashboard` with your Google name/avatar
- [ ] **Refresh the page** → still logged in (session persisted via cookie)
- [ ] **Log out** → returns to home
- [ ] **Visit `/dashboard` logged out** → redirected to `/login` (307)
- [ ] **Check MongoDB** → `user`, `session`, `account` collections populated; `profiles` has your doc with a unique `@handle`

---

## Quick Reference — Files You End Up With

```
src/
  lib/
    auth.js              # betterAuth() config (adapter, providers, hooks)
    auth-client.js       # createAuthClient() for the browser
    route-guard.js       # requireAuth() → redirect to /login
  routes/
    api.auth.$.jsx       # catch-all auth handler route
    login.jsx            # login/signup page using authClient
    dashboard.jsx        # protected route (beforeLoad: requireAuth)
  server/
    session.js           # getSessionUser / other server functions
```

That's it — a complete, working Google OAuth login with Better Auth on TanStack Start + MongoDB. 🚗
