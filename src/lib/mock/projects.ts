/**
 * Mock project data for development and testing
 */

import type { Project } from '../types'

/**
 * Mock projects
 */
export const mockProjects: Project[] = [
  {
    id: 'project-1',
    name: 'Windows Things3 Dashboard',
    task_count: 12,
    area_id: 'area-1', // Work
  },
  {
    id: 'project-2',
    name: 'Client Presentation',
    task_count: 5,
    area_id: 'area-1', // Work
  },
  {
    id: 'project-3',
    name: 'Home Renovation',
    task_count: 8,
    area_id: 'area-2', // Personal
  },
  {
    id: 'project-4',
    name: 'TypeScript Mastery',
    task_count: 15,
    area_id: 'area-3', // Learning
  },
]

/**
 * Get mock project by ID
 */
export function getMockProjectById(id: string): Project | undefined {
  return mockProjects.find((project) => project.id === id)
}

/**
 * Get mock projects by area ID
 */
export function getMockProjectsByAreaId(areaId: string): Project[] {
  return mockProjects.filter((project) => project.area_id === areaId)
}

/**
 * Get mock project by name
 */
export function getMockProjectByName(name: string): Project | undefined {
  return mockProjects.find(
    (project) => project.name.toLowerCase() === name.toLowerCase()
  )
}
