import { createFileRoute } from '@tanstack/react-router'
import { Car, Calendar, Users, MapPin, ArrowRight, CheckCircle } from 'lucide-react'
import { useState, useEffect } from 'react'
import { checkDbHealth } from '../server/db-actions'
import HeroScroll from '../components/HeroScroll'

export const Route = createFileRoute('/test')({ component: TestPage })

function TestPage() {
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
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Hero Section */}
      <HeroScroll 
        headline="CARSHOW TRACKER"
        feature1="ELITE PERFORMANCE"
        feature2="SYSTEM PRECISION"
        cta="JOIN THE TRACKER"
        ctab="EXPLORE NOW"
        // frameCount={21}

        // folderPath="/public/animations/hero-test-001"
        // folderPath="/animations/hero-test-002"
        mobileFrameCount={21}
        mobileFolderPath="/animations/hero-test-002"
        lastFrameHold={0.4}
        mobileLastFrameHold={0.1}
      />



      {/* Database Status Indicator */}
      <section className="py-8 bg-[#0a0a0a]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className={`rounded-lg p-6 border ${
              dbStatus.success 
                ? 'bg-green-900/10 border-green-800/50' 
                : 'bg-red-900/10 border-red-800/50'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${
                    dbStatus.success 
                      ? 'bg-green-900/30 text-green-400' 
                      : 'bg-red-900/30 text-red-400'
                  }`}>
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white/90">
                      Database Connection Status
                    </h3>
                    <p className={`text-sm ${
                      dbStatus.success 
                        ? 'text-green-400/80' 
                        : 'text-red-400/80'
                    }`}>
                      {loading ? 'Checking connection...' : dbStatus.message}
                    </p>
                  </div>
                </div>
                <div className="text-sm text-white/40 font-mono">
                  {dbStatus.database && `DB: ${dbStatus.database}`}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-[#050505]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white/90 mb-4">
                Everything You Need for Car Show Management
              </h2>
              <p className="text-white/60">
                Our platform provides comprehensive tools to make car show organization seamless and efficient.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="bg-[#0a0a0a] border border-white/5 rounded-xl p-6 hover:border-white/20 transition-all group"
                >
                  <div className="inline-flex items-center justify-center p-3 rounded-lg bg-white/5 text-white/80 group-hover:bg-white/10 transition-colors mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white/90 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-white/60">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-[#050505] to-[#0a0a0a] border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to Revolutionize Your Car Shows?
            </h2>
            <p className="text-white/60 mb-8 text-lg">
              Join hundreds of organizers who trust CarShow Tracker for their event management needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/dashboard"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-black bg-white rounded-lg hover:bg-white/90 transition-all transform hover:scale-105"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
              <a
                href="/login"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white border border-white/10 rounded-lg hover:bg-white/5 transition-all"
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
