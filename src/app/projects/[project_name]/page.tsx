'use client'

/**
 * Project Detail Page
 * Shows tasks belonging to a specific project
 */

import { useParams, useRouter } from 'next/navigation'
import useSWR from 'swr'
import { TaskList, TaskListSkeleton } from '@/components/tasks'
import { useModal, useSelectedTask, useToasts } from '@/stores/uiStore'
import { toggleTaskComplete } from '@/hooks/useTasks'
import { RectangleStackIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'
import type { Task } from '@/lib/types'

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const projectName = decodeURIComponent(params.project_name as string)

  const { data: tasks, isLoading, error, mutate } = useSWR<Task[]>(
    `/api/projects/${encodeURIComponent(projectName)}/tasks`
  )

  const { open } = useModal()
  const { setTaskId } = useSelectedTask()
  const { add: addToast } = useToasts()

  const handleToggleComplete = async (taskId: string) => {
    const task = tasks?.find((t) => t.id === taskId)
    if (!task) return

    try {
      await toggleTaskComplete(
        task.id,
        task.status,
        `/api/projects/${encodeURIComponent(projectName)}/tasks`,
        (newStatus) => {
          addToast(
            newStatus === 'completed'
              ? 'Task completed!'
              : 'Task reopened',
            'success'
          )
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

  const handleBack = () => {
    router.back()
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center">
          <p className="text-status-error mb-2">Failed to load project</p>
          <p className="text-sm text-text-secondary">{error.message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto">
      {/* Header */}
      <div className="border-b border-border-light bg-white px-8 py-6 sticky top-0 z-10">
        {/* Back button */}
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary mb-3 transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2 text-text-secondary mb-2">
          <RectangleStackIcon className="w-4 h-4" />
          <span className="text-sm">Project</span>
        </div>

        <h1 className="text-2xl font-bold text-text-primary">{projectName}</h1>

        <p className="text-sm text-text-secondary mt-1">
          {isLoading
            ? 'Loading...'
            : `${tasks?.length || 0} ${tasks?.length === 1 ? 'task' : 'tasks'}`}
        </p>
      </div>

      {/* Tasks */}
      <div className="p-8">
        <div className="bg-white rounded-lg border border-border-light overflow-hidden">
          {isLoading ? (
            <TaskListSkeleton count={5} />
          ) : (
            <TaskList
              tasks={tasks || []}
              onToggleComplete={handleToggleComplete}
              onTaskClick={handleTaskClick}
              onNewTask={handleNewTask}
              emptyTitle="No tasks in this project"
              emptyDescription="Create a new task to get started."
            />
          )}
        </div>
      </div>
    </div>
  )
}
