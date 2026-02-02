'use client'

/**
 * Project Card Component
 * Card displaying project information
 */

import { RectangleStackIcon } from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'
import type { Project } from '@/lib/types'

export interface ProjectCardProps {
  /** Project data */
  project: Project
  /** Click handler */
  onClick?: (projectId: string) => void
  /** Is selected */
  isSelected?: boolean
  /** Custom className */
  className?: string
}

/**
 * Project card component
 */
export function ProjectCard({
  project,
  onClick,
  isSelected = false,
  className,
}: ProjectCardProps) {
  return (
    <div
      onClick={() => onClick?.(project.id)}
      className={cn(
        'group p-4 rounded-lg border transition-all duration-200',
        'cursor-pointer',
        isSelected
          ? 'border-primary bg-background-selected'
          : 'border-border-light bg-white hover:border-primary hover:shadow-md',
        className
      )}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="p-2 rounded-lg bg-primary/10 text-primary">
          <RectangleStackIcon className="w-5 h-5" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-text-primary mb-1 truncate">
            {project.name}
          </h3>

          <p className="text-sm text-text-secondary">
            {project.task_count} {project.task_count === 1 ? 'task' : 'tasks'}
          </p>
        </div>
      </div>
    </div>
  )
}

/**
 * Project card skeleton
 */
export function ProjectCardSkeleton() {
  return (
    <div className="p-4 rounded-lg border border-border-light animate-pulse">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-background-hover" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-background-hover rounded w-3/4" />
          <div className="h-3 bg-background-hover rounded w-1/2" />
        </div>
      </div>
    </div>
  )
}
