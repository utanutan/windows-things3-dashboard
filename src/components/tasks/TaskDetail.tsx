'use client'

/**
 * Task Detail Component
 * Modal showing full task information
 */

import { CalendarIcon, TagIcon, DocumentTextIcon } from '@heroicons/react/24/outline'
import { Modal } from '@/components/ui/Modal'
import { Checkbox } from '@/components/ui/Checkbox'
import { Tag } from '@/components/ui/Tag'
import { Button } from '@/components/ui'
import type { Task } from '@/lib/types'
import { formatDate } from '@/lib/utils'

export interface TaskDetailProps {
  /** Task to display */
  task: Task | null
  /** Is modal open */
  isOpen: boolean
  /** Close handler */
  onClose: () => void
  /** Toggle complete handler */
  onToggleComplete?: (taskId: string) => void
}

/**
 * Task detail modal
 */
export function TaskDetail({
  task,
  isOpen,
  onClose,
  onToggleComplete,
}: TaskDetailProps) {
  if (!task) return null

  const isCompleted = task.status === 'completed'

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Task Details"
      maxWidth="lg"
      footer={
        <Button onClick={onClose} variant="secondary">
          Close
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Title and checkbox */}
        <div className="flex items-start gap-3">
          <div
            onClick={() => onToggleComplete?.(task.id)}
            className="cursor-pointer"
          >
            <Checkbox
              checked={isCompleted}
              onChange={() => {}}
              aria-label={`Mark task as ${isCompleted ? 'incomplete' : 'complete'}`}
            />
          </div>
          <h2
            className={`text-2xl font-semibold flex-1 ${
              isCompleted ? 'text-text-secondary line-through' : 'text-text-primary'
            }`}
          >
            {task.title}
          </h2>
        </div>

        {/* Status */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-text-secondary">Status:</span>
          <span
            className={`text-sm font-medium ${
              isCompleted ? 'text-status-success' : 'text-text-primary'
            }`}
          >
            {isCompleted ? 'Completed' : 'Open'}
          </span>
        </div>

        {/* Due date */}
        {task.due_date && (
          <div className="flex items-center gap-3">
            <CalendarIcon className="w-5 h-5 text-text-secondary" />
            <div>
              <p className="text-sm text-text-secondary">Due Date</p>
              <p className="text-base font-medium text-text-primary">
                {formatDate(task.due_date)}
              </p>
            </div>
          </div>
        )}

        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <TagIcon className="w-5 h-5 text-text-secondary" />
              <p className="text-sm text-text-secondary">Tags</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {task.tags.map((tag) => (
                <Tag key={tag} color="blue">
                  {tag}
                </Tag>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        {task.notes && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <DocumentTextIcon className="w-5 h-5 text-text-secondary" />
              <p className="text-sm text-text-secondary">Notes</p>
            </div>
            <div className="bg-background-hover rounded-lg p-4">
              <p className="text-base text-text-primary whitespace-pre-wrap">
                {task.notes}
              </p>
            </div>
          </div>
        )}

        {/* IDs (for debugging) */}
        {(task.project_id || task.area_id) && (
          <div className="pt-4 border-t border-border-light space-y-1">
            {task.project_id && (
              <p className="text-xs text-text-tertiary">
                Project ID: {task.project_id}
              </p>
            )}
            {task.area_id && (
              <p className="text-xs text-text-tertiary">
                Area ID: {task.area_id}
              </p>
            )}
          </div>
        )}
      </div>
    </Modal>
  )
}
