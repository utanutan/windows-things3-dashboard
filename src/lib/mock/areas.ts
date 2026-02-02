/**
 * Mock area data for development and testing
 */

import type { Area, AreaDetail } from '../types'
import { mockProjectTasks, mockAreaTasks } from './tasks'
import { mockProjects } from './projects'

/**
 * Mock areas
 */
export const mockAreas: Area[] = [
  {
    id: 'area-1',
    name: 'Work',
    project_count: 2,
  },
  {
    id: 'area-2',
    name: 'Personal',
    project_count: 1,
  },
  {
    id: 'area-3',
    name: 'Learning',
    project_count: 1,
  },
]

/**
 * Get mock area by ID
 */
export function getMockAreaById(id: string): Area | undefined {
  return mockAreas.find((area) => area.id === id)
}

/**
 * Get mock area by name
 */
export function getMockAreaByName(name: string): Area | undefined {
  return mockAreas.find(
    (area) => area.name.toLowerCase() === name.toLowerCase()
  )
}

/**
 * Get mock area detail (includes projects and standalone tasks)
 */
export function getMockAreaDetail(areaName: string): AreaDetail | null {
  const area = getMockAreaByName(areaName)
  if (!area) return null

  // Get projects for this area
  const projects = mockProjects.filter((p) => p.area_id === area.id)

  // Get standalone tasks for this area (not belonging to any project)
  const standaloneTasks = mockAreaTasks.filter((t) => t.area_id === area.id)

  return {
    projects,
    standalone_tasks: standaloneTasks,
  }
}
