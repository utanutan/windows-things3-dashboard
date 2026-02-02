/**
 * SWR Hooks for Task Data Fetching
 */

import useSWR, { mutate as globalMutate } from 'swr'
import type { Task, CreateTaskRequest } from '@/lib/types'

/**
 * Fetcher function for SWR with improved error handling
 */
async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) {
    // Try to get error details from response
    let errorMessage = `HTTP ${res.status}: ${res.statusText}`
    try {
      const errorData = await res.json()
      if (errorData.error) {
        errorMessage = errorData.error
      }
    } catch {
      // If JSON parsing fails, use status text
    }
    const error = new Error(errorMessage)
    throw error
  }
  return res.json()
}

/**
 * Hook for inbox tasks
 */
export function useInbox() {
  return useSWR<Task[]>('/api/tasks/inbox', fetcher, {
    refreshInterval: 60000, // Auto-refresh every 60 seconds
    revalidateOnFocus: true,
    dedupingInterval: 2000,
  })
}

/**
 * Hook for today tasks
 */
export function useToday() {
  return useSWR<Task[]>('/api/tasks/today', fetcher, {
    refreshInterval: 60000,
    revalidateOnFocus: true,
    dedupingInterval: 2000,
  })
}

/**
 * Hook for upcoming tasks
 */
export function useUpcoming() {
  return useSWR<Task[]>('/api/tasks/upcoming', fetcher, {
    refreshInterval: 60000,
    revalidateOnFocus: true,
    dedupingInterval: 2000,
  })
}

/**
 * Hook for search results
 */
export function useSearch(query: string) {
  const shouldFetch = query.length >= 2
  return useSWR<Task[]>(
    shouldFetch ? `/api/tasks/search?q=${encodeURIComponent(query)}` : null,
    fetcher,
    {
      dedupingInterval: 500,
      revalidateOnFocus: false,
    }
  )
}

/**
 * Complete a task (optimistic update)
 */
export async function completeTask(taskId: string): Promise<Task> {
  const res = await fetch(`/api/tasks/${taskId}/complete`, {
    method: 'PUT',
  })

  if (!res.ok) {
    throw new Error('Failed to complete task')
  }

  return res.json()
}

/**
 * Create a new task
 */
export async function createTask(
  task: CreateTaskRequest
): Promise<Task> {
  const res = await fetch('/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  })

  if (!res.ok) {
    throw new Error('Failed to create task')
  }

  return res.json()
}

/**
 * Optimistic toggle task completion
 *
 * @param taskId - Task ID to toggle
 * @param currentStatus - Current task status
 * @param mutateKey - SWR cache key to update
 * @param onSuccess - Callback on success (for toast notification)
 * @param onError - Callback on error (for toast notification)
 */
export async function toggleTaskComplete(
  taskId: string,
  currentStatus: 'open' | 'completed',
  mutateKey: string,
  onSuccess?: (newStatus: 'open' | 'completed') => void,
  onError?: (error: Error) => void
) {
  const newStatus = currentStatus === 'open' ? 'completed' : 'open'

  // Optimistic update
  await globalMutate<Task[]>(
    mutateKey,
    async (tasks) => {
      if (!tasks) return tasks
      return tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: newStatus,
            }
          : task
      )
    },
    { revalidate: false }
  )

  try {
    // API call
    if (currentStatus === 'open') {
      await completeTask(taskId)
    }
    // Revalidate to sync with server
    await globalMutate(mutateKey)

    // Success callback
    onSuccess?.(newStatus)
  } catch (error) {
    // Rollback on error
    await globalMutate(mutateKey)

    // Error callback
    onError?.(error as Error)

    throw error
  }
}
