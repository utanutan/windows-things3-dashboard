'use client'

/**
 * Header Component
 * Top navigation bar with search, status, and refresh button
 */

import { ArrowPathIcon, Bars3Icon } from '@heroicons/react/24/outline'
import { ConnectionStatus, ConnectionState } from './ConnectionStatus'
import { SearchBox } from './SearchBox'
import { Button } from '@/components/ui'
import { cn } from '@/lib/utils'

export interface HeaderProps {
  /** Page title */
  title?: string
  /** Search handler */
  onSearch?: (query: string) => void
  /** Refresh handler */
  onRefresh?: () => void
  /** Mobile menu toggle handler */
  onMenuToggle?: () => void
  /** Connection status */
  connectionStatus?: ConnectionState
  /** Last API check timestamp */
  lastCheck?: Date
  /** API version */
  apiVersion?: string
  /** Is refreshing */
  isRefreshing?: boolean
  /** Custom className */
  className?: string
}

/**
 * Application header with search and status indicators
 */
export function Header({
  title = 'Things3 Dashboard',
  onSearch,
  onRefresh,
  onMenuToggle,
  connectionStatus = 'connected',
  lastCheck,
  apiVersion,
  isRefreshing = false,
  className,
}: HeaderProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full border-b border-border-light bg-white/95 backdrop-blur',
        className
      )}
    >
      <div className="flex items-center justify-between h-16 px-4 md:px-6 gap-2 md:gap-4">
        {/* Left: Mobile menu + Title */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Mobile menu button */}
          {onMenuToggle && (
            <Button
              variant="icon"
              size="sm"
              onClick={onMenuToggle}
              className="lg:hidden"
              aria-label="Toggle menu"
            >
              <Bars3Icon className="w-5 h-5" />
            </Button>
          )}

          <h1 className="text-lg md:text-xl font-semibold text-text-primary truncate">
            {title}
          </h1>
        </div>

        {/* Center: Search (if handler provided) - Hidden on mobile */}
        {onSearch && (
          <div className="hidden md:flex flex-1 max-w-md">
            <SearchBox
              onSearch={onSearch}
              placeholder="Search tasks..."
            />
          </div>
        )}

        {/* Right: Connection status and refresh button */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Connection status - Hidden on mobile */}
          <div className="hidden sm:block">
            <ConnectionStatus
              status={connectionStatus}
              lastCheck={lastCheck}
              version={apiVersion}
            />
          </div>

          {onRefresh && (
            <Button
              variant="icon"
              size="sm"
              onClick={onRefresh}
              disabled={isRefreshing}
              aria-label="Refresh data"
              title="Refresh data"
            >
              <ArrowPathIcon
                className={cn(
                  'w-5 h-5',
                  isRefreshing && 'animate-spin'
                )}
              />
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
