import { createFileRoute } from '@tanstack/react-router'
import { requireAuth } from '#/lib/route-guard'
import EventsPage from '#/components/events/EventsPage'

export const Route = createFileRoute('/my-events')({
  beforeLoad: requireAuth,
  component: EventsPage,
})
