import { createFileRoute } from '@tanstack/react-router'
import HighwayPage from '#/components/highway/HighwayPage'

export const Route = createFileRoute('/my-highway')({ component: HighwayPage })
