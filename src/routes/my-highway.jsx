import { createFileRoute } from '@tanstack/react-router'
import { requireAuth } from '#/lib/route-guard'
import HighwayPage from '#/components/highway/HighwayPage'

export const Route = createFileRoute('/my-highway')({
  beforeLoad: requireAuth,
  component: HighwayPage,
})
