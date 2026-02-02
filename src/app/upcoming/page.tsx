'use client'

/**
 * Upcoming Page
 * Shows upcoming tasks
 */

import { TaskList, TaskListSkeleton } from '@/components/tasks'
import { useUpcoming, toggleTaskComplete } from '@/hooks/useTasks'
import { useModal, useSelectedTask, useToasts } from '@/stores/uiStore'

export default function UpcomingPage() {
  const { data: tasks, isLoading, error } = useUpcoming()
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
        '/api/tasks/upcoming',
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

  if (error) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center">
          <p className="text-status-error mb-2">Failed to load upcoming tasks</p>
          <p className="text-sm text-text-secondary">{error.message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full">
      <div className="border-b border-border-light bg-white px-8 py-6">
        <h1 className="text-2xl font-bold text-text-primary">Upcoming</h1>
        <p className="text-sm text-text-secondary mt-1">
          {tasks?.length || 0} upcoming tasks
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
          emptyTitle="No upcoming tasks"
          emptyDescription="You have no tasks scheduled for the future."
        />
      )}
    </div>
  )
}
