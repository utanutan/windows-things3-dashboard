/**
 * Today Tasks API Route
 * GET /api/tasks/today
 */

import { NextResponse } from 'next/server'
import { fetchJSON } from '@/lib/api/client'
import { clientConfig, serverConfig } from '@/lib/config'
import { mockTodayTasks } from '@/lib/mock'
import type { Task } from '@/lib/types'

export async function GET() {
  // Mock mode
  if (serverConfig.mockMode) {
    return NextResponse.json<Task[]>(mockTodayTasks)
  }

  // Real API mode
  try {
    // Mac API returns: {tasks: Task[], count: number}
    const response = await fetchJSON<{tasks: Task[], count: number}>(
      `${serverConfig.apiBaseUrl}/todos/today`
    )
    return NextResponse.json(response.tasks)
  } catch (error) {
    console.error('Failed to fetch today tasks:', error)
    // Return empty array to prevent client-side errors
    return NextResponse.json<Task[]>([])
  }
}
