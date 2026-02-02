'use client'

/**
 * Client-side providers
 */

import { SWRConfig } from 'swr'
import { ErrorBoundary } from '@/components/shared'

// Default fetcher for SWR
const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <SWRConfig
        value={{
          fetcher,
          // Cache configuration
          dedupingInterval: 2000, // Prevent duplicate requests within 2 seconds
          revalidateOnFocus: false, // Don't refetch when window regains focus
          revalidateIfStale: false, // Don't automatically revalidate stale data
          refreshInterval: 0, // Disable automatic polling (manual refresh only)
          shouldRetryOnError: true,
          // Keep data fresh for 5 minutes
          focusThrottleInterval: 300000,
        }}
      >
        {children}
      </SWRConfig>
    </ErrorBoundary>
  )
}
