import { createServerFn } from '@tanstack/react-start'
import { checkDatabaseConnection } from '../lib/db'

export const checkDbHealth = createServerFn({ method: 'GET' })
  .handler(async () => {
    console.log('[CKDBHealth] attempting check');
    return await checkDatabaseConnection()
  })
