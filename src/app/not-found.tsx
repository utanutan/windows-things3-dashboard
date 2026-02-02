/**
 * Custom 404 Page
 * Shown when a route is not found
 */

import Link from 'next/link'
import { Button } from '@/components/ui'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-8">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-4">
          <div className="p-3 rounded-full bg-text-tertiary/10">
            <MagnifyingGlassIcon className="w-12 h-12 text-text-tertiary" />
          </div>
        </div>

        <h1 className="text-6xl font-bold text-text-primary mb-2">404</h1>

        <h2 className="text-2xl font-semibold text-text-primary mb-2">
          Page Not Found
        </h2>

        <p className="text-text-secondary mb-6">
          The page you are looking for doesn't exist or has been moved.
        </p>

        <div className="flex gap-3 justify-center">
          <Link href="/">
            <Button>Go to Inbox</Button>
          </Link>
          <Link href="/areas">
            <Button variant="secondary">Browse Areas</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
