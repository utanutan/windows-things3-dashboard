/**
 * Application Configuration
 * Type-safe access to environment variables
 */

/**
 * Get environment variable with fallback
 */
function getEnv(key: string, fallback?: string): string {
  const value = process.env[key]
  if (value === undefined) {
    if (fallback !== undefined) {
      return fallback
    }
    throw new Error(`Missing required environment variable: ${key}`)
  }
  return value
}

/**
 * Get boolean environment variable
 */
function getEnvBoolean(key: string, fallback: boolean = false): boolean {
  const value = process.env[key]
  if (value === undefined) return fallback
  return value === 'true' || value === '1'
}

/**
 * Get number environment variable
 */
function getEnvNumber(key: string, fallback: number): number {
  const value = process.env[key]
  if (value === undefined) return fallback
  const parsed = parseInt(value, 10)
  if (isNaN(parsed)) {
    console.warn(`Invalid number for ${key}: ${value}, using fallback: ${fallback}`)
    return fallback
  }
  return parsed
}

/**
 * Client-side configuration (publicly accessible)
 */
export const clientConfig = {
  /** API base URL for client-side requests (proxied through Next.js Route Handlers) */
  apiBaseUrl: '/api',

  /** Auto-refresh interval in milliseconds (default: 60 seconds) */
  autoRefreshInterval: getEnvNumber('NEXT_PUBLIC_AUTO_REFRESH_INTERVAL', 60000),
} as const

/**
 * Server-side configuration (NOT accessible from client)
 * SECURITY: Mock mode moved to server-side only
 */
export const serverConfig = {
  /** Mock mode toggle (use mock data instead of real API) - SERVER ONLY */
  mockMode: getEnvBoolean('MOCK_MODE', process.env.NODE_ENV === 'development'),

  /** Mac API base URL (only used on server-side) */
  apiBaseUrl: getEnv('API_BASE_URL', 'http://localhost:8000'),

  /** API request timeout in milliseconds */
  apiTimeout: getEnvNumber('API_TIMEOUT', 10000),

  /** Maximum number of retry attempts for failed requests */
  apiMaxRetries: getEnvNumber('API_MAX_RETRIES', 3),
} as const

/**
 * Check if code is running on server-side
 */
export const isServer = typeof window === 'undefined'

/**
 * Check if code is running on client-side
 */
export const isClient = typeof window !== 'undefined'

/**
 * Get full config (server-side only)
 * @throws Error if called from client-side
 */
export function getFullConfig() {
  if (isClient) {
    throw new Error('getFullConfig() can only be called on server-side')
  }
  return {
    ...clientConfig,
    ...serverConfig,
  }
}

/**
 * Validate required environment variables on server startup
 */
export function validateConfig(): void {
  if (isServer) {
    try {
      // Validate server config
      if (!serverConfig.apiBaseUrl) {
        throw new Error('API_BASE_URL is required')
      }

      // Validate timeout and retries
      if (serverConfig.apiTimeout < 1000) {
        console.warn('API_TIMEOUT is too low (< 1000ms), may cause frequent timeouts')
      }
      if (serverConfig.apiMaxRetries < 1) {
        console.warn('API_MAX_RETRIES is less than 1, no retries will be attempted')
      }

      console.log('✓ Configuration validated successfully')
      console.log(`  - API Base URL: ${serverConfig.apiBaseUrl}`)
      console.log(`  - Mock Mode: ${serverConfig.mockMode}`)
      console.log(`  - Auto Refresh: ${clientConfig.autoRefreshInterval}ms`)
    } catch (error) {
      console.error('Configuration validation failed:', error)
      throw error
    }
  }
}

// Auto-validate on module load (server-side only)
if (isServer && process.env.NODE_ENV !== 'test') {
  validateConfig()
}
