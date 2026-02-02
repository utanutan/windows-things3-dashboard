/**
 * Application Logger
 * Pino-based structured logging with file and console output
 */

import pino from 'pino';
import { isServer } from './config';

// Log level from environment variable
const LOG_LEVEL = process.env.LOG_LEVEL || 'info';

// Log file path
const LOG_FILE = process.env.LOG_FILE || './logs/app.log';

/**
 * Create server-side logger with file output
 */
function createServerLogger(): pino.Logger {
    // Use pino with file transport
    return pino({
        level: LOG_LEVEL,
        formatters: {
            level: (label) => ({ level: label }),
        },
        timestamp: pino.stdTimeFunctions.isoTime,
        base: {
            source: 'things3-dashboard',
        },
    }, pino.destination({
        dest: LOG_FILE,
        sync: false, // Async for better performance
        mkdir: true, // Create logs directory if needed
    }));
}

/**
 * Create client-side logger (console only)
 */
function createClientLogger(): pino.Logger {
    return pino({
        level: LOG_LEVEL,
        browser: {
            asObject: true,
        },
    });
}

/**
 * Main logger instance
 */
export const logger: pino.Logger = isServer
    ? createServerLogger()
    : createClientLogger();

/**
 * Create a child logger with additional context
 * @param bindings - Additional log fields
 */
export function createLogger(bindings: Record<string, unknown>): pino.Logger {
    return logger.child(bindings);
}

/**
 * Flush logs (ensure all buffered logs are written)
 */
export async function flushLogs(): Promise<void> {
    if (isServer) {
        return new Promise((resolve) => {
            (logger as pino.Logger & { flush?: (cb: () => void) => void }).flush?.(() => resolve());
            // Fallback timeout if flush not available
            setTimeout(resolve, 100);
        });
    }
}

// Export types
export type { Logger } from 'pino';
