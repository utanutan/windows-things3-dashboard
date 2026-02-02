/**
 * Global Loading Component
 * Shown during page transitions
 */

import { Loading } from '@/components/shared'

export default function LoadingPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-8">
      <Loading size="lg" text="Loading..." />
    </div>
  )
}
