'use client'

/**
 * Area Detail Page
 * Shows projects and standalone tasks for a specific area
 */

import { useParams } from 'next/navigation'
import { useAreaDetail } from '@/hooks/useAreas'
import { useModal, useSelectedTask, useToasts } from '@/stores/uiStore'
import { toggleTaskComplete } from '@/hooks/useTasks'
import { ProjectCard, ProjectCardSkeleton } from '@/components/projects'
import { TaskList, TaskListSkeleton } from '@/components/tasks'
import { EmptyState } from '@/components/shared'
import { FolderIcon, RectangleStackIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'

export default function AreaDetailPage() {
  const params = useParams()
  const areaName = decodeURIComponent(params.area_name as string)
  const { data: areaDetail, isLoading, error } = useAreaDetail(areaName)
  const { open } = useModal()
  const { setTaskId } = useSelectedTask()
  const { add: addToast } = useToasts()
  const router = useRouter()

  const handleToggleComplete = async (taskId: string) => {
    const task = areaDetail?.standalone_tasks.find((t) => t.id === taskId)
    if (!task) return

    try {
      // Mutate the area detail cache
      await toggleTaskComplete(
        task.id,
        task.status,
        `/api/areas/${encodeURIComponent(areaName)}`,
        (newStatus) => {
          addToast(
            newStatus === 'completed'
              ? 'Task completed!'
              : 'Task reopened',
            'success'
          )
        },
        (error) => {
          addToast('Failed to update task', 'error')
        }
      )
    } catch (error) {
      console.error('Failed to toggle task:', error)
    }
  }

  const handleTaskClick = (taskId: string) => {
    setTaskId(taskId)
    open('task-detail')
  }

  const handleNewTask = () => {
    open('task-create')
  }

  const handleProjectClick = (projectName: string) => {
    router.push(`/projects/${encodeURIComponent(projectName)}`)
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center">
          <p className="text-status-error mb-2">Failed to load area</p>
          <p className="text-sm text-text-secondary">{error.message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto">
      {/* Header */}
      <div className="border-b border-border-light bg-white px-8 py-6 sticky top-0 z-10">
        <div className="flex items-center gap-2 text-text-secondary mb-2">
          <FolderIcon className="w-4 h-4" />
          <span className="text-sm">Area</span>
        </div>
        <h1 className="text-2xl font-bold text-text-primary">{areaName}</h1>
        <p className="text-sm text-text-secondary mt-1">
          {isLoading
            ? 'Loading...'
            : `${areaDetail?.projects.length || 0} projects, ${
                areaDetail?.standalone_tasks.length || 0
              } standalone tasks`}
        </p>
      </div>

      {/* Content */}
      <div className="p-8 space-y-8">
        {/* Projects Section */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <RectangleStackIcon className="w-5 h-5 text-text-secondary" />
            <h2 className="text-lg font-semibold text-text-primary">
              Projects
            </h2>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <ProjectCardSkeleton key={i} />
              ))}
            </div>
          ) : areaDetail && areaDetail.projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {areaDetail.projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onClick={() => handleProjectClick(project.name)}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={
                <RectangleStackIcon className="w-12 h-12 text-text-secondary" />
              }
              title="No projects"
              description="No projects in this area yet."
            />
          )}
        </section>

        {/* Standalone Tasks Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-text-primary">
              Standalone Tasks
            </h2>
          </div>

          <div className="bg-white rounded-lg border border-border-light overflow-hidden">
            {isLoading ? (
              <TaskListSkeleton count={3} />
            ) : (
              <TaskList
                tasks={areaDetail?.standalone_tasks || []}
                onToggleComplete={handleToggleComplete}
                onTaskClick={handleTaskClick}
                onNewTask={handleNewTask}
                emptyTitle="No standalone tasks"
                emptyDescription="Tasks in this area are organized within projects."
              />
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
