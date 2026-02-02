/**
 * Project Tasks API Route
 * GET /api/projects/[project_name]/tasks
 */

import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { fetchJSON } from '@/lib/api/client'
import { clientConfig, serverConfig } from '@/lib/config'
import { mockProjectTasks } from '@/lib/mock'
import type { Task } from '@/lib/types'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ project_name: string }> }
) {
  const { project_name } = await params

  if (!project_name) {
    return NextResponse.json(
      { error: 'Project name is required' },
      { status: 400 }
    )
  }

  // Mock mode
  if (serverConfig.mockMode) {
    // Return all mock project tasks (in real implementation, filter by project_name)
    return NextResponse.json<Task[]>(mockProjectTasks)
  }

  // Real API mode
  try {
    // Mac API returns: {tasks: Task[], count: number}
    const response = await fetchJSON<{tasks: Task[], count: number}>(
      `${serverConfig.apiBaseUrl}/projects/${encodeURIComponent(project_name)}/todos`
    )
    return NextResponse.json(response.tasks)
  } catch (error) {
    console.error(
      `Failed to fetch tasks for project ${project_name}:`,
      error
    )
    // Return empty array to prevent client-side errors
    return NextResponse.json<Task[]>([])
  }
}
