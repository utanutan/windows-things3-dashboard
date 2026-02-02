'use client'

/**
 * Today Page
 * Shows tasks due today
 */

import { TaskList, TaskListSkeleton } from '@/components/tasks'
import { useToday, toggleTaskComplete } from '@/hooks/useTasks'
import { useModal, useSelectedTask, useToasts } from '@/stores/uiStore'

export default function TodayPage() {
  const { data: tasks, isLoading, error } = useToday()
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
        '/api/tasks/today',
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
          <p className="text-status-error mb-2">Failed to load today tasks</p>
          <p className="text-sm text-text-secondary">{error.message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full">
      <div className="border-b border-border-light bg-white px-8 py-6">
        <h1 className="text-2xl font-bold text-text-primary">Today</h1>
        <p className="text-sm text-text-secondary mt-1">
          {tasks?.length || 0} tasks due today
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
          emptyTitle="Nothing due today"
          emptyDescription="You have no tasks scheduled for today."
        />
      )}
    </div>
  )
}
