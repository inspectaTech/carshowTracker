import { createFileRoute } from '@tanstack/react-router'
import { requireAuth } from '#/lib/route-guard'
import GaragePage from '#/components/garage/GaragePage'

export const Route = createFileRoute('/garage')({
  beforeLoad: requireAuth,
  component: GaragePage,
})
