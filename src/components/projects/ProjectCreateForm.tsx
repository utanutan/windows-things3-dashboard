'use client'

/**
 * Project Create Form Component
 * Modal form for creating new projects
 */

import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui'
import type { CreateProjectRequest, Area } from '@/lib/types'

export interface ProjectCreateFormProps {
  /** Is modal open */
  isOpen: boolean
  /** Close handler */
  onClose: () => void
  /** Submit handler */
  onSubmit: (project: CreateProjectRequest) => Promise<void>
  /** Available areas for selection */
  areas?: Area[]
  /** Is submitting */
  isSubmitting?: boolean
}

/**
 * Project creation form modal
 */
export function ProjectCreateForm({
  isOpen,
  onClose,
  onSubmit,
  areas = [],
  isSubmitting = false,
}: ProjectCreateFormProps) {
  const [name, setName] = useState('')
  const [areaId, setAreaId] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleReset = () => {
    setName('')
    setAreaId('')
    setErrors({})
  }

  const handleClose = () => {
    handleReset()
    onClose()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    const newErrors: Record<string, string> = {}

    if (!name.trim()) {
      newErrors.name = 'Project name is required'
    } else if (name.length > 100) {
      newErrors.name = 'Project name must be 100 characters or less'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Submit
    try {
      await onSubmit({
        name: name.trim(),
        area_id: areaId || undefined,
      })

      handleClose()
    } catch (error) {
      console.error('Failed to create project:', error)
      setErrors({ submit: 'Failed to create project. Please try again.' })
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create New Project"
      maxWidth="md"
      footer={
        <>
          <Button
            variant="secondary"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!name.trim() || isSubmitting}
            isLoading={isSubmitting}
          >
            Create Project
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Project Name */}
        <Input
          label="Project Name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter project name"
          error={errors.name}
          autoFocus
          fullWidth
          maxLength={100}
        />

        {/* Area Selection */}
        <div className="space-y-2">
          <label
            htmlFor="area-select"
            className="block text-sm font-medium text-text-primary"
          >
            Area (Optional)
          </label>
          <select
            id="area-select"
            value={areaId}
            onChange={(e) => setAreaId(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-border-medium bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          >
            <option value="">No Area</option>
            {areas.map((area) => (
              <option key={area.id} value={area.id}>
                {area.name}
              </option>
            ))}
          </select>
        </div>

        {/* Submit error */}
        {errors.submit && (
          <p className="text-sm text-status-error">{errors.submit}</p>
        )}
      </form>
    </Modal>
  )
}
