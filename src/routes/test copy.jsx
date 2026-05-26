import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/test copy')({ component: TestPage })

function TestPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
        Hello World Test
      </h1>
    </div>
  )
}
