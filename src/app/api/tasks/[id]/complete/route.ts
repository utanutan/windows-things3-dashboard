/**
 * Task Complete API Route
 * PUT /api/tasks/[id]/complete
 */

import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { putJSON } from '@/lib/api/client'
import { serverConfig } from '@/lib/config'
import { getMockTaskById } from '@/lib/mock'
import { applyRateLimit, handleAPIError } from '@/lib/api-helpers'
import type { Task } from '@/lib/types'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Rate limiting: 20 requests per minute
  const rateLimitResponse = applyRateLimit(request, { windowMs: 60 * 1000, max: 20 })
  if (rateLimitResponse) return rateLimitResponse

  const { id } = await params

  if (!id) {
    return NextResponse.json({ error: 'Task ID is required' }, { status: 400 })
  }

  // Mock mode
  if (serverConfig.mockMode) {
    const mockTask = getMockTaskById(id)
    if (!mockTask) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    // Return completed task
    const completedTask: Task = {
      ...mockTask,
      status: 'completed',
    }
    return NextResponse.json<Task>(completedTask)
  }

  // Real API mode
  try {
    const completedTask = await putJSON<{ status: string }, Task>(
      `${serverConfig.apiBaseUrl}/todos/${id}/complete`,
      { status: 'completed' }
    )
    return NextResponse.json(completedTask)
  } catch (error) {
    return handleAPIError(error, `Complete task ${id}`)
  }
}
