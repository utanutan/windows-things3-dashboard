/**
 * Validation utilities
 * Input validation helpers for forms and data
 */

/**
 * Validation result
 */
export interface ValidationResult {
  valid: boolean
  error?: string
}

/**
 * Validate task title
 * @param title - Task title to validate
 * @returns Validation result
 */
export function validateTaskTitle(title: string): ValidationResult {
  if (!title || title.trim().length === 0) {
    return { valid: false, error: 'Task title is required' }
  }

  if (title.length > 500) {
    return { valid: false, error: 'Task title must be 500 characters or less' }
  }

  return { valid: true }
}

/**
 * Validate project name
 * @param name - Project name to validate
 * @returns Validation result
 */
export function validateProjectName(name: string): ValidationResult {
  if (!name || name.trim().length === 0) {
    return { valid: false, error: 'Project name is required' }
  }

  if (name.length > 200) {
    return { valid: false, error: 'Project name must be 200 characters or less' }
  }

  return { valid: true }
}

/**
 * Validate date string (ISO format YYYY-MM-DD)
 * @param dateString - Date string to validate
 * @returns Validation result
 */
export function validateDateString(dateString: string): ValidationResult {
  if (!dateString) {
    return { valid: true } // Empty is valid (optional field)
  }

  // Check format
  const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/
  if (!isoDateRegex.test(dateString)) {
    return { valid: false, error: 'Date must be in YYYY-MM-DD format' }
  }

  // Check if valid date
  const date = new Date(dateString)
  if (isNaN(date.getTime())) {
    return { valid: false, error: 'Invalid date' }
  }

  // Strict validation: ensure the date components match the input
  // (prevents dates like 2024-02-30 from being accepted as valid)
  const [year, month, day] = dateString.split('-').map(Number)
  if (
    date.getFullYear() !== year ||
    date.getMonth() + 1 !== month ||
    date.getDate() !== day
  ) {
    return { valid: false, error: 'Invalid date' }
  }

  return { valid: true }
}

/**
 * Validate tag name
 * @param tag - Tag name to validate
 * @returns Validation result
 */
export function validateTag(tag: string): ValidationResult {
  if (!tag || tag.trim().length === 0) {
    return { valid: false, error: 'Tag cannot be empty' }
  }

  if (tag.length > 50) {
    return { valid: false, error: 'Tag must be 50 characters or less' }
  }

  // Tags should not contain special characters except dash and underscore
  const validTagRegex = /^[a-zA-Z0-9\-_\s]+$/
  if (!validTagRegex.test(tag)) {
    return { valid: false, error: 'Tag can only contain letters, numbers, spaces, dashes, and underscores' }
  }

  return { valid: true }
}

/**
 * Validate array of tags
 * @param tags - Array of tag names
 * @returns Validation result
 */
export function validateTags(tags: string[]): ValidationResult {
  if (!Array.isArray(tags)) {
    return { valid: false, error: 'Tags must be an array' }
  }

  if (tags.length > 10) {
    return { valid: false, error: 'Maximum 10 tags allowed' }
  }

  for (const tag of tags) {
    const result = validateTag(tag)
    if (!result.valid) {
      return result
    }
  }

  return { valid: true }
}

/**
 * Validate notes/description field
 * @param notes - Notes text to validate
 * @returns Validation result
 */
export function validateNotes(notes: string): ValidationResult {
  if (!notes) {
    return { valid: true } // Empty is valid (optional field)
  }

  if (notes.length > 10000) {
    return { valid: false, error: 'Notes must be 10000 characters or less' }
  }

  return { valid: true }
}

/**
 * Validate search query
 * @param query - Search query string
 * @returns Validation result
 */
export function validateSearchQuery(query: string): ValidationResult {
  if (!query || query.trim().length === 0) {
    return { valid: false, error: 'Search query cannot be empty' }
  }

  if (query.length < 2) {
    return { valid: false, error: 'Search query must be at least 2 characters' }
  }

  if (query.length > 200) {
    return { valid: false, error: 'Search query must be 200 characters or less' }
  }

  return { valid: true }
}

/**
 * Sanitize string input (remove leading/trailing whitespace, normalize)
 * @param input - String to sanitize
 * @returns Sanitized string
 */
export function sanitizeString(input: string): string {
  return input.trim().replace(/\s+/g, ' ')
}

/**
 * Escape HTML special characters to prevent XSS
 * @param input - String to escape
 * @returns HTML-escaped string
 */
export function escapeHTML(input: string): string {
  const div = typeof document !== 'undefined' ? document.createElement('div') : null
  if (div) {
    div.textContent = input
    return div.innerHTML
  }
  // Fallback for server-side
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

/**
 * Sanitize and validate user input for API submission
 * Combines sanitization and HTML escaping
 * @param input - String to sanitize
 * @returns Sanitized and escaped string
 */
export function sanitizeUserInput(input: string): string {
  return escapeHTML(sanitizeString(input))
}

/**
 * Validate email format (for future use)
 * @param email - Email address to validate
 * @returns Validation result
 */
export function validateEmail(email: string): ValidationResult {
  if (!email || email.trim().length === 0) {
    return { valid: false, error: 'Email is required' }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Invalid email format' }
  }

  return { valid: true }
}
