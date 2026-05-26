import { Link } from '@tanstack/react-router'
import { Car, Database, Github, Heart } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Footer() {
  const [dbStatus, setDbStatus] = useState({ success: false, message: 'Checking...' })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkDbStatus() {
      try {
        const response = await fetch('/api/health')
        const data = await response.json()
        setDbStatus(data)
      } catch (error) {
        setDbStatus({ 
          success: false, 
          message: 'Failed to check database connection' 
        })
      } finally {
        setLoading(false)
      }
    }
    
    checkDbStatus()
  }, [])

  return (
    <footer className="border-t border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Car className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                CarShow<span className="text-blue-600 dark:text-blue-400">Tracker</span>
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Track and manage car shows with ease. Built with TanStack Start and MongoDB.
            </p>
            <div className="flex items-center space-x-2">
              <Database className={`h-4 w-4 ${
                dbStatus.success ? 'text-green-500' : 'text-red-500'
              }`} />
              <span className={`text-sm font-medium ${
                dbStatus.success ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {loading ? 'Checking DB...' : dbStatus.success ? 'DB Connected' : 'DB Offline'}
              </span>
            </div>
          </div>

          {/* Links Section */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                >
                  Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Tech Stack Section */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Built With</h3>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                TanStack Start
              </span>
              <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
                React
              </span>
              <span className="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                MongoDB
              </span>
              <span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                Tailwind
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-300 dark:border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
              <Heart className="h-4 w-4 text-red-500" />
              <span className="text-sm">Made with passion for car enthusiasts</span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              © {new Date().getFullYear()} CarShow Tracker. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}