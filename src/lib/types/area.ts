/**
 * Area Type Definitions
 * Based on Things3 area model
 */

import type { Project } from './project'
import type { Task } from './task'

/**
 * Area model - represents a Things3 area
 */
export interface Area {
  /** Unique area identifier */
  id: string
  /** Area name */
  name: string
  /** Number of projects in this area */
  project_count: number
}

/**
 * Area detail response - includes projects and standalone tasks
 */
export interface AreaDetail {
  /** Projects belonging to this area */
  projects: Project[]
  /** Tasks in this area that don't belong to any project */
  standalone_tasks: Task[]
}

/**
 * Type guard to check if a value is a valid Area
 */
export function isArea(value: unknown): value is Area {
  if (typeof value !== 'object' || value === null) return false
  const area = value as Record<string, unknown>

  return (
    typeof area.id === 'string' &&
    typeof area.name === 'string' &&
    typeof area.project_count === 'number'
  )
}

/**
 * Type guard to check if a value is a valid AreaDetail
 */
export function isAreaDetail(value: unknown): value is AreaDetail {
  if (typeof value !== 'object' || value === null) return false
  const detail = value as Record<string, unknown>

  return (
    Array.isArray(detail.projects) &&
    Array.isArray(detail.standalone_tasks)
  )
}
