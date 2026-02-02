'use client'

/**
 * Search Page
 * Shows search results
 */

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { TaskList, TaskListSkeleton } from '@/components/tasks'
import { useSearch as useSearchHook, toggleTaskComplete } from '@/hooks/useTasks'
import { useModal, useSelectedTask, useToasts } from '@/stores/uiStore'
import { mutate as globalMutate } from 'swr'

function SearchContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''

  const { data: tasks, isLoading, error } = useSearchHook(query)
  const { open } = useModal()
  const { setTaskId } = useSelectedTask()
  const { add: addToast } = useToasts()

  const handleToggleComplete = async (taskId: string) => {
    const task = tasks?.find((t) => t.id === taskId)
    if (!task) return

    try {
      // Update the search results cache
      const searchKey = `/api/tasks/search?q=${encodeURIComponent(query)}`
      await toggleTaskComplete(
        task.id,
        task.status,
        searchKey,
        (newStatus) => {
          addToast(
            newStatus === 'completed'
              ? 'Task completed!'
              : 'Task reopened',
            'success'
          )
          // Invalidate other caches
          globalMutate('/api/tasks/inbox')
          globalMutate('/api/tasks/today')
          globalMutate('/api/tasks/upcoming')
        },
        (error) => {
          addToast('Failed to update task', 'error')
        }
      )
    } catch (error) {
      console.error('Failed to toggle task:', error)
    }
  }

  const handleTaskClick = (taskId: string) => {
    setTaskId(taskId)
    open('task-detail')
  }

  const handleNewTask = () => {
    open('task-create')
  }

  if (!query || query.length < 2) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center">
          <p className="text-text-secondary">
            Enter at least 2 characters to search
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center">
          <p className="text-status-error mb-2">Search failed</p>
          <p className="text-sm text-text-secondary">{error.message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full">
      <div className="border-b border-border-light bg-white px-8 py-6">
        <h1 className="text-2xl font-bold text-text-primary">
          Search Results
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          {isLoading
            ? 'Searching...'
            : `${tasks?.length || 0} results for "${query}"`}
        </p>
      </div>

      {isLoading ? (
        <TaskListSkeleton count={5} />
      ) : (
        <TaskList
          tasks={tasks || []}
          onToggleComplete={handleToggleComplete}
          onTaskClick={handleTaskClick}
          onNewTask={handleNewTask}
          emptyTitle="No results found"
          emptyDescription={`No tasks found matching "${query}"`}
        />
      )}
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-full p-8">
          <div className="text-center">
            <p className="text-text-secondary">Loading search...</p>
          </div>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  )
}
