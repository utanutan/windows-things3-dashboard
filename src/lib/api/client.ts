/**
 * Base API Client
 * Provides retry logic, timeout handling, and error management
 */

import { APIError, NetworkError } from '../types/api'
import { serverConfig } from '../config'

/**
 * Fetch options with retry configuration
 */
export interface FetchOptions extends RequestInit {
  /** Request timeout in milliseconds (default: from config) */
  timeout?: number
  /** Maximum retry attempts (default: from config) */
  maxRetries?: number
  /** Retry delay multiplier for exponential backoff (default: 1000ms) */
  retryDelay?: number
}

/**
 * Sleep utility for retry delays
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Fetch with timeout support
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeout: number
): Promise<Response> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    })
    clearTimeout(timeoutId)
    return response
  } catch (error) {
    clearTimeout(timeoutId)
    if (error instanceof Error && error.name === 'AbortError') {
      throw new NetworkError(`Request timeout after ${timeout}ms`)
    }
    throw error
  }
}

/**
 * Fetch with retry logic and exponential backoff
 *
 * @param url - Request URL
 * @param options - Fetch options with retry configuration
 * @returns Response object
 * @throws {NetworkError} On network failure after all retries
 * @throws {APIError} On API error response
 *
 * @example
 * const response = await fetchWithRetry('/api/tasks', {
 *   method: 'GET',
 *   timeout: 5000,
 *   maxRetries: 3,
 * })
 */
export async function fetchWithRetry(
  url: string,
  options: FetchOptions = {}
): Promise<Response> {
  const {
    timeout = serverConfig.apiTimeout,
    maxRetries = serverConfig.apiMaxRetries,
    retryDelay = 1000,
    ...fetchOptions
  } = options

  let lastError: Error | null = null

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetchWithTimeout(url, fetchOptions, timeout)

      // Don't retry on success or 4xx client errors (except 429 Too Many Requests)
      if (response.ok) {
        return response
      }

      if (response.status >= 400 && response.status < 500 && response.status !== 429) {
        throw await APIError.fromResponse(response)
      }

      // Retry on 5xx server errors or 429 Too Many Requests
      if (attempt < maxRetries - 1) {
        const delay = retryDelay * Math.pow(2, attempt) // Exponential backoff: 1s, 2s, 4s
        console.warn(
          `Request failed with status ${response.status}, retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries})`
        )
        await sleep(delay)
        continue
      }

      // Last attempt failed
      throw await APIError.fromResponse(response)
    } catch (error) {
      lastError = error as Error

      // Don't retry on APIError (non-retryable HTTP errors)
      if (error instanceof APIError) {
        throw error
      }

      // Retry on NetworkError (connection issues, timeouts)
      if (attempt < maxRetries - 1) {
        const delay = retryDelay * Math.pow(2, attempt)
        console.warn(
          `Network error: ${(error as Error).message}, retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries})`
        )
        await sleep(delay)
        continue
      }
    }
  }

  // All retries exhausted
  throw new NetworkError(
    `Request failed after ${maxRetries} attempts: ${lastError?.message || 'Unknown error'}`
  )
}

/**
 * JSON fetch helper - automatically parses JSON response
 *
 * @param url - Request URL
 * @param options - Fetch options
 * @returns Parsed JSON data
 * @throws {NetworkError} On network failure
 * @throws {APIError} On API error response
 *
 * @example
 * const tasks = await fetchJSON<Task[]>('/api/tasks/inbox')
 */
export async function fetchJSON<T>(
  url: string,
  options: FetchOptions = {}
): Promise<T> {
  const response = await fetchWithRetry(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  const data = await response.json()
  return data as T
}

/**
 * POST request helper with JSON body
 *
 * @param url - Request URL
 * @param body - Request body (will be JSON stringified)
 * @param options - Additional fetch options
 * @returns Parsed JSON response
 */
export async function postJSON<TRequest, TResponse>(
  url: string,
  body: TRequest,
  options: FetchOptions = {}
): Promise<TResponse> {
  return fetchJSON<TResponse>(url, {
    ...options,
    method: 'POST',
    body: JSON.stringify(body),
  })
}

/**
 * PUT request helper with JSON body
 *
 * @param url - Request URL
 * @param body - Request body (will be JSON stringified)
 * @param options - Additional fetch options
 * @returns Parsed JSON response
 */
export async function putJSON<TRequest, TResponse>(
  url: string,
  body: TRequest,
  options: FetchOptions = {}
): Promise<TResponse> {
  return fetchJSON<TResponse>(url, {
    ...options,
    method: 'PUT',
    body: JSON.stringify(body),
  })
}

/**
 * PATCH request helper with JSON body
 *
 * @param url - Request URL
 * @param body - Request body (will be JSON stringified)
 * @param options - Additional fetch options
 * @returns Parsed JSON response
 */
export async function patchJSON<TRequest, TResponse>(
  url: string,
  body: TRequest,
  options: FetchOptions = {}
): Promise<TResponse> {
  return fetchJSON<TResponse>(url, {
    ...options,
    method: 'PATCH',
    body: JSON.stringify(body),
  })
}

/**
 * DELETE request helper
 *
 * @param url - Request URL
 * @param options - Additional fetch options
 * @returns Parsed JSON response
 */
export async function deleteJSON<TResponse>(
  url: string,
  options: FetchOptions = {}
): Promise<TResponse> {
  return fetchJSON<TResponse>(url, {
    ...options,
    method: 'DELETE',
  })
}
