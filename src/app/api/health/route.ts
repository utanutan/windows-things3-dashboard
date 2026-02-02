/**
 * Health Check API Route
 * GET /api/health
 */

import { NextResponse } from 'next/server'
import { fetchJSON } from '@/lib/api/client'
import { clientConfig, serverConfig } from '@/lib/config'
import type { HealthResponse } from '@/lib/types'

export async function GET() {
  // Mock mode: return mock health response
  if (serverConfig.mockMode) {
    return NextResponse.json<HealthResponse>({
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: '1.0.0-mock',
    })
  }

  // Real API mode: proxy to Mac API
  try {
    const health = await fetchJSON<HealthResponse>(
      `${serverConfig.apiBaseUrl}/health`,
      { timeout: 5000 }
    )
    return NextResponse.json(health)
  } catch (error) {
    console.error('Health check failed:', error)
    return NextResponse.json<HealthResponse>(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    )
  }
}
