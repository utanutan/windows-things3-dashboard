/**
 * Projects API Route
 * GET /api/projects - List all projects
 * POST /api/projects - Create new project
 */

import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { fetchJSON, postJSON } from '@/lib/api/client'
import { clientConfig, serverConfig } from '@/lib/config'
import { mockProjects } from '@/lib/mock'
import { validateProjectName, validateDateString, validateNotes } from '@/lib/utils'
import { createLogger } from '@/lib/logger'
import type { Project, CreateProjectRequest } from '@/lib/types'

const logger = createLogger({ route: 'api/projects' })

export async function GET() {
  logger.info('Fetching projects')
  // Mock mode
  if (serverConfig.mockMode) {
    return NextResponse.json<Project[]>(mockProjects)
  }

  // Real API mode
  try {
    // Mac API returns wrapped response: {projects: Project[], count: number}
    const response = await fetchJSON<{ projects: Project[], count: number }>(
      `${serverConfig.apiBaseUrl}/projects`
    )
    return NextResponse.json(response.projects)
  } catch (error) {
    logger.error({ error }, 'Failed to fetch projects')
    // Return empty array to prevent client-side errors
    return NextResponse.json<Project[]>([])
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as CreateProjectRequest

    // Validate required fields
    const nameValidation = validateProjectName(body.name)
    if (!nameValidation.valid) {
      return NextResponse.json({ error: nameValidation.error }, { status: 400 })
    }

    // Validate optional fields
    if (body.deadline) {
      const dateValidation = validateDateString(body.deadline)
      if (!dateValidation.valid) {
        return NextResponse.json({ error: dateValidation.error }, { status: 400 })
      }
    }

    if (body.notes) {
      const notesValidation = validateNotes(body.notes)
      if (!notesValidation.valid) {
        return NextResponse.json({ error: notesValidation.error }, { status: 400 })
      }
    }

    // Mock mode: return mock created project
    if (serverConfig.mockMode) {
      const mockProject: Project = {
        id: `project-${Date.now()}`,
        name: body.name,
        task_count: 0,
        area_id: body.area_id,
      }
      return NextResponse.json<Project>(mockProject, { status: 201 })
    }

    // Real API mode
    const createdProject = await postJSON<CreateProjectRequest, Project>(
      `${serverConfig.apiBaseUrl}/projects`,
      body
    )
    return NextResponse.json(createdProject, { status: 201 })
  } catch (error) {
    logger.error({ error }, 'Failed to create project')
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    )
  }
}
