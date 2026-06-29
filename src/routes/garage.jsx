import { createFileRoute } from '@tanstack/react-router'
import GaragePage from '#/components/garage/GaragePage'

export const Route = createFileRoute('/garage')({ component: GaragePage })
