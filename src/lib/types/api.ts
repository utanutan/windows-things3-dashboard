/**
 * API Type Definitions
 * Common types for API communication
 */

/**
 * Health check response
 */
export interface HealthResponse {
  /** Server status */
  status: 'ok' | 'error'
  /** Response timestamp (ISO format) */
  timestamp?: string
  /** API version */
  version?: string
}

/**
 * Generic API error response
 */
export interface APIErrorResponse {
  /** Error message */
  error: string
  /** Error details (optional) */
  details?: string
  /** HTTP status code */
  status?: number
}

/**
 * Custom API Error class
 */
export class APIError extends Error {
  public readonly status: number
  public readonly details?: string

  constructor(message: string, status: number = 500, details?: string) {
    super(message)
    this.name = 'APIError'
    this.status = status
    this.details = details
    Object.setPrototypeOf(this, APIError.prototype)
  }

  /**
   * Create APIError from Response object
   */
  static async fromResponse(response: Response): Promise<APIError> {
    let message = `API Error: ${response.statusText}`
    let details: string | undefined

    try {
      const data = await response.json()
      if (data.error) {
        message = data.error
      }
      if (data.details) {
        details = data.details
      }
    } catch {
      // Failed to parse JSON, use default message
    }

    return new APIError(message, response.status, details)
  }

  /**
   * Convert to plain object
   */
  toJSON(): APIErrorResponse {
    return {
      error: this.message,
      details: this.details,
      status: this.status,
    }
  }
}

/**
 * Network error (connection failed, timeout, etc.)
 */
export class NetworkError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'NetworkError'
    Object.setPrototypeOf(this, NetworkError.prototype)
  }
}

/**
 * Type guard for HealthResponse
 */
export function isHealthResponse(value: unknown): value is HealthResponse {
  if (typeof value !== 'object' || value === null) return false
  const health = value as Record<string, unknown>

  return (
    (health.status === 'ok' || health.status === 'error') &&
    (health.timestamp === undefined || typeof health.timestamp === 'string') &&
    (health.version === undefined || typeof health.version === 'string')
  )
}

/**
 * Type guard for APIErrorResponse
 */
export function isAPIErrorResponse(value: unknown): value is APIErrorResponse {
  if (typeof value !== 'object' || value === null) return false
  const error = value as Record<string, unknown>

  return (
    typeof error.error === 'string' &&
    (error.details === undefined || typeof error.details === 'string') &&
    (error.status === undefined || typeof error.status === 'number')
  )
}
