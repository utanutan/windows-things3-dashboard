/**
 * Project Type Definitions
 * Based on Things3 project model
 */

/**
 * Project model - represents a Things3 project
 */
export interface Project {
  /** Unique project identifier */
  id: string
  /** Project name */
  name: string
  /** Number of tasks in this project */
  task_count: number
  /** Parent area ID (optional) */
  area_id?: string
}

/**
 * Request payload for creating a new project
 */
export interface CreateProjectRequest {
  /** Project name (required) */
  name: string
  /** Parent area ID (optional) */
  area_id?: string
  /** Project description/notes (optional) */
  notes?: string
  /** Project deadline in ISO format (YYYY-MM-DD) */
  deadline?: string
}

/**
 * Type guard to check if a value is a valid Project
 */
export function isProject(value: unknown): value is Project {
  if (typeof value !== 'object' || value === null) return false
  const project = value as Record<string, unknown>

  return (
    typeof project.id === 'string' &&
    typeof project.name === 'string' &&
    typeof project.task_count === 'number' &&
    (project.area_id === undefined || typeof project.area_id === 'string')
  )
}
