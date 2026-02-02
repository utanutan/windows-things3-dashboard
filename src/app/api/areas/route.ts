/**
 * Areas List API Route
 * GET /api/areas
 */

import { NextResponse } from 'next/server'
import { fetchJSON } from '@/lib/api/client'
import { clientConfig, serverConfig } from '@/lib/config'
import { mockAreas } from '@/lib/mock'
import type { Area } from '@/lib/types'

export async function GET() {
  // Mock mode
  if (serverConfig.mockMode) {
    return NextResponse.json<Area[]>(mockAreas)
  }

  // Real API mode
  try {
    // Mac API returns wrapped response: {areas: Area[], count: number}
    const response = await fetchJSON<{areas: Area[], count: number}>(`${serverConfig.apiBaseUrl}/areas`)
    return NextResponse.json(response.areas)
  } catch (error) {
    console.error('Failed to fetch areas:', error)
    // Return empty array to prevent client-side errors
    return NextResponse.json<Area[]>([])
  }
}
