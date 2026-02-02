'use client'

/**
 * Connection Status Component
 * Shows API connection status with colored indicator
 */

import { cn } from '@/lib/utils'

export type ConnectionState = 'connected' | 'disconnected' | 'connecting'

export interface ConnectionStatusProps {
  /** Connection state */
  status: ConnectionState
  /** Last check timestamp */
  lastCheck?: Date
  /** API version */
  version?: string
  /** Custom className */
  className?: string
}

const statusStyles: Record<ConnectionState, { color: string; text: string }> = {
  connected: {
    color: 'bg-status-success',
    text: 'Connected',
  },
  disconnected: {
    color: 'bg-status-error',
    text: 'Disconnected',
  },
  connecting: {
    color: 'bg-text-tertiary',
    text: 'Connecting...',
  },
}

/**
 * Connection status indicator
 */
export function ConnectionStatus({
  status,
  lastCheck,
  version,
  className,
}: ConnectionStatusProps) {
  const { color, text } = statusStyles[status]

  return (
    <div
      className={cn('group relative flex items-center gap-2', className)}
      role="status"
      aria-label={`Connection status: ${text}`}
    >
      {/* Status indicator dot */}
      <span
        className={cn(
          'w-2 h-2 rounded-full transition-colors',
          color,
          status === 'connecting' && 'animate-pulse'
        )}
        aria-hidden="true"
      />

      {/* Status text */}
      <span className="text-sm text-text-secondary">{text}</span>

      {/* Tooltip on hover */}
      {(lastCheck || version) && (
        <div className="absolute top-full right-0 mt-2 p-3 bg-white rounded-lg shadow-lg border border-border-light opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 whitespace-nowrap">
          <div className="text-xs space-y-1">
            {version && (
              <div>
                <span className="text-text-secondary">Version: </span>
                <span className="text-text-primary font-medium">{version}</span>
              </div>
            )}
            {lastCheck && (
              <div>
                <span className="text-text-secondary">Last check: </span>
                <span className="text-text-primary font-medium">
                  {lastCheck.toLocaleTimeString()}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
