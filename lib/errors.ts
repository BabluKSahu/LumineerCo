// Error handling utilities

export class AppError extends Error {
  public readonly statusCode: number
  public readonly isOperational: boolean
  public readonly code: string
  public readonly details?: unknown

  constructor(
    message: string,
    statusCode: number = 500,
    code: string = 'INTERNAL_ERROR',
    details?: unknown
  ) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = true
    this.code = code
    this.details = details

    Object.setPrototypeOf(this, AppError.prototype)
  }

  static badRequest(message: string, details?: unknown) {
    return new AppError(message, 400, 'BAD_REQUEST', details)
  }

  static unauthorized(message: string = 'Unauthorized', details?: unknown) {
    return new AppError(message, 401, 'UNAUTHORIZED', details)
  }

  static forbidden(message: string = 'Forbidden', details?: unknown) {
    return new AppError(message, 403, 'FORBIDDEN', details)
  }

  static notFound(message: string = 'Not found', details?: unknown) {
    return new AppError(message, 404, 'NOT_FOUND', details)
  }

  static conflict(message: string, details?: unknown) {
    return new AppError(message, 409, 'CONFLICT', details)
  }

  static tooManyRequests(message: string = 'Too many requests', details?: unknown) {
    return new AppError(message, 429, 'TOO_MANY_REQUESTS', details)
  }

  static internal(message: string = 'Internal server error', details?: unknown) {
    return new AppError(message, 500, 'INTERNAL_ERROR', details)
  }

  static serviceUnavailable(message: string = 'Service unavailable', details?: unknown) {
    return new AppError(message, 503, 'SERVICE_UNAVAILABLE', details)
  }
}

export interface ErrorResponse {
  success: false
  error: {
    code: string
    message: string
    details?: unknown
  }
}

export function formatErrorResponse(error: Error | AppError): ErrorResponse {
  if (error instanceof AppError) {
    return {
      success: false,
      error: {
        code: error.code,
        message: error.message,
        ...(error.details && { details: error.details }),
      },
    }
  }

  // Handle Zod errors
  if (error.name === 'ZodError') {
    return {
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: error.flatten ? error.flatten().fieldErrors : error.message,
      },
    }
  }

  // Handle other known errors
  if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
    return {
      success: false,
      error: {
        code: 'INVALID_TOKEN',
        message: 'Invalid or expired token',
      },
    }
  }

  // Default error
  return {
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: process.env.NODE_ENV === 'production' 
        ? 'An unexpected error occurred' 
        : error.message,
    },
  }
}

export function handleApiError(error: unknown): NextResponse {
  if (error instanceof AppError) {
    return NextResponse.json(formatErrorResponse(error), { status: error.statusCode })
  }

  console.error('Unhandled error:', error)
  
  const response = formatErrorResponse(error as Error)
  return NextResponse.json(response, { status: 500 })
}

// Async wrapper for API routes
export function asyncHandler(
  handler: (request: NextRequest) => Promise<NextResponse>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      return await handler(request)
    } catch (error) {
      return handleApiError(error)
    }
  }
}

// Validation error formatter
export function formatValidationError(error: Error): string[] {
  if (error.name === 'ZodError' && error.errors) {
    return error.errors.map(e => `${e.path.join('.')}: ${e.message}`)
  }
  return [error.message]
}

// Check if error is operational (expected)
export function isOperationalError(error: Error): boolean {
  if (error instanceof AppError) {
    return error.isOperational
  }
  return false
}

// Retry wrapper with exponential backoff
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number
    baseDelay?: number
    maxDelay?: number
    retriableErrors?: string[]
  } = {}
): Promise<T> {
  const { maxRetries = 3, baseDelay = 1000, maxDelay = 10000, retriableErrors = [] } = options
  
  let lastError: Error
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error
      
      // Don't retry on last attempt
      if (attempt === maxRetries) break
      
      // Check if error is retriable
      const isRetriable = retriableErrors.length === 0 || 
        retriableErrors.some(e => error instanceof Error && error.message.includes(e))
      
      if (!isRetriable) {
        throw error
      }
      
      // Exponential backoff with jitter
      const delay = Math.min(
        baseDelay * Math.pow(2, attempt) + Math.random() * 1000,
        maxDelay
      )
      
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
  
  throw lastError!
}

// Circuit breaker pattern
export class CircuitBreaker {
  private failures = 0
  private lastFailure = 0
  private state: 'closed' | 'open' | 'half-open' = 'closed'
  
  constructor(
    private threshold: number = 5,
    private timeout: number = 60000,
    private resetTimeout: number = 30000
  ) {}
  
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'open') {
      if (Date.now() - this.lastFailure > this.resetTimeout) {
        this.state = 'half-open'
      } else {
        throw new AppError('Circuit breaker is open', 503, 'CIRCUIT_OPEN')
      }
    }
    
    try {
      const result = await fn()
      this.onSuccess()
      return result
    } catch (error) {
      this.onFailure()
      throw error
    }
  }
  
  private onSuccess() {
    this.failures = 0
    this.state = 'closed'
  }
  
  private onFailure() {
    this.failures++
    this.lastFailure = Date.now()
    
    if (this.failures >= this.threshold) {
      this.state = 'open'
    }
  }
  
  getState() {
    return this.state
  }
}

// Import NextResponse for the asyncHandler
import { NextRequest, NextResponse } from 'next/server'