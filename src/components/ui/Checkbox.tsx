'use client'

/**
 * Checkbox Component
 * Things3-style circular checkbox with green check
 */

import { forwardRef, InputHTMLAttributes } from 'react'
import { CheckIcon } from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Label text */
  label?: string
  /** Error state */
  error?: boolean
}

/**
 * Circular checkbox component inspired by Things3
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, className, id, checked, ...props }, ref) => {
    const checkboxId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex items-center gap-2">
        <div className="relative inline-flex items-center">
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            checked={checked}
            className="sr-only peer"
            {...props}
          />
          <label
            htmlFor={checkboxId}
            className={cn(
              'flex items-center justify-center w-5 h-5 rounded-full border-2 cursor-pointer transition-all duration-200',
              'peer-focus:ring-2 peer-focus:ring-primary peer-focus:ring-offset-2',
              'peer-disabled:opacity-50 peer-disabled:cursor-not-allowed',
              checked
                ? 'bg-checkbox-checked border-checkbox-checked'
                : error
                  ? 'border-status-error hover:border-status-error'
                  : 'border-checkbox-unchecked hover:border-text-secondary',
              className
            )}
          >
            {checked && (
              <CheckIcon
                className="w-3 h-3 text-white stroke-[3]"
                aria-hidden="true"
              />
            )}
          </label>
        </div>

        {label && (
          <label
            htmlFor={checkboxId}
            className={cn(
              'text-base cursor-pointer select-none',
              checked
                ? 'text-text-secondary line-through'
                : 'text-text-primary'
            )}
          >
            {label}
          </label>
        )}
      </div>
    )
  }
)

Checkbox.displayName = 'Checkbox'
