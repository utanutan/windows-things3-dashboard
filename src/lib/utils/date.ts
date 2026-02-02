/**
 * Date formatting utilities
 * Provides consistent date handling across the application
 */

/**
 * Format ISO date string to human-readable format
 * @param isoDate - ISO date string (YYYY-MM-DD or full ISO 8601)
 * @param options - Intl.DateTimeFormat options
 * @returns Formatted date string
 *
 * @example
 * formatDate('2024-12-25') // => 'Dec 25, 2024' (US locale)
 * formatDate('2024-12-25', { dateStyle: 'short' }) // => '12/25/24'
 */
export function formatDate(
  isoDate: string,
  options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' }
): string {
  try {
    const date = new Date(isoDate)
    if (isNaN(date.getTime())) {
      return isoDate // Return original if invalid
    }
    return new Intl.DateTimeFormat('en-US', options).format(date)
  } catch {
    return isoDate
  }
}

/**
 * Format date as "Today", "Tomorrow", or date string
 * @param isoDate - ISO date string (YYYY-MM-DD)
 * @returns Relative or formatted date
 *
 * @example
 * formatRelativeDate('2024-02-01') // => 'Today' (if today is 2024-02-01)
 * formatRelativeDate('2024-02-02') // => 'Tomorrow'
 * formatRelativeDate('2024-02-05') // => 'Feb 5'
 */
export function formatRelativeDate(isoDate: string): string {
  try {
    const date = new Date(isoDate)
    if (isNaN(date.getTime())) {
      return isoDate
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const target = new Date(date)
    target.setHours(0, 0, 0, 0)

    const diffTime = target.getTime() - today.getTime()
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Tomorrow'
    if (diffDays === -1) return 'Yesterday'

    // Return short format for other dates
    return formatDate(isoDate, { month: 'short', day: 'numeric' })
  } catch {
    return isoDate
  }
}

/**
 * Check if a date is overdue
 * @param isoDate - ISO date string (YYYY-MM-DD)
 * @returns true if date is in the past
 */
export function isOverdue(isoDate: string): boolean {
  try {
    const date = new Date(isoDate)
    if (isNaN(date.getTime())) {
      return false
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const target = new Date(date)
    target.setHours(0, 0, 0, 0)

    return target < today
  } catch {
    return false
  }
}

/**
 * Check if a date is today
 * @param isoDate - ISO date string (YYYY-MM-DD)
 * @returns true if date is today
 */
export function isToday(isoDate: string): boolean {
  try {
    const date = new Date(isoDate)
    if (isNaN(date.getTime())) {
      return false
    }

    const today = new Date()
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    )
  } catch {
    return false
  }
}

/**
 * Parse date string to Date object
 * @param isoDate - ISO date string
 * @returns Date object or null if invalid
 */
export function parseDate(isoDate: string): Date | null {
  try {
    const date = new Date(isoDate)
    return isNaN(date.getTime()) ? null : date
  } catch {
    return null
  }
}

/**
 * Format Date object to ISO date string (YYYY-MM-DD)
 * @param date - Date object
 * @returns ISO date string
 */
export function toISODateString(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Get date classification for styling
 * @param isoDate - ISO date string (YYYY-MM-DD)
 * @returns 'overdue' | 'today' | 'upcoming'
 */
export function getDateStatus(isoDate: string): 'overdue' | 'today' | 'upcoming' {
  if (isOverdue(isoDate)) return 'overdue'
  if (isToday(isoDate)) return 'today'
  return 'upcoming'
}
