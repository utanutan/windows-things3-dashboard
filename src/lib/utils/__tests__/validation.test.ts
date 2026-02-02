/**
 * Tests for validation utilities
 */

import {
  validateTaskTitle,
  validateProjectName,
  validateDateString,
  validateTag,
  validateTags,
  validateNotes,
  validateSearchQuery,
  sanitizeString,
} from '../validation'

describe('validation utilities', () => {
  describe('validateTaskTitle', () => {
    it('should accept valid titles', () => {
      expect(validateTaskTitle('Buy groceries').valid).toBe(true)
    })

    it('should reject empty titles', () => {
      expect(validateTaskTitle('').valid).toBe(false)
      expect(validateTaskTitle('   ').valid).toBe(false)
    })

    it('should reject titles over 500 characters', () => {
      const longTitle = 'a'.repeat(501)
      expect(validateTaskTitle(longTitle).valid).toBe(false)
    })
  })

  describe('validateProjectName', () => {
    it('should accept valid project names', () => {
      expect(validateProjectName('My Project').valid).toBe(true)
    })

    it('should reject empty names', () => {
      expect(validateProjectName('').valid).toBe(false)
    })

    it('should reject names over 200 characters', () => {
      const longName = 'a'.repeat(201)
      expect(validateProjectName(longName).valid).toBe(false)
    })
  })

  describe('validateDateString', () => {
    it('should accept valid ISO dates', () => {
      expect(validateDateString('2024-12-25').valid).toBe(true)
    })

    it('should accept empty dates (optional)', () => {
      expect(validateDateString('').valid).toBe(true)
    })

    it('should reject invalid formats', () => {
      expect(validateDateString('25-12-2024').valid).toBe(false)
      expect(validateDateString('12/25/2024').valid).toBe(false)
    })

    it('should reject invalid dates', () => {
      expect(validateDateString('2024-13-01').valid).toBe(false)
      expect(validateDateString('2024-02-30').valid).toBe(false)
    })
  })

  describe('validateTag', () => {
    it('should accept valid tags', () => {
      expect(validateTag('work').valid).toBe(true)
      expect(validateTag('high-priority').valid).toBe(true)
      expect(validateTag('tag_name').valid).toBe(true)
    })

    it('should reject empty tags', () => {
      expect(validateTag('').valid).toBe(false)
      expect(validateTag('   ').valid).toBe(false)
    })

    it('should reject tags with special characters', () => {
      expect(validateTag('tag@special').valid).toBe(false)
      expect(validateTag('tag#123').valid).toBe(false)
    })

    it('should reject tags over 50 characters', () => {
      const longTag = 'a'.repeat(51)
      expect(validateTag(longTag).valid).toBe(false)
    })
  })

  describe('validateTags', () => {
    it('should accept valid tag arrays', () => {
      expect(validateTags(['work', 'urgent']).valid).toBe(true)
    })

    it('should reject more than 10 tags', () => {
      const manyTags = Array(11).fill('tag')
      expect(validateTags(manyTags).valid).toBe(false)
    })

    it('should reject invalid tags in array', () => {
      expect(validateTags(['valid', 'invalid@tag']).valid).toBe(false)
    })
  })

  describe('validateNotes', () => {
    it('should accept valid notes', () => {
      expect(validateNotes('Some notes here').valid).toBe(true)
    })

    it('should accept empty notes (optional)', () => {
      expect(validateNotes('').valid).toBe(true)
    })

    it('should reject notes over 10000 characters', () => {
      const longNotes = 'a'.repeat(10001)
      expect(validateNotes(longNotes).valid).toBe(false)
    })
  })

  describe('validateSearchQuery', () => {
    it('should accept valid queries', () => {
      expect(validateSearchQuery('search term').valid).toBe(true)
    })

    it('should reject empty queries', () => {
      expect(validateSearchQuery('').valid).toBe(false)
      expect(validateSearchQuery('   ').valid).toBe(false)
    })

    it('should reject queries under 2 characters', () => {
      expect(validateSearchQuery('a').valid).toBe(false)
    })

    it('should reject queries over 200 characters', () => {
      const longQuery = 'a'.repeat(201)
      expect(validateSearchQuery(longQuery).valid).toBe(false)
    })
  })

  describe('sanitizeString', () => {
    it('should trim whitespace', () => {
      expect(sanitizeString('  hello  ')).toBe('hello')
    })

    it('should normalize multiple spaces', () => {
      expect(sanitizeString('hello    world')).toBe('hello world')
    })

    it('should handle mixed whitespace', () => {
      expect(sanitizeString('  hello   world  ')).toBe('hello world')
    })
  })
})
