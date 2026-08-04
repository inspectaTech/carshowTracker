import { createFileRoute } from '@tanstack/react-router'
import { requireAuth } from '#/lib/route-guard'
import SettingsPage from '#/components/settings/SettingsPage'

export const Route = createFileRoute('/settings')({
  beforeLoad: requireAuth,
  component: SettingsPage,
})
