/**
 * Area Detail API Route
 * GET /api/areas/[area_name]
 */

import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { fetchJSON } from '@/lib/api/client'
import { clientConfig, serverConfig } from '@/lib/config'
import { getMockAreaDetail } from '@/lib/mock'
import type { AreaDetail } from '@/lib/types'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ area_name: string }> }
) {
  const { area_name } = await params

  if (!area_name) {
    return NextResponse.json({ error: 'Area name is required' }, { status: 400 })
  }

  // Mock mode
  if (serverConfig.mockMode) {
    const areaDetail = getMockAreaDetail(area_name)
    if (!areaDetail) {
      return NextResponse.json({ error: 'Area not found' }, { status: 404 })
    }
    return NextResponse.json<AreaDetail>(areaDetail)
  }

  // Real API mode
  try {
    // Mac API /areas/{area_name} returns text summary, not structured data
    // Workaround: Fetch projects list and filter by area
    const projectsResponse = await fetchJSON<{projects: Project[], count: number}>(
      `${serverConfig.apiBaseUrl}/projects`
    )

    // Filter projects by area name
    // Mac API uses 'area' field, TypeScript type expects 'area_id'
    const areaProjects = projectsResponse.projects.filter(
      (p) => (p as any).area === area_name || p.area_id === area_name
    )

    // Return AreaDetail structure
    const areaDetail: AreaDetail = {
      projects: areaProjects,
      standalone_tasks: [] // Mac API doesn't provide standalone tasks endpoint
    }

    return NextResponse.json(areaDetail)
  } catch (error) {
    console.error(`Failed to fetch area detail for ${area_name}:`, error)
    // Return empty AreaDetail to prevent client-side errors
    return NextResponse.json<AreaDetail>({
      projects: [],
      standalone_tasks: []
    })
  }
}
