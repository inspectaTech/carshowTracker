import { Link, useLocation } from '@tanstack/react-router'
import { Car, LogIn, User, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  const isDash2 = location.pathname === '/dash2'

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-gray-800 dark:bg-gray-900/95 supports-[backdrop-filter]:dark:bg-gray-900/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Car className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <Link to="/" className="text-xl font-bold text-gray-900 dark:text-white">
              CarShow<span className="text-blue-600 dark:text-blue-400">Tracker</span>
            </Link>
          </div>

          {/* Desktop Navigation - hidden on dash2 page */}
          {!isDash2 && (
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                to="/"
                className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
                activeProps={{ className: 'text-blue-600 dark:text-blue-400 font-semibold' }}
              >
                Home
              </Link>
              <Link
                to="/test"
                className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
                activeProps={{ className: 'text-blue-600 dark:text-blue-400 font-semibold' }}
              >
                Test
              </Link>
              <Link
                to="/dashboard"
                className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
                activeProps={{ className: 'text-blue-600 dark:text-blue-400 font-semibold' }}
              >
                Dashboard
              </Link>
              <Link
                to="/dash2"
                className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
                activeProps={{ className: 'text-blue-600 dark:text-blue-400 font-semibold' }}
              >
                Dash2
              </Link>

              <Link
                to="/login"
                className="inline-flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
              >
                <LogIn className="h-4 w-4" />
                <span>Sign In</span>
              </Link>
            </nav>
          )}

          {/* Hamburger Menu Button - always visible on dash2, mobile-only elsewhere */}
          <button
            className={`text-gray-700 dark:text-gray-300 ${isDash2 ? '' : 'md:hidden'}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Overlay Navigation Menu - fixed positioning */}
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={() => setIsMenuOpen(false)}
          />
          {/* Menu Panel */}
          <div className="fixed inset-x-0 top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 shadow-xl">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Car className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                    CarShow<span className="text-blue-600 dark:text-blue-400">Tracker</span>
                  </span>
                </div>
                <button
                  className="text-gray-700 dark:text-gray-300"
                  onClick={() => setIsMenuOpen(false)}
                  aria-label="Close navigation menu"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="container mx-auto px-4 pb-6">
              <div className="flex flex-col space-y-3">
                <Link
                  to="/"
                  className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 py-3 text-lg font-medium transition-colors border-b border-gray-100 dark:border-gray-800"
                  activeProps={{ className: 'text-blue-600 dark:text-blue-400 font-semibold' }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  to="/test"
                  className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 py-3 text-lg font-medium transition-colors border-b border-gray-100 dark:border-gray-800"
                  activeProps={{ className: 'text-blue-600 dark:text-blue-400 font-semibold' }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Test
                </Link>
                <Link
                  to="/dashboard"
                  className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 py-3 text-lg font-medium transition-colors border-b border-gray-100 dark:border-gray-800"
                  activeProps={{ className: 'text-blue-600 dark:text-blue-400 font-semibold' }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/dash2"
                  className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 py-3 text-lg font-medium transition-colors border-b border-gray-100 dark:border-gray-800"
                  activeProps={{ className: 'text-blue-600 dark:text-blue-400 font-semibold' }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dash2
                </Link>

                <Link
                  to="/login"
                  className="inline-flex items-center justify-center space-x-2 rounded-lg bg-blue-600 px-4 py-3 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors mt-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <LogIn className="h-5 w-5" />
                  <span className="text-lg font-medium">Sign In</span>
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  )
}
