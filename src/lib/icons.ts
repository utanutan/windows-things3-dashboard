/**
 * Heroicons Icon Mapping
 * Centralized icon definitions for the application
 */

import {
  InboxIcon,
  CalendarDaysIcon,
  CalendarIcon,
  FolderIcon,
  RectangleStackIcon,
  TagIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon,
  PlusCircleIcon,
  Cog6ToothIcon,
  ArrowPathIcon,
  XMarkIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline'

import {
  CheckCircleIcon as CheckCircleIconSolid,
  ExclamationCircleIcon as ExclamationCircleIconSolid,
} from '@heroicons/react/24/solid'

/**
 * Navigation icons (outline style)
 */
export const NavigationIcons = {
  Inbox: InboxIcon,
  Today: CalendarDaysIcon,
  Upcoming: CalendarIcon,
  Area: FolderIcon,
  Project: RectangleStackIcon,
} as const

/**
 * Action icons (outline style)
 */
export const ActionIcons = {
  AddTask: PlusCircleIcon,
  Search: MagnifyingGlassIcon,
  Refresh: ArrowPathIcon,
  Settings: Cog6ToothIcon,
  Close: XMarkIcon,
  Check: CheckIcon,
} as const

/**
 * Content icons (outline style)
 */
export const ContentIcons = {
  Tag: TagIcon,
  Note: DocumentTextIcon,
} as const

/**
 * Status icons (solid style for filled appearance)
 */
export const StatusIcons = {
  Success: CheckCircleIconSolid,
  Error: ExclamationCircleIconSolid,
  Warning: ExclamationTriangleIcon,
  Info: InformationCircleIcon,
} as const

/**
 * All icons combined
 */
export const Icons = {
  ...NavigationIcons,
  ...ActionIcons,
  ...ContentIcons,
  ...StatusIcons,
} as const

/**
 * Icon size presets (in pixels)
 */
export const IconSizes = {
  xs: 14, // Inline small icon
  sm: 16, // Sidebar icon
  base: 20, // Button icon
  lg: 24, // Header icon
  xl: 32, // Large icon
} as const

/**
 * Type-safe icon name
 */
export type IconName = keyof typeof Icons

/**
 * Type-safe icon size
 */
export type IconSize = keyof typeof IconSizes
