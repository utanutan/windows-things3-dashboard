/**
 * Task Type Definitions
 * Based on Things3 data model via Mac API
 */

/**
 * Task status
 */
export type TaskStatus = 'open' | 'completed'

/**
 * Task model - represents a Things3 task
 */
export interface Task {
  /** Unique task identifier (UUID) */
  id: string
  /** Task title */
  title: string
  /** Task notes/description (optional) */
  notes?: string
  /** Due date in ISO format (YYYY-MM-DD) */
  due_date?: string
  /** Array of tag names */
  tags?: string[]
  /** Task status */
  status: TaskStatus
  /** Parent project ID (optional) */
  project_id?: string
  /** Parent area ID (optional) */
  area_id?: string
}

/**
 * Request payload for creating a new task
 */
export interface CreateTaskRequest {
  /** Task title (required) */
  title: string
  /** Task notes/description (optional) */
  notes?: string
  /** Due date in ISO format (YYYY-MM-DD) */
  due_date?: string
  /** Array of tag names */
  tags?: string[]
  /** Parent project ID (optional) */
  project_id?: string
  /** Parent area ID (optional) */
  area_id?: string
  /** List name (e.g., "inbox", "today") */
  list?: string
}

/**
 * Request payload for updating a task
 */
export interface UpdateTaskRequest {
  /** Updated task title */
  title?: string
  /** Updated notes */
  notes?: string
  /** Updated due date */
  due_date?: string
  /** Updated tags */
  tags?: string[]
  /** Updated status */
  status?: TaskStatus
  /** Updated project assignment */
  project_id?: string
  /** Updated area assignment */
  area_id?: string
}

/**
 * Type guard to check if a value is a valid TaskStatus
 */
export function isTaskStatus(value: unknown): value is TaskStatus {
  return value === 'open' || value === 'completed'
}

/**
 * Type guard to check if a value is a valid Task
 */
export function isTask(value: unknown): value is Task {
  if (typeof value !== 'object' || value === null) return false
  const task = value as Record<string, unknown>

  return (
    typeof task.id === 'string' &&
    typeof task.title === 'string' &&
    isTaskStatus(task.status) &&
    (task.notes === undefined || typeof task.notes === 'string') &&
    (task.due_date === undefined || typeof task.due_date === 'string') &&
    (task.tags === undefined || Array.isArray(task.tags)) &&
    (task.project_id === undefined || typeof task.project_id === 'string') &&
    (task.area_id === undefined || typeof task.area_id === 'string')
  )
}
