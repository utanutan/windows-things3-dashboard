/**
 * Health Check Hook
 */

import useSWR from 'swr'
import type { HealthResponse } from '@/lib/types'

async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error('Health check failed')
  }
  return res.json()
}

/**
 * Hook for health check
 * Polls every 10 seconds to monitor API connection status
 */
export function useHealth() {
  return useSWR<HealthResponse>('/api/health', fetcher, {
    refreshInterval: 10000, // Check every 10 seconds
    revalidateOnFocus: false,
    shouldRetryOnError: true,
    errorRetryCount: 3,
    errorRetryInterval: 5000,
  })
}
