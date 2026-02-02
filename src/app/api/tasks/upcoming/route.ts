/**
 * Upcoming Tasks API Route
 * GET /api/tasks/upcoming
 *
 * NOTE: /todos/upcoming endpoint is not yet implemented on Mac API server
 * This route returns an empty array as a temporary workaround
 */

import { NextResponse } from 'next/server'
import { serverConfig } from '@/lib/config'
import { mockUpcomingTasks } from '@/lib/mock'
import type { Task } from '@/lib/types'

export async function GET() {
  // Mock mode
  if (serverConfig.mockMode) {
    return NextResponse.json<Task[]>(mockUpcomingTasks)
  }

  // Real API mode
  // TEMPORARY: Return empty array since /todos/upcoming is not implemented on Mac API
  // TODO: Once Mac API implements /todos/upcoming, uncomment the fetch code below
  console.log('Upcoming endpoint not implemented on Mac API, returning empty array')
  return NextResponse.json<Task[]>([])

  /* Uncomment when Mac API implements /todos/upcoming:
  try {
    const response = await fetch(`${serverConfig.apiBaseUrl}/todos/upcoming`, {
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(5000), // 5 second timeout
    })

    if (!response.ok) {
      console.warn(`Upcoming API returned ${response.status}, falling back to empty array`)
      return NextResponse.json<Task[]>([])
    }

    const tasks = await response.json()
    return NextResponse.json(tasks)
  } catch (error) {
    console.error('Failed to fetch upcoming tasks:', error)
    return NextResponse.json<Task[]>([])
  }
  */
}
