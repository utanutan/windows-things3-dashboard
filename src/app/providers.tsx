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
          refreshInterval: 60000,
          revalidateOnFocus: true,
          shouldRetryOnError: true,
        }}
      >
        {children}
      </SWRConfig>
    </ErrorBoundary>
  )
}
