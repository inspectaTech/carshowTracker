import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tanstackStart(),
    tsconfigPaths({ projects: ['./jsconfig.json'] }),
    tailwindcss(),
    viteReact(),
  ],
  resolve: {
    alias: {
      // better-auth requires zod v4 APIs (e.g. .meta()), but the project's
      // top-level zod is v3 (pulled in by TanStack). The SSR bundle must use
      // the zod v4 that ships inside better-auth, or runtime fails with
      // "z.coerce.boolean(...).meta is not a function".
      zod: fileURLToPath(
        new URL('./node_modules/better-auth/node_modules/zod', import.meta.url)
      ),
    },
  },
  ssr: {
    // Bundle better-auth + its deps (including the aliased zod v4) into the
    // SSR output so the nested v4 is actually used at runtime.
    noExternal: ['better-auth', 'better-call', '@better-auth/*', 'zod'],
  },
})
