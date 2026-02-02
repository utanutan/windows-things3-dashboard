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
    // Fetch projects list and filter by area
    const projectsResponse = await fetchJSON<{projects: Project[], count: number}>(
      `${serverConfig.apiBaseUrl}/projects`
    )

    // Filter projects by area name
    // Mac API uses 'area' field, TypeScript type expects 'area_id'
    const areaProjects = projectsResponse.projects.filter(
      (p) => (p as any).area === area_name || p.area_id === area_name
    )

    // Try to fetch standalone tasks for this area
    let standaloneTasks: Task[] = []
    try {
      // Try endpoint: /areas/{area_name}/todos
      const tasksResponse = await fetchJSON<{tasks: Task[], count: number}>(
        `${serverConfig.apiBaseUrl}/areas/${encodeURIComponent(area_name)}/todos`
      )
      standaloneTasks = tasksResponse.tasks
    } catch (tasksError) {
      console.warn(`No standalone tasks endpoint for area ${area_name}, trying alternative...`)
      // Alternative: try /todos?area={area_name}
      try {
        const tasksResponse = await fetchJSON<{tasks: Task[], count: number}>(
          `${serverConfig.apiBaseUrl}/todos?area=${encodeURIComponent(area_name)}`
        )
        standaloneTasks = tasksResponse.tasks
      } catch (altError) {
        console.warn(`Alternative endpoint also failed for area ${area_name}`)
        // If both fail, standalone_tasks will remain empty array
      }
    }

    // Return AreaDetail structure
    const areaDetail: AreaDetail = {
      projects: areaProjects,
      standalone_tasks: standaloneTasks
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
