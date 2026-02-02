/**
 * UI Store (Zustand)
 * Client-side UI state management
 */

import { create } from 'zustand'

export type ModalType = 'task-create' | 'task-detail' | 'project-create' | null

interface UIStore {
  // Sidebar state
  isSidebarCollapsed: boolean
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void

  // Mobile sidebar state
  isMobileSidebarOpen: boolean
  toggleMobileSidebar: () => void
  setMobileSidebarOpen: (open: boolean) => void

  // Modal state
  activeModal: ModalType
  openModal: (modal: ModalType) => void
  closeModal: () => void

  // Selected task (for detail modal)
  selectedTaskId: string | null
  setSelectedTaskId: (taskId: string | null) => void

  // Search state
  searchQuery: string
  setSearchQuery: (query: string) => void
  isSearching: boolean
  setIsSearching: (searching: boolean) => void

  // Toast notifications
  toasts: Array<{
    id: string
    message: string
    type: 'success' | 'error' | 'warning' | 'info'
  }>
  addToast: (
    message: string,
    type?: 'success' | 'error' | 'warning' | 'info'
  ) => void
  removeToast: (id: string) => void
}

/**
 * UI store for client-side state
 */
export const useUIStore = create<UIStore>((set, get) => ({
  // Sidebar
  isSidebarCollapsed: false,
  toggleSidebar: () =>
    set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
  setSidebarCollapsed: (collapsed) =>
    set({ isSidebarCollapsed: collapsed }),

  // Mobile sidebar
  isMobileSidebarOpen: false,
  toggleMobileSidebar: () =>
    set((state) => ({ isMobileSidebarOpen: !state.isMobileSidebarOpen })),
  setMobileSidebarOpen: (open) =>
    set({ isMobileSidebarOpen: open }),

  // Modal
  activeModal: null,
  openModal: (modal) => set({ activeModal: modal }),
  closeModal: () => set({ activeModal: null, selectedTaskId: null }),

  // Selected task
  selectedTaskId: null,
  setSelectedTaskId: (taskId) => set({ selectedTaskId: taskId }),

  // Search
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  isSearching: false,
  setIsSearching: (searching) => set({ isSearching: searching }),

  // Toasts
  toasts: [],
  addToast: (message, type = 'info') => {
    const id = `toast-${Date.now()}`
    set((state) => ({
      toasts: [...state.toasts, { id, message, type }],
    }))
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
}))

/**
 * Selector hooks for optimized re-renders
 */
export const useSidebar = () =>
  useUIStore((state) => ({
    isCollapsed: state.isSidebarCollapsed,
    toggle: state.toggleSidebar,
    setCollapsed: state.setSidebarCollapsed,
  }))

export const useMobileSidebar = () =>
  useUIStore((state) => ({
    isOpen: state.isMobileSidebarOpen,
    toggle: state.toggleMobileSidebar,
    setOpen: state.setMobileSidebarOpen,
  }))

export const useModal = () =>
  useUIStore((state) => ({
    activeModal: state.activeModal,
    open: state.openModal,
    close: state.closeModal,
  }))

export const useSelectedTask = () =>
  useUIStore((state) => ({
    taskId: state.selectedTaskId,
    setTaskId: state.setSelectedTaskId,
  }))

export const useSearch = () =>
  useUIStore((state) => ({
    query: state.searchQuery,
    setQuery: state.setSearchQuery,
    isSearching: state.isSearching,
    setIsSearching: state.setIsSearching,
  }))

export const useToasts = () =>
  useUIStore((state) => ({
    toasts: state.toasts,
    add: state.addToast,
    remove: state.removeToast,
  }))
