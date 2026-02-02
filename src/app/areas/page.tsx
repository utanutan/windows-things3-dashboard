'use client'

/**
 * Areas Page
 * Shows all areas with their project counts
 */

import { useAreas } from '@/hooks/useAreas'
import { ProjectCard, ProjectCardSkeleton } from '@/components/projects'
import { EmptyState } from '@/components/shared'
import { FolderIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'

export default function AreasPage() {
  const { data: areas, isLoading, error } = useAreas()
  const router = useRouter()

  const handleAreaClick = (areaName: string) => {
    router.push(`/areas/${encodeURIComponent(areaName)}`)
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center">
          <p className="text-status-error mb-2">Failed to load areas</p>
          <p className="text-sm text-text-secondary">{error.message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full">
      {/* Header */}
      <div className="border-b border-border-light bg-white px-8 py-6">
        <h1 className="text-2xl font-bold text-text-primary">Areas</h1>
        <p className="text-sm text-text-secondary mt-1">
          {isLoading ? 'Loading...' : `${areas?.length || 0} areas`}
        </p>
      </div>

      {/* Content */}
      <div className="p-8">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProjectCardSkeleton key={i} />
            ))}
          </div>
        ) : areas && areas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {areas.map((area) => (
              <div
                key={area.id}
                onClick={() => handleAreaClick(area.name)}
                className="group p-4 rounded-lg border border-border-light bg-white hover:border-primary hover:shadow-md transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <FolderIcon className="w-5 h-5" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-text-primary mb-1 truncate">
                      {area.name}
                    </h3>

                    <p className="text-sm text-text-secondary">
                      {area.project_count}{' '}
                      {area.project_count === 1 ? 'project' : 'projects'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<FolderIcon className="w-12 h-12 text-text-secondary" />}
            title="No areas"
            description="No areas found. Areas help organize your projects."
          />
        )}
      </div>
    </div>
  )
}
