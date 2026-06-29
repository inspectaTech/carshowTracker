import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/garage')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/garage"!</div>
}
