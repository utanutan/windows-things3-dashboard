/**
 * SWR Hooks for Areas and Projects
 */

import useSWR from 'swr'
import type { Area, AreaDetail, Project, CreateProjectRequest } from '@/lib/types'

/**
 * Fetcher function for SWR
 */
async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error('Failed to fetch')
  }
  return res.json()
}

/**
 * Hook for all areas
 */
export function useAreas() {
  return useSWR<Area[]>('/api/areas', fetcher)
}

/**
 * Hook for area detail (includes projects and standalone tasks)
 */
export function useAreaDetail(areaName: string) {
  return useSWR<AreaDetail>(
    areaName ? `/api/areas/${encodeURIComponent(areaName)}` : null,
    fetcher
  )
}

/**
 * Hook for all projects
 */
export function useProjects() {
  return useSWR<Project[]>('/api/projects', fetcher)
}

/**
 * Hook for project tasks
 */
export function useProjectTasks(projectName: string) {
  return useSWR(
    projectName
      ? `/api/projects/${encodeURIComponent(projectName)}/tasks`
      : null,
    fetcher
  )
}

/**
 * Create a new project
 */
export async function createProject(
  project: CreateProjectRequest
): Promise<Project> {
  const res = await fetch('/api/projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(project),
  })

  if (!res.ok) {
    throw new Error('Failed to create project')
  }

  return res.json()
}
