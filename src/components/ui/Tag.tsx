'use client'

/**
 * Tag/Badge Component
 * Colored tags for task categorization
 */

import { cn } from '@/lib/utils'

export type TagColor =
  | 'red'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'blue'
  | 'purple'
  | 'pink'
  | 'gray'

export interface TagProps {
  /** Tag text */
  children: React.ReactNode
  /** Tag color */
  color?: TagColor
  /** Size variant */
  size?: 'sm' | 'md'
  /** Custom className */
  className?: string
  /** Click handler (makes tag interactive) */
  onClick?: () => void
  /** Removable tag (shows X button) */
  onRemove?: () => void
}

const colorStyles: Record<TagColor, string> = {
  red: 'bg-tag-red text-white',
  orange: 'bg-tag-orange text-white',
  yellow: 'bg-tag-yellow text-text-primary',
  green: 'bg-tag-green text-white',
  blue: 'bg-tag-blue text-white',
  purple: 'bg-tag-purple text-white',
  pink: 'bg-tag-pink text-white',
  gray: 'bg-tag-gray text-text-primary',
}

/**
 * Tag/Badge component for displaying categorized information
 */
export function Tag({
  children,
  color = 'blue',
  size = 'sm',
  className,
  onClick,
  onRemove,
}: TagProps) {
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  }

  const isInteractive = onClick || onRemove

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-medium whitespace-nowrap',
        colorStyles[color],
        sizeStyles[size],
        isInteractive && 'cursor-pointer hover:opacity-90 transition-opacity',
        className
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onClick()
              }
            }
          : undefined
      }
    >
      {children}

      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className="ml-1 hover:bg-black/10 rounded-full p-0.5 transition-colors"
          aria-label="Remove tag"
        >
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </span>
  )
}

/**
 * Tag list container for displaying multiple tags
 */
export function TagList({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>{children}</div>
  )
}
