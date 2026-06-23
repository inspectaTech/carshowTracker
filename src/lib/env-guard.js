/**
 * Environment guard — prevents dangerous operations in production
 * unless explicitly enabled via environment variables.
 *
 * Usage on the sandbox (no DB):
 *   Everything is read-only → uploads, deletes, and seed are all blocked.
 *   The dashboard still renders perfectly from the JSON fallback.
 *
 * Usage in dev with DB:
 *   Set ALLOW_UPLOADS=true and ALLOW_SEED=true in your .env or shell.
 */

export function isUploadAllowed() {
  return process.env.ALLOW_UPLOADS === 'true'
}

export function isSeedAllowed() {
  return (
    process.env.NODE_ENV === 'development' ||
    process.env.ALLOW_SEED === 'true'
  )
}

export function isDeleteAllowed() {
  return process.env.ALLOW_UPLOADS === 'true'
}

export function guardMessage(action) {
  return {
    success: false,
    message: `${action} is disabled in the current environment. Set ALLOW_UPLOADS=true or run in development mode to enable.`,
  }
}
