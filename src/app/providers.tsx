'use client'

/**
 * Client-side providers
 */

import { SWRConfig } from 'swr'
import { ErrorBoundary } from '@/components/shared'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <SWRConfig
        value={{
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
