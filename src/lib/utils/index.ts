/**
 * Central export point for utility functions
 */

export { cn } from './cn'

export {
  formatDate,
  formatRelativeDate,
  isOverdue,
  isToday,
  parseDate,
  toISODateString,
  getDateStatus,
} from './date'

export {
  validateTaskTitle,
  validateProjectName,
  validateDateString,
  validateTag,
  validateTags,
  validateNotes,
  validateSearchQuery,
  sanitizeString,
  escapeHTML,
  sanitizeUserInput,
  validateEmail,
} from './validation'

export type { ValidationResult } from './validation'
