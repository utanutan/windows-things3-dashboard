'use client'

/**
 * Task Create Form Component
 * Modal form for creating new tasks
 */

import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Input, TextArea } from '@/components/ui/Input'
import { Button } from '@/components/ui'
import { Tag } from '@/components/ui/Tag'
import type { CreateTaskRequest } from '@/lib/types'
import { validateTaskTitle, validateDateString, validateTags, validateNotes } from '@/lib/utils'

export interface TaskCreateFormProps {
  /** Is modal open */
  isOpen: boolean
  /** Close handler */
  onClose: () => void
  /** Submit handler */
  onSubmit: (task: CreateTaskRequest) => Promise<void>
  /** Is submitting */
  isSubmitting?: boolean
}

/**
 * Task creation form modal
 */
export function TaskCreateForm({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
}: TaskCreateFormProps) {
  const [title, setTitle] = useState('')
  const [notes, setNotes] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleReset = () => {
    setTitle('')
    setNotes('')
    setDueDate('')
    setTagInput('')
    setTags([])
    setErrors({})
  }

  const handleClose = () => {
    handleReset()
    onClose()
  }

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault()
      const newTag = tagInput.trim()
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag])
      }
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    const newErrors: Record<string, string> = {}

    const titleValidation = validateTaskTitle(title)
    if (!titleValidation.valid) {
      newErrors.title = titleValidation.error!
    }

    if (dueDate) {
      const dateValidation = validateDateString(dueDate)
      if (!dateValidation.valid) {
        newErrors.dueDate = dateValidation.error!
      }
    }

    if (tags.length > 0) {
      const tagsValidation = validateTags(tags)
      if (!tagsValidation.valid) {
        newErrors.tags = tagsValidation.error!
      }
    }

    if (notes) {
      const notesValidation = validateNotes(notes)
      if (!notesValidation.valid) {
        newErrors.notes = notesValidation.error!
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Submit
    try {
      await onSubmit({
        title,
        notes: notes || undefined,
        due_date: dueDate || undefined,
        tags: tags.length > 0 ? tags : undefined,
      })

      handleClose()
    } catch (error) {
      console.error('Failed to create task:', error)
      setErrors({ submit: 'Failed to create task. Please try again.' })
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create New Task"
      maxWidth="lg"
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
            disabled={!title.trim() || isSubmitting}
            isLoading={isSubmitting}
          >
            Create Task
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <Input
          label="Task Title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title"
          error={errors.title}
          autoFocus
          fullWidth
          maxLength={500}
        />

        {/* Notes */}
        <TextArea
          label="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add notes or description"
          error={errors.notes}
          fullWidth
          rows={4}
          maxLength={10000}
        />

        {/* Due Date */}
        <Input
          type="date"
          label="Due Date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          error={errors.dueDate}
          fullWidth
        />

        {/* Tags */}
        <div className="space-y-2">
          <Input
            label="Tags"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
            placeholder="Type and press Enter to add tags"
            helperText="Press Enter to add each tag"
            error={errors.tags}
            fullWidth
            maxLength={50}
          />

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Tag
                  key={tag}
                  color="blue"
                  onRemove={() => handleRemoveTag(tag)}
                >
                  {tag}
                </Tag>
              ))}
            </div>
          )}
        </div>

        {/* Submit error */}
        {errors.submit && (
          <p className="text-sm text-status-error">{errors.submit}</p>
        )}
      </form>
    </Modal>
  )
}
