import { createFileRoute } from '@tanstack/react-router'
import EventsPage from '#/components/events/EventsPage'

export const Route = createFileRoute('/my-events')({ component: EventsPage })
