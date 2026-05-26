import { createFileRoute } from '@tanstack/react-router'
import { json } from '@tanstack/react-start'
import { checkDatabaseConnection } from '../lib/db'

export const Route = createFileRoute('/api/health')({
  server: {
    handlers: {
      GET: async () => {
        try {
          const dbStatus = await checkDatabaseConnection()
          
          return json({
            success: dbStatus.success,
            message: dbStatus.message,
            database: dbStatus.database,
            timestamp: new Date().toISOString(),
            status: dbStatus.success ? 'healthy' : 'unhealthy'
          })
        } catch (error) {
          return json({
            success: false,
            message: `Database health check failed: ${error.message}`,
            timestamp: new Date().toISOString(),
            status: 'error'
          }, { status: 500 })
        }
      },
    },
  },
})