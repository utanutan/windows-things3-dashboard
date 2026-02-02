/**
 * Empty State Component
 * Displayed when there's no data to show
 */

import { cn } from '@/lib/utils'

export interface EmptyStateProps {
  /** Icon to display */
  icon?: React.ReactNode
  /** Title text */
  title: string
  /** Description text */
  description?: string
  /** Action button */
  action?: React.ReactNode
  /** Custom className */
  className?: string
}

/**
 * Empty state component
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center py-12 px-4',
        className
      )}
    >
      {icon && (
        <div className="mb-4 text-text-tertiary">
          {icon}
        </div>
      )}

      <h3 className="text-lg font-semibold text-text-primary mb-2">
        {title}
      </h3>

      {description && (
        <p className="text-sm text-text-secondary max-w-md mb-6">
          {description}
        </p>
      )}

      {action && <div>{action}</div>}
    </div>
  )
}
