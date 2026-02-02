'use client'

/**
 * Task List Component
 * List of tasks with loading and empty states
 */

import { InboxIcon } from '@heroicons/react/24/outline'
import { TaskItem } from './TaskItem'
import { Loading } from '@/components/shared/Loading'
import { EmptyState } from '@/components/shared/EmptyState'
import { Button } from '@/components/ui'
import type { Task } from '@/lib/types'
import { cn } from '@/lib/utils'

export interface TaskListProps {
  /** Array of tasks */
  tasks: Task[]
  /** Is loading */
  isLoading?: boolean
  /** Selected task ID */
  selectedTaskId?: string
  /** Toggle complete handler */
  onToggleComplete?: (taskId: string) => void
  /** Task click handler */
  onTaskClick?: (taskId: string) => void
  /** New task handler */
  onNewTask?: () => void
  /** Empty state title */
  emptyTitle?: string
  /** Empty state description */
  emptyDescription?: string
  /** Custom className */
  className?: string
}

/**
 * Task list with loading and empty states
 */
export function TaskList({
  tasks,
  isLoading = false,
  selectedTaskId,
  onToggleComplete,
  onTaskClick,
  onNewTask,
  emptyTitle = 'No tasks',
  emptyDescription = 'There are no tasks to display.',
  className,
}: TaskListProps) {
  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loading text="Loading tasks..." />
      </div>
    )
  }

  // Empty state
  if (tasks.length === 0) {
    return (
      <EmptyState
        icon={<InboxIcon className="w-12 h-12" />}
        title={emptyTitle}
        description={emptyDescription}
        action={
          onNewTask && (
            <Button onClick={onNewTask}>Create Task</Button>
          )
        }
        className={className}
      />
    )
  }

  // Task list
  return (
    <div className={cn('divide-y divide-border-light', className)}>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          isSelected={selectedTaskId === task.id}
          onToggleComplete={onToggleComplete}
          onClick={onTaskClick}
        />
      ))}
    </div>
  )
}

/**
 * Task list skeleton loader
 */
export function TaskListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="divide-y divide-border-light">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex items-start gap-3 p-4 animate-pulse"
        >
          <div className="w-5 h-5 rounded-full bg-background-hover" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-background-hover rounded w-3/4" />
            <div className="flex gap-2">
              <div className="h-5 bg-background-hover rounded w-16" />
              <div className="h-5 bg-background-hover rounded w-20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
