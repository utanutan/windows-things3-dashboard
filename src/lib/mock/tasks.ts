/**
 * Mock task data for development and testing
 */

import type { Task } from '../types'

/**
 * Mock tasks for Inbox
 */
export const mockInboxTasks: Task[] = [
  {
    id: 'inbox-1',
    title: 'Review project proposal',
    notes: 'Check the new feature specifications and provide feedback',
    due_date: '2026-02-05',
    tags: ['work', 'review'],
    status: 'open',
  },
  {
    id: 'inbox-2',
    title: 'Buy groceries',
    notes: 'Milk, eggs, bread, vegetables',
    tags: ['personal', 'shopping'],
    status: 'open',
  },
  {
    id: 'inbox-3',
    title: 'Call dentist for appointment',
    due_date: '2026-02-03',
    tags: ['personal', 'health'],
    status: 'open',
  },
  {
    id: 'inbox-4',
    title: 'Setup Windows development environment',
    notes: 'Install Node.js, VS Code, Git, and configure SSH keys',
    tags: ['dev', 'setup'],
    status: 'completed',
  },
]

/**
 * Mock tasks for Today
 */
export const mockTodayTasks: Task[] = [
  {
    id: 'today-1',
    title: 'Complete quarterly report',
    notes: 'Summarize Q1 achievements and submit to manager',
    due_date: '2026-02-01',
    tags: ['work', 'urgent'],
    status: 'open',
    project_id: 'project-1',
  },
  {
    id: 'today-2',
    title: 'Team standup meeting',
    due_date: '2026-02-01',
    tags: ['work', 'meeting'],
    status: 'open',
  },
  {
    id: 'today-3',
    title: 'Review pull requests',
    notes: 'Check and approve PRs from team members',
    due_date: '2026-02-01',
    tags: ['dev', 'review'],
    status: 'open',
  },
]

/**
 * Mock tasks for Upcoming
 */
export const mockUpcomingTasks: Task[] = [
  {
    id: 'upcoming-1',
    title: 'Prepare presentation slides',
    due_date: '2026-02-10',
    tags: ['work', 'presentation'],
    status: 'open',
    project_id: 'project-2',
  },
  {
    id: 'upcoming-2',
    title: 'Book flight tickets',
    notes: 'Tokyo trip in March',
    due_date: '2026-02-15',
    tags: ['personal', 'travel'],
    status: 'open',
  },
  {
    id: 'upcoming-3',
    title: 'Annual health checkup',
    due_date: '2026-02-28',
    tags: ['personal', 'health'],
    status: 'open',
  },
  {
    id: 'upcoming-4',
    title: 'Update portfolio website',
    notes: 'Add recent projects and update resume',
    due_date: '2026-02-20',
    tags: ['dev', 'personal'],
    status: 'open',
  },
]

/**
 * Mock tasks for a specific project
 */
export const mockProjectTasks: Task[] = [
  {
    id: 'project-task-1',
    title: 'Design database schema',
    status: 'completed',
    project_id: 'project-1',
    tags: ['dev', 'database'],
  },
  {
    id: 'project-task-2',
    title: 'Implement user authentication',
    notes: 'JWT-based auth with refresh tokens',
    due_date: '2026-02-08',
    status: 'open',
    project_id: 'project-1',
    tags: ['dev', 'backend'],
  },
  {
    id: 'project-task-3',
    title: 'Create API documentation',
    due_date: '2026-02-12',
    status: 'open',
    project_id: 'project-1',
    tags: ['dev', 'docs'],
  },
]

/**
 * Mock tasks for an area (standalone, not in projects)
 */
export const mockAreaTasks: Task[] = [
  {
    id: 'area-task-1',
    title: 'Research new technologies',
    notes: 'Explore Next.js 15, React 19, TypeScript 5.3',
    tags: ['dev', 'research'],
    status: 'open',
    area_id: 'area-1',
  },
  {
    id: 'area-task-2',
    title: 'Code review best practices',
    due_date: '2026-02-06',
    tags: ['dev', 'learning'],
    status: 'open',
    area_id: 'area-1',
  },
]

/**
 * All mock tasks combined
 */
export const allMockTasks: Task[] = [
  ...mockInboxTasks,
  ...mockTodayTasks,
  ...mockUpcomingTasks,
  ...mockProjectTasks,
  ...mockAreaTasks,
]

/**
 * Get mock tasks by filter
 */
export function getMockTasks(filter: 'inbox' | 'today' | 'upcoming' | 'all'): Task[] {
  switch (filter) {
    case 'inbox':
      return mockInboxTasks
    case 'today':
      return mockTodayTasks
    case 'upcoming':
      return mockUpcomingTasks
    case 'all':
      return allMockTasks
    default:
      return []
  }
}

/**
 * Search mock tasks
 */
export function searchMockTasks(query: string): Task[] {
  const lowerQuery = query.toLowerCase()
  return allMockTasks.filter(
    (task) =>
      task.title.toLowerCase().includes(lowerQuery) ||
      task.notes?.toLowerCase().includes(lowerQuery) ||
      task.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
  )
}

/**
 * Get mock task by ID
 */
export function getMockTaskById(id: string): Task | undefined {
  return allMockTasks.find((task) => task.id === id)
}
