'use client'

/**
 * Task Item Component
 * Individual task display with checkbox, title, tags, due date
 */

import { DocumentTextIcon } from '@heroicons/react/24/outline'
import { Checkbox } from '@/components/ui/Checkbox'
import { Tag } from '@/components/ui/Tag'
import type { Task } from '@/lib/types'
import { formatRelativeDate, getDateStatus } from '@/lib/utils'
import { cn } from '@/lib/utils'

export interface TaskItemProps {
  /** Task data */
  task: Task
  /** Toggle complete handler */
  onToggleComplete?: (taskId: string) => void
  /** Click handler */
  onClick?: (taskId: string) => void
  /** Is selected */
  isSelected?: boolean
  /** Custom className */
  className?: string
}

/**
 * Task item component
 */
export function TaskItem({
  task,
  onToggleComplete,
  onClick,
  isSelected = false,
  className,
}: TaskItemProps) {
  const isCompleted = task.status === 'completed'
  const hasNotes = !!task.notes && task.notes.length > 0
  const dateStatus = task.due_date ? getDateStatus(task.due_date) : null

  return (
    <div
      className={cn(
        'group flex items-start gap-3 p-4 border-b border-border-light',
        'hover:bg-background-hover transition-colors cursor-pointer',
        isSelected && 'bg-background-selected',
        className
      )}
      onClick={() => onClick?.(task.id)}
    >
      {/* Checkbox */}
      <div
        onClick={(e) => {
          e.stopPropagation()
          onToggleComplete?.(task.id)
        }}
      >
        <Checkbox
          checked={isCompleted}
          onChange={() => {}}
          aria-label={`Mark task "${task.title}" as ${isCompleted ? 'incomplete' : 'complete'}`}
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-2">
        {/* Title and icons */}
        <div className="flex items-start gap-2">
          <h3
            className={cn(
              'text-base flex-1',
              isCompleted
                ? 'text-text-secondary line-through'
                : 'text-text-primary font-medium'
            )}
          >
            {task.title}
          </h3>

          {hasNotes && (
            <DocumentTextIcon
              className="w-4 h-4 text-text-tertiary flex-shrink-0"
              aria-label="Has notes"
            />
          )}
        </div>

        {/* Tags and due date */}
        {(task.tags || task.due_date) && (
          <div className="flex items-center gap-2 flex-wrap">
            {/* Tags */}
            {task.tags && task.tags.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {task.tags.map((tag) => (
                  <Tag key={tag} size="sm" color="blue">
                    {tag}
                  </Tag>
                ))}
              </div>
            )}

            {/* Due date */}
            {task.due_date && (
              <span
                className={cn(
                  'text-xs px-2 py-0.5 rounded',
                  dateStatus === 'overdue' &&
                    'text-status-error bg-status-error/10 font-semibold',
                  dateStatus === 'today' &&
                    'text-status-warning bg-status-warning/10 font-medium',
                  dateStatus === 'upcoming' && 'text-text-secondary'
                )}
              >
                {formatRelativeDate(task.due_date)}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
