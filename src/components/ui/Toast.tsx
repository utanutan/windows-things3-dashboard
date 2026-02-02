'use client'

/**
 * Toast Notification Component
 * Temporary notification messages
 */

import { useEffect } from 'react'
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid'
import { cn } from '@/lib/utils'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastProps {
  /** Toast message */
  message: string
  /** Toast type */
  type?: ToastType
  /** Toast visibility */
  isVisible: boolean
  /** Close handler */
  onClose: () => void
  /** Auto-dismiss duration (ms), 0 to disable */
  duration?: number
  /** Custom className */
  className?: string
}

const toastStyles: Record<ToastType, { icon: React.ComponentType<any>; borderColor: string }> = {
  success: {
    icon: CheckCircleIcon,
    borderColor: 'border-l-status-success',
  },
  error: {
    icon: ExclamationCircleIcon,
    borderColor: 'border-l-status-error',
  },
  warning: {
    icon: ExclamationCircleIcon,
    borderColor: 'border-l-status-warning',
  },
  info: {
    icon: InformationCircleIcon,
    borderColor: 'border-l-status-info',
  },
}

const iconColors: Record<ToastType, string> = {
  success: 'text-status-success',
  error: 'text-status-error',
  warning: 'text-status-warning',
  info: 'text-status-info',
}

/**
 * Toast notification component
 */
export function Toast({
  message,
  type = 'info',
  isVisible,
  onClose,
  duration = 5000,
  className,
}: ToastProps) {
  const { icon: Icon, borderColor } = toastStyles[type]

  // Auto-dismiss
  useEffect(() => {
    if (!isVisible || duration === 0) return

    const timer = setTimeout(() => {
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [isVisible, duration, onClose])

  if (!isVisible) return null

  return (
    <div
      className={cn(
        'fixed top-6 right-6 z-[100] animate-slideInRight',
        'bg-white rounded-lg shadow-xl border-l-4',
        'flex items-start gap-3 p-4 pr-12 max-w-md',
        borderColor,
        className
      )}
      role="alert"
      aria-live="polite"
    >
      <Icon className={cn('w-5 h-5 flex-shrink-0 mt-0.5', iconColors[type])} />

      <p className="text-sm text-text-primary flex-1">{message}</p>

      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-1 rounded-lg text-text-secondary hover:bg-background-hover hover:text-text-primary transition-colors"
        aria-label="Dismiss notification"
      >
        <XMarkIcon className="w-4 h-4" />
      </button>
    </div>
  )
}

/**
 * Toast container for managing multiple toasts
 */
export interface ToastData {
  id: string
  message: string
  type: ToastType
}

export interface ToastContainerProps {
  toasts: ToastData[]
  onRemove: (id: string) => void
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="fixed top-6 right-6 z-[100] flex flex-col gap-3">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          isVisible={true}
          onClose={() => onRemove(toast.id)}
        />
      ))}
    </div>
  )
}

// Add animation to globals.css
// @keyframes slideInRight {
//   from {
//     opacity: 0;
//     transform: translateX(100px);
//   }
//   to {
//     opacity: 1;
//     transform: translateX(0);
//   }
// }
//
// .animate-slideInRight {
//   animation: slideInRight 0.3s ease;
// }
