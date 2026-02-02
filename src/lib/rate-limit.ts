/**
 * Rate Limiting Utility
 * Simple in-memory rate limiter for API routes
 */

interface RateLimitEntry {
  count: number
  resetTime: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

export interface RateLimitConfig {
  /** Time window in milliseconds */
  windowMs: number
  /** Maximum number of requests per window */
  max: number
}

/**
 * Default rate limit configuration
 * 100 requests per 15 minutes per IP
 */
const DEFAULT_CONFIG: RateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
}

/**
 * Clean up expired entries periodically
 */
function cleanupExpiredEntries() {
  const now = Date.now()
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key)
    }
  }
}

// Run cleanup every minute
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupExpiredEntries, 60 * 1000)
}

/**
 * Check if request is rate limited
 * @param identifier - Unique identifier (usually IP address)
 * @param config - Rate limit configuration
 * @returns true if allowed, false if rate limited
 */
export function checkRateLimit(
  identifier: string,
  config: Partial<RateLimitConfig> = {}
): { allowed: boolean; remaining: number; resetTime: number } {
  const { windowMs, max } = { ...DEFAULT_CONFIG, ...config }
  const now = Date.now()
  const resetTime = now + windowMs

  const entry = rateLimitStore.get(identifier)

  if (!entry || now > entry.resetTime) {
    // New window or expired entry
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime,
    })
    return {
      allowed: true,
      remaining: max - 1,
      resetTime,
    }
  }

  // Increment count
  entry.count++

  if (entry.count > max) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
    }
  }

  return {
    allowed: true,
    remaining: max - entry.count,
    resetTime: entry.resetTime,
  }
}

/**
 * Get client IP address from request headers
 * @param request - Next.js request object
 * @returns IP address or 'unknown'
 */
export function getClientIP(request: Request): string {
  // Try various headers used by proxies/load balancers
  const headers = request.headers
  const forwarded = headers.get('x-forwarded-for')
  const realIP = headers.get('x-real-ip')
  const cfIP = headers.get('cf-connecting-ip')

  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  if (realIP) {
    return realIP.trim()
  }
  if (cfIP) {
    return cfIP.trim()
  }

  return 'unknown'
}
