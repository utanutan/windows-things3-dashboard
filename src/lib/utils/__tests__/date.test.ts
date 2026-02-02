/**
 * Tests for date utilities
 */

import {
  formatDate,
  formatRelativeDate,
  isOverdue,
  isToday,
  parseDate,
  toISODateString,
  getDateStatus,
} from '../date'

describe('date utilities', () => {
  describe('formatDate', () => {
    it('should format ISO date string', () => {
      const result = formatDate('2024-12-25')
      expect(result).toContain('Dec')
      expect(result).toContain('25')
    })

    it('should handle invalid dates', () => {
      expect(formatDate('invalid')).toBe('invalid')
    })
  })

  describe('formatRelativeDate', () => {
    it('should return "Today" for today\'s date', () => {
      const today = new Date()
      const isoDate = toISODateString(today)
      expect(formatRelativeDate(isoDate)).toBe('Today')
    })

    it('should return "Tomorrow" for tomorrow\'s date', () => {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      const isoDate = toISODateString(tomorrow)
      expect(formatRelativeDate(isoDate)).toBe('Tomorrow')
    })

    it('should return "Yesterday" for yesterday\'s date', () => {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const isoDate = toISODateString(yesterday)
      expect(formatRelativeDate(isoDate)).toBe('Yesterday')
    })
  })

  describe('isOverdue', () => {
    it('should return true for past dates', () => {
      expect(isOverdue('2020-01-01')).toBe(true)
    })

    it('should return false for today', () => {
      const today = toISODateString(new Date())
      expect(isOverdue(today)).toBe(false)
    })

    it('should return false for future dates', () => {
      expect(isOverdue('2030-01-01')).toBe(false)
    })
  })

  describe('isToday', () => {
    it('should return true for today\'s date', () => {
      const today = toISODateString(new Date())
      expect(isToday(today)).toBe(true)
    })

    it('should return false for other dates', () => {
      expect(isToday('2020-01-01')).toBe(false)
      expect(isToday('2030-01-01')).toBe(false)
    })
  })

  describe('parseDate', () => {
    it('should parse valid ISO date', () => {
      const result = parseDate('2024-12-25')
      expect(result).toBeInstanceOf(Date)
      expect(result?.getFullYear()).toBe(2024)
    })

    it('should return null for invalid dates', () => {
      expect(parseDate('invalid')).toBeNull()
    })
  })

  describe('toISODateString', () => {
    it('should format Date to ISO string', () => {
      const date = new Date('2024-12-25')
      expect(toISODateString(date)).toBe('2024-12-25')
    })
  })

  describe('getDateStatus', () => {
    it('should return "overdue" for past dates', () => {
      expect(getDateStatus('2020-01-01')).toBe('overdue')
    })

    it('should return "today" for today\'s date', () => {
      const today = toISODateString(new Date())
      expect(getDateStatus(today)).toBe('today')
    })

    it('should return "upcoming" for future dates', () => {
      expect(getDateStatus('2030-01-01')).toBe('upcoming')
    })
  })
})
