'use client'

/**
 * Sidebar Component
 * Navigation sidebar with collapsible areas/projects
 */

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  InboxIcon,
  CalendarDaysIcon,
  CalendarIcon,
  FolderIcon,
  ChevronRightIcon,
  PlusCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import type { Area, Project } from '@/lib/types'
import { cn } from '@/lib/utils'

export interface SidebarProps {
  /** Areas with projects */
  areas?: Area[]
  /** Projects by area */
  projectsByArea?: Record<string, Project[]>
  /** New task button handler */
  onNewTask?: () => void
  /** New project button handler */
  onNewProject?: (areaId?: string) => void
  /** Is sidebar collapsed */
  isCollapsed?: boolean
  /** Is mobile sidebar open */
  isMobileOpen?: boolean
  /** Close mobile sidebar */
  onMobileClose?: () => void
  /** Custom className */
  className?: string
}

interface NavItemProps {
  href: string
  icon: React.ComponentType<{ className?: string }>
  label: string
  isActive?: boolean
}

function NavItem({ href, icon: Icon, label, isActive }: NavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 px-4 py-2 rounded-lg transition-colors',
        'text-sm font-medium',
        isActive
          ? 'bg-background-selected text-primary'
          : 'text-text-secondary hover:bg-background-hover hover:text-text-primary'
      )}
    >
      <Icon className="w-4 h-4 flex-shrink-0" />
      <span>{label}</span>
    </Link>
  )
}

interface AreaSectionProps {
  area: Area
  projects: Project[]
  onNewProject?: (areaId: string) => void
}

function AreaSection({ area, projects, onNewProject }: AreaSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const pathname = usePathname()
  const isAreaActive = pathname === `/areas/${encodeURIComponent(area.name)}`

  return (
    <div className="space-y-1">
      {/* Area header */}
      <div className="flex items-center justify-between w-full px-4 py-2 rounded-lg hover:bg-background-hover transition-colors group">
        {/* Chevron toggle */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 -ml-1 hover:bg-background-selected rounded transition-colors"
          aria-label={isExpanded ? 'Collapse' : 'Expand'}
        >
          <ChevronRightIcon
            className={cn(
              'w-3 h-3 transition-transform text-text-secondary',
              isExpanded && 'rotate-90'
            )}
          />
        </button>

        {/* Area name link */}
        <Link
          href={`/areas/${encodeURIComponent(area.name)}`}
          className={cn(
            'flex items-center gap-2 flex-1 text-sm font-medium transition-colors',
            isAreaActive
              ? 'text-primary'
              : 'text-text-secondary hover:text-text-primary'
          )}
        >
          <FolderIcon className="w-4 h-4" />
          <span>{area.name}</span>
          <span className="text-xs text-text-tertiary">
            ({area.project_count})
          </span>
        </Link>

        {/* Add project button */}
        {onNewProject && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onNewProject(area.id)
            }}
            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-background-selected rounded transition-all"
            aria-label="Add project"
          >
            <PlusCircleIcon className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Projects list */}
      {isExpanded && projects.length > 0 && (
        <div className="ml-6 space-y-1">
          {projects.map((project) => {
            const projectUrl = `/projects/${encodeURIComponent(project.name)}`
            const isActive = pathname === projectUrl
            return (
              <Link
                key={project.id}
                href={projectUrl}
                className={cn(
                  'flex items-center justify-between px-4 py-2 rounded-lg transition-colors',
                  'text-sm',
                  isActive
                    ? 'bg-background-selected text-primary font-medium'
                    : 'text-text-secondary hover:bg-background-hover hover:text-text-primary'
                )}
              >
                <span>{project.name}</span>
                <span className="text-xs text-text-tertiary">
                  {project.task_count}
                </span>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

/**
 * Navigation sidebar
 */
export function Sidebar({
  areas = [],
  projectsByArea = {},
  onNewTask,
  onNewProject,
  isCollapsed = false,
  isMobileOpen = false,
  onMobileClose,
  className,
}: SidebarProps) {
  const pathname = usePathname()

  // Close mobile sidebar on route change
  useEffect(() => {
    if (isMobileOpen && onMobileClose) {
      onMobileClose()
    }
  }, [pathname])

  if (isCollapsed) {
    return null // TODO: Implement collapsed state with icons only
  }

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          // Mobile: Fixed overlay drawer
          'fixed lg:sticky inset-y-0 left-0 z-50 lg:z-auto',
          'top-0 lg:top-16 h-screen lg:h-[calc(100vh-4rem)]',
          'w-60 flex-shrink-0',
          'bg-background-sidebar border-r border-border-light',
          'overflow-y-auto',
          'transition-transform duration-300 ease-in-out',
          // Mobile: slide in/out
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          className
        )}
      >
      <nav className="p-4 space-y-6">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between pb-4 border-b border-border-light">
          <h2 className="text-lg font-semibold text-text-primary">Menu</h2>
          {onMobileClose && (
            <button
              onClick={onMobileClose}
              className="p-2 rounded-lg hover:bg-background-hover text-text-secondary"
              aria-label="Close menu"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Main navigation */}
        <div className="space-y-1">
          <NavItem
            href="/"
            icon={InboxIcon}
            label="Inbox"
            isActive={pathname === '/'}
          />
          <NavItem
            href="/today"
            icon={CalendarDaysIcon}
            label="Today"
            isActive={pathname === '/today'}
          />
          <NavItem
            href="/upcoming"
            icon={CalendarIcon}
            label="Upcoming"
            isActive={pathname === '/upcoming'}
          />
        </div>

        {/* Divider */}
        <div className="border-t border-border-light" />

        {/* Areas & Projects */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-4 mb-2">
            <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wide">
              Areas
            </h3>
          </div>

          {areas.length > 0 ? (
            areas.map((area) => {
              // Try both area.id and area.name as keys (Mac API compatibility)
              const areaProjects = projectsByArea[area.id] || projectsByArea[area.name] || []
              return (
                <AreaSection
                  key={area.id}
                  area={area}
                  projects={areaProjects}
                  onNewProject={onNewProject}
                />
              )
            })
          ) : (
            <p className="px-4 text-sm text-text-tertiary italic">
              No areas yet
            </p>
          )}
        </div>

        {/* New Task button */}
        {onNewTask && (
          <>
            <div className="border-t border-border-light" />
            <button
              onClick={onNewTask}
              className="flex items-center gap-3 px-4 py-2 w-full rounded-lg text-sm font-medium text-primary hover:bg-background-selected transition-colors"
            >
              <PlusCircleIcon className="w-5 h-5" />
              <span>New Task</span>
            </button>
          </>
        )}
      </nav>
      </aside>
    </>
  )
}
