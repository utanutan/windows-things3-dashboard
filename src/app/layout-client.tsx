'use client'

/**
 * Client-side Layout Component
 * Wraps children with Header, Sidebar, and Toast notifications
 */

import dynamic from 'next/dynamic'
import { useRouter, usePathname } from 'next/navigation'
import { Header, Sidebar } from '@/components/layout'
import { ToastContainer } from '@/components/ui'
import { Loading } from '@/components/shared'
import { useModal, useSelectedTask, useToasts, useSearch, useMobileSidebar } from '@/stores/uiStore'
import { useAreas, useProjects, createProject } from '@/hooks/useAreas'
import { useHealth } from '@/hooks/useHealth'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { createTask, toggleTaskComplete } from '@/hooks/useTasks'
import { useInbox, useToday, useUpcoming } from '@/hooks/useTasks'
import { mutate as globalMutate } from 'swr'
import type { ConnectionState } from '@/components/layout'

// Dynamic imports for modals (code splitting)
const TaskDetail = dynamic(() => import('@/components/tasks/TaskDetail').then(mod => ({ default: mod.TaskDetail })), {
  loading: () => <Loading size="sm" />,
  ssr: false,
})

const TaskCreateForm = dynamic(() => import('@/components/tasks/TaskCreateForm').then(mod => ({ default: mod.TaskCreateForm })), {
  loading: () => <Loading size="sm" />,
  ssr: false,
})

const ProjectCreateForm = dynamic(() => import('@/components/projects/ProjectCreateForm').then(mod => ({ default: mod.ProjectCreateForm })), {
  loading: () => <Loading size="sm" />,
  ssr: false,
})

export function LayoutClient({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()

  // State
  const { activeModal, open, close } = useModal()
  const { taskId, setTaskId } = useSelectedTask()
  const { toasts, add: addToast, remove } = useToasts()
  const { query, setQuery, setIsSearching } = useSearch()
  const { isOpen: isMobileSidebarOpen, toggle: toggleMobileSidebar, setOpen: setMobileSidebarOpen } = useMobileSidebar()

  // Data hooks
  const { data: areas } = useAreas()
  const { data: projects } = useProjects()
  const { data: health, error: healthError } = useHealth()
  const { data: inboxTasks } = useInbox()
  const { data: todayTasks } = useToday()
  const { data: upcomingTasks } = useUpcoming()

  // Connection status
  const connectionStatus: ConnectionState = healthError
    ? 'disconnected'
    : health
      ? 'connected'
      : 'connecting'

  // Group projects by area
  const projectsByArea =
    projects?.reduce(
      (acc, project) => {
        if (project.area_id) {
          if (!acc[project.area_id]) {
            acc[project.area_id] = []
          }
          acc[project.area_id].push(project)
        }
        return acc
      },
      {} as Record<string, typeof projects>
    ) || {}

  // Find selected task from all task lists
  const selectedTask =
    inboxTasks?.find((t) => t.id === taskId) ||
    todayTasks?.find((t) => t.id === taskId) ||
    upcomingTasks?.find((t) => t.id === taskId) ||
    null

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onSearch: () => router.push('/search'),
    onNewTask: () => open('task-create'),
    onNewProject: () => open('project-create'),
  })

  // Handlers
  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery)
    if (searchQuery.length >= 2) {
      setIsSearching(true)
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleRefresh = async () => {
    // Trigger revalidation of all SWR caches
    addToast('Refreshing data...', 'info')
    try {
      await Promise.all([
        globalMutate('/api/tasks/inbox'),
        globalMutate('/api/tasks/today'),
        globalMutate('/api/tasks/upcoming'),
        globalMutate('/api/areas'),
        globalMutate('/api/projects'),
        globalMutate('/api/health'),
      ])
      addToast('Data refreshed successfully', 'success')
    } catch (error) {
      addToast('Failed to refresh data', 'error')
    }
  }

  const handleNewTask = () => {
    open('task-create')
  }

  const handleTaskClick = (id: string) => {
    setTaskId(id)
    open('task-detail')
  }

  const handleToggleComplete = async (id: string) => {
    const task =
      inboxTasks?.find((t) => t.id === id) ||
      todayTasks?.find((t) => t.id === id) ||
      upcomingTasks?.find((t) => t.id === id)

    if (!task) return

    const mutateKey = inboxTasks?.find((t) => t.id === id)
      ? '/api/tasks/inbox'
      : todayTasks?.find((t) => t.id === id)
        ? '/api/tasks/today'
        : '/api/tasks/upcoming'

    try {
      await toggleTaskComplete(task.id, task.status, mutateKey)
    } catch (error) {
      console.error('Failed to toggle task:', error)
    }
  }

  return (
    <div className="min-h-screen bg-background-main">
      {/* Header */}
      <Header
        onSearch={handleSearch}
        onRefresh={handleRefresh}
        onMenuToggle={toggleMobileSidebar}
        connectionStatus={connectionStatus}
        lastCheck={health?.timestamp ? new Date(health.timestamp) : undefined}
        apiVersion={health?.version}
      />

      <div className="flex">
        {/* Sidebar */}
        <Sidebar
          areas={areas}
          projectsByArea={projectsByArea}
          onNewTask={handleNewTask}
          isMobileOpen={isMobileSidebarOpen}
          onMobileClose={() => setMobileSidebarOpen(false)}
        />

        {/* Main content */}
        <main className="flex-1 min-h-[calc(100vh-4rem)]">{children}</main>
      </div>

      {/* Task Detail Modal */}
      {selectedTask && (
        <TaskDetail
          task={selectedTask}
          isOpen={activeModal === 'task-detail'}
          onClose={close}
          onToggleComplete={handleToggleComplete}
        />
      )}

      {/* Task Create Modal */}
      <TaskCreateForm
        isOpen={activeModal === 'task-create'}
        onClose={close}
        onSubmit={async (task) => {
          try {
            await createTask(task)
            // Revalidate task lists
            await Promise.all([
              globalMutate('/api/tasks/inbox'),
              globalMutate('/api/tasks/today'),
              globalMutate('/api/tasks/upcoming'),
            ])
            addToast('Task created successfully!', 'success')
            close()
          } catch (error) {
            addToast('Failed to create task', 'error')
            throw error
          }
        }}
      />

      {/* Project Create Modal */}
      <ProjectCreateForm
        isOpen={activeModal === 'project-create'}
        onClose={close}
        areas={areas}
        onSubmit={async (project) => {
          try {
            await createProject(project)
            // Revalidate projects and areas lists
            await Promise.all([
              globalMutate('/api/projects'),
              globalMutate('/api/areas'),
            ])
            addToast('Project created successfully!', 'success')
            close()
          } catch (error) {
            addToast('Failed to create project', 'error')
            throw error
          }
        }}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onRemove={remove} />
    </div>
  )
}
