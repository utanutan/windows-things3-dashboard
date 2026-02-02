/**
 * MSW (Mock Service Worker) handlers for API mocking in tests
 */

import { http, HttpResponse } from 'msw'
import {
  mockInboxTasks,
  mockTodayTasks,
  mockUpcomingTasks,
  mockAreas,
  mockProjects,
  getMockAreaDetail,
  searchMockTasks,
  getMockTaskById,
  mockProjectTasks,
} from '@/lib/mock'
import type { Task, Project, CreateTaskRequest, CreateProjectRequest } from '@/lib/types'

const API_BASE = '/api'

export const handlers = [
  // Health check
  http.get(`${API_BASE}/health`, () => {
    return HttpResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: '1.0.0-msw',
    })
  }),

  // Get inbox tasks
  http.get(`${API_BASE}/tasks/inbox`, () => {
    return HttpResponse.json(mockInboxTasks)
  }),

  // Get today tasks
  http.get(`${API_BASE}/tasks/today`, () => {
    return HttpResponse.json(mockTodayTasks)
  }),

  // Get upcoming tasks
  http.get(`${API_BASE}/tasks/upcoming`, () => {
    return HttpResponse.json(mockUpcomingTasks)
  }),

  // Search tasks
  http.get(`${API_BASE}/tasks/search`, ({ request }) => {
    const url = new URL(request.url)
    const query = url.searchParams.get('q')

    if (!query) {
      return HttpResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 })
    }

    const results = searchMockTasks(query)
    return HttpResponse.json(results)
  }),

  // Create task
  http.post(`${API_BASE}/tasks`, async ({ request }) => {
    const body = await request.json() as CreateTaskRequest

    if (!body.title || body.title.trim().length === 0) {
      return HttpResponse.json(
        { error: 'Task title is required' },
        { status: 400 }
      )
    }

    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: body.title,
      notes: body.notes,
      due_date: body.due_date,
      tags: body.tags,
      status: 'open',
      project_id: body.project_id,
      area_id: body.area_id,
    }

    return HttpResponse.json(newTask, { status: 201 })
  }),

  // Complete task
  http.put(`${API_BASE}/tasks/:id/complete`, ({ params }) => {
    const { id } = params
    const task = getMockTaskById(id as string)

    if (!task) {
      return HttpResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    const completedTask: Task = {
      ...task,
      status: 'completed',
    }

    return HttpResponse.json(completedTask)
  }),

  // Get areas
  http.get(`${API_BASE}/areas`, () => {
    return HttpResponse.json(mockAreas)
  }),

  // Get area detail
  http.get(`${API_BASE}/areas/:area_name`, ({ params }) => {
    const { area_name } = params
    const areaDetail = getMockAreaDetail(area_name as string)

    if (!areaDetail) {
      return HttpResponse.json({ error: 'Area not found' }, { status: 404 })
    }

    return HttpResponse.json(areaDetail)
  }),

  // Get projects
  http.get(`${API_BASE}/projects`, () => {
    return HttpResponse.json(mockProjects)
  }),

  // Create project
  http.post(`${API_BASE}/projects`, async ({ request }) => {
    const body = await request.json() as CreateProjectRequest

    if (!body.name || body.name.trim().length === 0) {
      return HttpResponse.json(
        { error: 'Project name is required' },
        { status: 400 }
      )
    }

    const newProject: Project = {
      id: `project-${Date.now()}`,
      name: body.name,
      task_count: 0,
      area_id: body.area_id,
    }

    return HttpResponse.json(newProject, { status: 201 })
  }),

  // Get project tasks
  http.get(`${API_BASE}/projects/:project_name/tasks`, () => {
    return HttpResponse.json(mockProjectTasks)
  }),
]
