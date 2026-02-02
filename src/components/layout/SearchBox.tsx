'use client'

/**
 * Search Box Component
 * Search input with debounce and clear button
 */

import { useState, useEffect, useRef } from 'react'
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'

export interface SearchBoxProps {
  /** Placeholder text */
  placeholder?: string
  /** Search callback (debounced) */
  onSearch: (query: string) => void
  /** Debounce delay in ms */
  debounceMs?: number
  /** Initial value */
  initialValue?: string
  /** Custom className */
  className?: string
}

/**
 * Search box with debounce and clear button
 */
export function SearchBox({
  placeholder = 'Search tasks...',
  onSearch,
  debounceMs = 300,
  initialValue = '',
  className,
}: SearchBoxProps) {
  const [value, setValue] = useState(initialValue)
  const [isFocused, setIsFocused] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout>()
  const inputRef = useRef<HTMLInputElement>(null)

  // Debounced search
  useEffect(() => {
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      onSearch(value)
    }, debounceMs)

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [value, debounceMs, onSearch])

  const handleClear = () => {
    setValue('')
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClear()
    }
  }

  return (
    <div
      className={cn(
        'relative flex items-center',
        'rounded-lg border transition-all duration-150',
        isFocused
          ? 'border-primary ring-2 ring-primary/20'
          : 'border-border-light',
        className
      )}
    >
      {/* Search icon */}
      <MagnifyingGlassIcon
        className="absolute left-3 w-4 h-4 text-text-secondary pointer-events-none"
        aria-hidden="true"
      />

      {/* Input */}
      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={cn(
          'w-full pl-10 pr-10 py-2 bg-transparent',
          'text-sm text-text-primary placeholder:text-text-tertiary',
          'focus:outline-none'
        )}
        aria-label="Search"
      />

      {/* Clear button */}
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-2 p-1 rounded-lg text-text-secondary hover:bg-background-hover hover:text-text-primary transition-colors"
          aria-label="Clear search"
        >
          <XMarkIcon className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
