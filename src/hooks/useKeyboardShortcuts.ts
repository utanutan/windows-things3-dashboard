/**
 * Keyboard Shortcuts Hook
 * Global keyboard shortcut handlers
 */

import { useEffect } from 'react'

export interface KeyboardShortcuts {
  /** Search modal (Cmd/Ctrl+K) */
  onSearch?: () => void
  /** New task (N) */
  onNewTask?: () => void
  /** New project (P) */
  onNewProject?: () => void
  /** Close modal (Escape) - handled in Modal component */
}

/**
 * Register global keyboard shortcuts
 */
export function useKeyboardShortcuts({
  onSearch,
  onNewTask,
  onNewProject,
}: KeyboardShortcuts) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input/textarea
      const target = e.target as HTMLElement
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        // Allow Escape even in inputs
        if (e.key !== 'Escape') {
          return
        }
      }

      // Cmd/Ctrl+K: Open search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        onSearch?.()
        return
      }

      // N: New task
      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault()
        onNewTask?.()
        return
      }

      // P: New project
      if (e.key === 'p' || e.key === 'P') {
        e.preventDefault()
        onNewProject?.()
        return
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onSearch, onNewTask, onNewProject])
}
