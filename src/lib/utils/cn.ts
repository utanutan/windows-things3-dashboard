/**
 * Utility for merging class names with Tailwind CSS
 * Combines clsx and tailwind-merge for optimal className handling
 */

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge class names intelligently
 * - Handles conditional classes via clsx
 * - Resolves Tailwind CSS class conflicts via tailwind-merge
 *
 * @example
 * cn('px-2 py-1', 'px-4') // => 'py-1 px-4' (px-2 overridden)
 * cn('text-red-500', condition && 'text-blue-500') // conditional
 * cn(['base-class', { 'active': isActive }]) // object syntax
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
