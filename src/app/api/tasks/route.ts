/**
 * Task Creation API Route
 * POST /api/tasks
 */

import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { postJSON } from '@/lib/api/client'
import { serverConfig } from '@/lib/config'
import { validateTaskTitle, validateDateString, validateTags, validateNotes, sanitizeUserInput } from '@/lib/utils'
import { applyRateLimit, handleAPIError } from '@/lib/api-helpers'
import type { Task, CreateTaskRequest } from '@/lib/types'

export async function POST(request: NextRequest) {
  // Rate limiting: 10 requests per minute
  const rateLimitResponse = applyRateLimit(request, { windowMs: 60 * 1000, max: 10 })
  if (rateLimitResponse) return rateLimitResponse

  try {
    const body = await request.json() as CreateTaskRequest

    // Sanitize inputs
    body.title = sanitizeUserInput(body.title)
    if (body.notes) {
      body.notes = sanitizeUserInput(body.notes)
    }
    if (body.tags) {
      body.tags = body.tags.map(tag => sanitizeUserInput(tag))
    }

    // Validate required fields
    const titleValidation = validateTaskTitle(body.title)
    if (!titleValidation.valid) {
      return NextResponse.json({ error: titleValidation.error }, { status: 400 })
    }

    // Validate optional fields
    if (body.due_date) {
      const dateValidation = validateDateString(body.due_date)
      if (!dateValidation.valid) {
        return NextResponse.json({ error: dateValidation.error }, { status: 400 })
      }
    }

    if (body.tags) {
      const tagsValidation = validateTags(body.tags)
      if (!tagsValidation.valid) {
        return NextResponse.json({ error: tagsValidation.error }, { status: 400 })
      }
    }

    if (body.notes) {
      const notesValidation = validateNotes(body.notes)
      if (!notesValidation.valid) {
        return NextResponse.json({ error: notesValidation.error }, { status: 400 })
      }
    }

    // Mock mode: return mock created task
    if (serverConfig.mockMode) {
      const mockTask: Task = {
        id: `task-${Date.now()}`,
        title: body.title,
        notes: body.notes,
        due_date: body.due_date,
        tags: body.tags,
        status: 'open',
        project_id: body.project_id,
        area_id: body.area_id,
      }
      return NextResponse.json<Task>(mockTask, { status: 201 })
    }

    // Real API mode
    const createdTask = await postJSON<CreateTaskRequest, Task>(
      `${serverConfig.apiBaseUrl}/todos`,
      body
    )
    return NextResponse.json(createdTask, { status: 201 })
  } catch (error) {
    return handleAPIError(error, 'Create task')
  }
}
