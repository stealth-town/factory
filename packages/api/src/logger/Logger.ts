import winston from 'winston'
import path from 'path'

const { 
  combine,
  timestamp,
  printf,
  colorize,
  errors,
  json
} = winston.format

/**
 * Custom log format for console output
 */
const consoleFormat = printf(({ level, message, timestamp, ...metadata }) => {
  let msg = `${timestamp} [${level}]: ${message}`

  // Add metadata if exists
  if (Object.keys(metadata).length > 0) {
    msg += ` ${JSON.stringify(metadata)}`
  }

  return msg
})

/**
 * Create Winston logger instance
 */
const createLogger = () => {
  const isDevelopment = process.env.NODE_ENV !== 'production'

  const transports: winston.transport[] = [
    // Console transport (always enabled)
    new winston.transports.Console({
      format: combine(
        colorize(),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        errors({ stack: true }),
        consoleFormat
      ),
    }),
  ]

  // Add file transports in production
  if (!isDevelopment) {
    transports.push(
      // Error logs
      new winston.transports.File({
        filename: path.join(process.cwd(), 'logs', 'error.log'),
        level: 'error',
        format: combine(
          timestamp(),
          errors({ stack: true }),
          json()
        ),
      }),
      // Combined logs
      new winston.transports.File({
        filename: path.join(process.cwd(), 'logs', 'combined.log'),
        format: combine(
          timestamp(),
          json()
        ),
      })
    )
  }

  return winston.createLogger({
    level: isDevelopment ? 'debug' : 'info',
    format: combine(
      timestamp(),
      errors({ stack: true }),
      json()
    ),
    transports,
    // Don't exit on handled exceptions
    exitOnError: false,
  })
}

/**
 * Global logger instance
 */
export const logger = createLogger()

/**
 * Create a child logger with additional context
 * Useful for request-scoped logging
 */
export const createChildLogger = (context: Record<string, any>) => {
  return logger.child(context)
}

export default logger
