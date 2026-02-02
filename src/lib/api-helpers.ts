/**
 * API Route Helper Functions
 * Shared utilities for API routes (security, error handling, rate limiting)
 */

import { NextResponse } from 'next/server'
import { checkRateLimit, getClientIP } from './rate-limit'

/**
 * Handle API errors with proper sanitization
 * @param error - Error object
 * @param context - Error context for logging
 * @returns NextResponse with sanitized error
 */
export function handleAPIError(error: unknown, context: string): NextResponse {
  // Log detailed error server-side
  console.error(`[API Error] ${context}:`, error)

  // Return sanitized error to client
  const isDevelopment = process.env.NODE_ENV === 'development'

  return NextResponse.json(
    {
      error: isDevelopment && error instanceof Error
        ? error.message
        : 'Internal server error. Please try again later.'
    },
    { status: 500 }
  )
}

/**
 * Apply rate limiting to API route
 * @param request - Next.js request object
 * @param config - Rate limit configuration
 * @returns null if allowed, NextResponse with 429 if rate limited
 */
export function applyRateLimit(
  request: Request,
  config?: { windowMs?: number; max?: number }
): NextResponse | null {
  const clientIP = getClientIP(request)
  const rateLimit = checkRateLimit(clientIP, config)

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': String(config?.max || 100),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': new Date(rateLimit.resetTime).toISOString(),
        }
      }
    )
  }

  return null // Allowed
}
