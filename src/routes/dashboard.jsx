import { createFileRoute, Link, Navigate } from '@tanstack/react-router'
import { Car, Calendar, Users, MapPin, Settings, LogOut, Bell, Search, Plus, Filter, BarChart } from 'lucide-react'
import { useState, useEffect } from 'react'

export const Route = createFileRoute('/dashboard')({ component: DashboardPage })

function DashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(true) // Placeholder for auth
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState([
    { label: 'Total Events', value: '12', change: '+2', icon: <Calendar className="h-5 w-5" />, color: 'bg-blue-500' },
    { label: 'Participants', value: '342', change: '+24', icon: <Users className="h-5 w-5" />, color: 'bg-green-500' },
    { label: 'Venues', value: '8', change: '+1', icon: <MapPin className="h-5 w-5" />, color: 'bg-purple-500' },
    { label: 'Vehicles', value: '156', change: '+18', icon: <Car className="h-5 w-5" />, color: 'bg-orange-500' },
  ])

  const [recentEvents, setRecentEvents] = useState([
    { id: 1, name: 'Summer Classic Car Show', date: '2024-06-15', participants: 85, status: 'upcoming' },
    { id: 2, name: 'Vintage Muscle Meet', date: '2024-05-20', participants: 64, status: 'completed' },
    { id: 3, name: 'Modern Supercar Expo', date: '2024-07-10', participants: 42, status: 'upcoming' },
    { id: 4, name: 'Truck & SUV Rally', date: '2024-04-28', participants: 93, status: 'completed' },
  ])

  useEffect(() => {
    // Simulate loading user data
    setTimeout(() => {
      setLoading(false)
    }, 500)
  }, [])

  const handleLogout = () => {
    setIsAuthenticated(false)
    // In real implementation, this would clear auth tokens and redirect
    alert('Logout functionality will be implemented with Auth.js')
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Dashboard Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-400">Welcome back! Here's what's happening with your car shows.</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200">
                <Bell className="h-5 w-5" />
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30 rounded-lg transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stat.value}</p>
                  <div className="flex items-center mt-1">
                    <span className="text-sm text-green-600 dark:text-green-400 font-medium">{stat.change} this month</span>
                  </div>
                </div>
                <div className={`${stat.color} p-3 rounded-full text-white`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Recent Events */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow mb-8">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Events</h2>
                  <Link
                    to="/events"
                    className="inline-flex items-center space-x-2 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    <span>View all</span>
                    <Plus className="h-4 w-4" />
                  </Link>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Event Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Participants
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {recentEvents.map((event) => (
                      <tr key={event.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{event.name}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {new Date(event.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-600 dark:text-gray-400">{event.participants}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            event.status === 'upcoming'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                              : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          }`}>
                            {event.status === 'upcoming' ? 'Upcoming' : 'Completed'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Link
                    to="/events/create"
                    className="flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-blue-500 hover:bg-blue-50 dark:hover:border-blue-400 dark:hover:bg-blue-900/20 transition-colors"
                  >
                    <Plus className="h-5 w-5 text-gray-400" />
                    <span className="font-medium text-gray-700 dark:text-gray-300">Create New Event</span>
                  </Link>
                  <Link
                    to="/participants"
                    className="flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-green-500 hover:bg-green-50 dark:hover:border-green-400 dark:hover:bg-green-900/20 transition-colors"
                  >
                    <Users className="h-5 w-5 text-gray-400" />
                    <span className="font-medium text-gray-700 dark:text-gray-300">Manage Participants</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Profile Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow">
              <div className="p-6">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                    <span className="text-white text-xl font-bold">JD</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">John Doe</h3>
                    <p className="text-gray-600 dark:text-gray-400">Event Organizer</p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">john@example.com</p>
                  </div>
                </div>
                <Link
                  to="/profile"
                  className="w-full flex items-center justify-center space-x-2 py-2 px-4 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                >
                  <Settings className="h-4 w-4" />
                  <span>Edit Profile</span>
                </Link>
              </div>
            </div>

            {/* Upcoming Deadlines */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Upcoming Deadlines</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {[
                    { event: 'Summer Classic Car Show', deadline: '2024-06-01', type: 'Registration closes' },
                    { event: 'Modern Supercar Expo', deadline: '2024-06-20', type: 'Venue payment due' },
                    { event: 'Annual Car Meet', deadline: '2024-07-05', type: 'Sponsor materials due' },
                  ].map((item, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                          <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{item.event}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{item.type}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          Due {new Date(item.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}