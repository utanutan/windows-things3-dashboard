'use client'

/**
 * Global Error Component
 * Catches errors at the app level
 */

import { useEffect } from 'react'
import { Button } from '@/components/ui'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-8">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-4">
          <div className="p-3 rounded-full bg-status-error/10">
            <ExclamationTriangleIcon className="w-12 h-12 text-status-error" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-text-primary mb-2">
          Something went wrong!
        </h2>

        <p className="text-text-secondary mb-6">
          {error.message || 'An unexpected error occurred. Please try again.'}
        </p>

        <div className="flex gap-3 justify-center">
          <Button onClick={() => window.location.reload()} variant="secondary">
            Reload Page
          </Button>
          <Button onClick={reset}>Try Again</Button>
        </div>

        {error.digest && (
          <p className="mt-4 text-xs text-text-tertiary">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  )
}
