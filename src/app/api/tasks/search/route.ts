/**
 * Task Search API Route
 * GET /api/tasks/search?q=query
 */

import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { fetchJSON } from '@/lib/api/client'
import { clientConfig, serverConfig } from '@/lib/config'
import { searchMockTasks } from '@/lib/mock'
import { validateSearchQuery } from '@/lib/utils'
import type { Task } from '@/lib/types'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q')

  if (!query) {
    return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 })
  }

  // Validate query
  const validation = validateSearchQuery(query)
  if (!validation.valid) {
    return NextResponse.json({ error: validation.error }, { status: 400 })
  }

  // Mock mode
  if (serverConfig.mockMode) {
    const results = searchMockTasks(query)
    return NextResponse.json<Task[]>(results)
  }

  // Real API mode
  try {
    // Mac API returns: {tasks: Task[], count: number}
    const response = await fetchJSON<{tasks: Task[], count: number}>(
      `${serverConfig.apiBaseUrl}/todos/search?q=${encodeURIComponent(query)}`
    )
    return NextResponse.json(response.tasks)
  } catch (error) {
    console.error('Failed to search tasks:', error)
    // Return empty array to prevent client-side errors
    return NextResponse.json<Task[]>([])
  }
}
