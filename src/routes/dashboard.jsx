import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import Sidebar from '#/components/dashboard/Sidebar'
import TopSection, { TopActions } from '#/components/dashboard/TopSection'
import AboutMe from '#/components/dashboard/AboutMe'
import MyGarage from '#/components/dashboard/MyGarage'
import MyHighway from '#/components/dashboard/MyHighway'
import { getDashboardData, getDataSourceStatus } from '#/server/db-actions'

export const Route = createFileRoute('/dashboard')({ component: DashboardPage })

function DashboardPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [dataSourceInfo, setDataSourceInfo] = useState({ source: '', dbAvailable: false })

  useEffect(() => {
    async function loadData() {
      try {
        const [statusResult, dashboardResult] = await Promise.all([
          getDataSourceStatus(),
          getDashboardData({ data: { userId: 'user_001' } }),
        ])

        setDataSourceInfo(statusResult)
        setData(dashboardResult)
      } catch (err) {
        console.error('[Dashboard] Failed to load data:', err)
        setError(err.message || 'Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#04080b] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-[#e10908] border-t-transparent mx-auto" />
          <p className="mt-4 text-[#AAAAAA] text-[16px]">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#04080b] flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-[#e10908] text-[48px] mb-4">!</div>
          <h2 className="text-white text-[24px] font-semibold mb-2">Failed to Load Dashboard</h2>
          <p className="text-[#AAAAAA] text-[16px] mb-4">
            {error || 'Could not retrieve dashboard data.'}
          </p>
          <p className="text-[#888888] text-[14px]">
            Make sure MongoDB is running and has seed data, or the JSON fallback will be used automatically.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-2 bg-[#e10908] text-white rounded-lg hover:bg-[#c00807] transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  const { profile, vehicles, activities } = data

  return (
    <div className="min-h-screen bg-[#04080b] flex">
      <Sidebar profile={profile} activeNav="dashboard" dataSourceInfo={dataSourceInfo} />

      <main className="flex-1 flex flex-col gap-4 p-5 pt-16 lg:pt-5 overflow-y-auto relative">
        <TopActions />
        <TopSection profile={profile} />

        <div className="flex flex-col lg:flex-row gap-2.5 flex-1 min-h-0">
          <AboutMe profile={profile} />

          <div className="flex flex-col gap-2.5 flex-1">
            <div className="lg:h-[201px]">
              <MyGarage vehicles={vehicles} />
            </div>
            <div className="flex-1">
              <MyHighway activities={activities} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
