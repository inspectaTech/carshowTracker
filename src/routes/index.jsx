import { createFileRoute } from '@tanstack/react-router'
import { Car, Calendar, Users, MapPin, ArrowRight, CheckCircle } from 'lucide-react'
import { useState, useEffect } from 'react'
import { checkDbHealth } from '../server/db-actions'

export const Route = createFileRoute('/')({ component: LandingPage })

function LandingPage() {
  const [dbStatus, setDbStatus] = useState({ success: false, message: 'Checking...' })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkDbStatus() {
      try {
        const data = await checkDbHealth()
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

  const features = [
    {
      icon: <Calendar className="h-8 w-8" />,
      title: 'Event Management',
      description: 'Create, organize, and manage car shows with ease. Schedule events, set dates, and track registrations.',
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: 'Participant Tracking',
      description: 'Keep track of participants, their vehicles, and registration status in real-time.',
    },
    {
      icon: <MapPin className="h-8 w-8" />,
      title: 'Venue Management',
      description: 'Manage multiple venues, map locations, and coordinate logistics for your car shows.',
    },
    {
      icon: <Car className="h-8 w-8" />,
      title: 'Vehicle Database',
      description: 'Maintain a comprehensive database of vehicles with photos, specs, and owner information.',
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-6">
              <Car className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Track & Manage <span className="text-blue-600 dark:text-blue-400">Car Shows</span> Like Never Before
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              The all-in-one platform for car show organizers. Streamline event planning, participant management, and venue coordination with our powerful tools.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/dashboard"
                className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
              <a
                href="/login"
                className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-blue-600 bg-white border border-blue-600 rounded-lg hover:bg-blue-50 dark:text-blue-400 dark:bg-gray-800 dark:border-blue-400 dark:hover:bg-gray-700 transition-colors"
              >
                Sign In
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Database Status Indicator */}
      <section className="py-8 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className={`rounded-lg p-6 ${
              dbStatus.success 
                ? 'bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800' 
                : 'bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${
                    dbStatus.success 
                      ? 'bg-green-100 text-green-600 dark:bg-green-800 dark:text-green-300' 
                      : 'bg-red-100 text-red-600 dark:bg-red-800 dark:text-red-300'
                  }`}>
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Database Connection Status
                    </h3>
                    <p className={`text-sm ${
                      dbStatus.success 
                        ? 'text-green-700 dark:text-green-300' 
                        : 'text-red-700 dark:text-red-300'
                    }`}>
                      {loading ? 'Checking connection...' : dbStatus.message}
                    </p>
                  </div>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {dbStatus.database && `Database: ${dbStatus.database}`}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Everything You Need for Car Show Management
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Our platform provides comprehensive tools to make car show organization seamless and efficient.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="inline-flex items-center justify-center p-3 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400 mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to Revolutionize Your Car Shows?
            </h2>
            <p className="text-blue-100 mb-8 text-lg">
              Join hundreds of organizers who trust CarShow Tracker for their event management needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/dashboard"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-blue-600 bg-white rounded-lg hover:bg-blue-50 transition-colors"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
              <a
                href="/login"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 transition-colors"
              >
                Sign In to Dashboard
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
