import { createFileRoute } from '@tanstack/react-router'
import EventDetailPage from '#/components/events/EventDetailPage'
import { getEventBySlugId } from '#/server/events'

export const Route = createFileRoute('/event/$slugId')({
  // Public by design — event pages are shareable links (no requireAuth).
  loader: async ({ params }) => {
    const result = await getEventBySlugId({ data: { slugId: params.slugId } })
    return { event: result?.event || null }
  },
  component: EventDetailPage,
})
