import { z } from 'zod'

// Common validation schemas
export const emailSchema = z.string().email('Invalid email format')
export const urlSchema = z.string().url('Invalid URL format')
export const phoneSchema = z.string().regex(/^[\d\s\-\+\(\)]{10,}$/, 'Invalid phone number')
export const dateSchema = z.string().datetime('Invalid date format')
export const uuidSchema = z.string().uuid('Invalid UUID format')

// Pagination schema
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).default('desc'),
})

// Project schemas
export const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(200),
  description: z.string().max(5000).optional(),
  clientId: z.string().min(1, 'Client ID is required'),
  service: z.enum([
    'website-dev',
    'content',
    'design',
    'scripts',
    'seo',
    'ebooks',
    'social',
    'legal',
    'security',
    'sales',
  ]),
  budget: z.number().positive().optional(),
  timeline: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
})

export const projectUpdateSchema = projectSchema.partial()

// Client schemas
export const clientSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  email: emailSchema,
  phone: phoneSchema.optional(),
  company: z.string().max(200).optional(),
  notes: z.string().max(5000).optional(),
})

export const clientUpdateSchema = clientSchema.partial()

// Deliverable schemas
export const deliverableSchema = z.object({
  projectId: z.string().min(1, 'Project ID is required'),
  type: z.enum(['design', 'code', 'document', 'content', 'report', 'other']),
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(5000).optional(),
  files: z.array(z.object({
    name: z.string(),
    url: urlSchema,
    size: z.number().positive(),
    mimeType: z.string(),
  })).optional(),
})

// Agent task schemas
export const agentTaskSchema = z.object({
  service: z.string().min(1, 'Service is required'),
  clientId: z.string().min(1, 'Client ID is required'),
  projectId: z.string().min(1, 'Project ID is required'),
  input: z.record(z.unknown()),
})

// Contact form schema
export const contactFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: emailSchema,
  service: z.string().min(1, 'Service is required'),
  budget: z.string().optional(),
  timeline: z.string().optional(),
  message: z.string().min(20, 'Message must be at least 20 characters').max(5000),
})

// Admin login schema
export const adminLoginSchema = z.object({
  password: z.string().min(1, 'Password is required'),
})

// Validation helper functions
export function validateSchema<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; errors: z.ZodFormattedError<T> } {
  const result = schema.safeParse(data)
  if (result.success) {
    return { success: true, data: result.data }
  }
  return { success: false, errors: result.error.format() }
}

export function formatValidationErrors(errors: z.ZodFormattedError<any>): string[] {
  const messages: string[] = []
  
  function extractErrors(obj: any, prefix = '') {
    for (const [key, value] of Object.entries(obj)) {
      if (key === '_errors' && Array.isArray(value)) {
        value.forEach(err => messages.push(`${prefix}${err}`))
      } else if (typeof value === 'object' && value !== null) {
        extractErrors(value, `${prefix}${key}.`)
      }
    }
  }
  
  extractErrors(errors)
  return messages
}

// Rate limiting helper (simple in-memory)
interface RateLimitEntry {
  count: number
  resetAt: number
}

const rateLimitMap = new Map<string, RateLimitEntry>()

export function checkRateLimit(
  key: string,
  maxRequests: number = 100,
  windowMs: number = 60000
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now()
  const entry = rateLimitMap.get(key)
  
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: maxRequests - 1, resetAt: now + windowMs }
  }
  
  if (entry.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt }
  }
  
  entry.count++
  return { allowed: true, remaining: maxRequests - entry.count, resetAt: entry.resetAt }
}

// Sanitize input to prevent XSS
export function sanitizeInput(input: string): string {
  return input
    .replace(/&/g, '&')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"')
    .replace(/'/g, ''')
    .replace(/\//g, '&#x2F;')
}

// Validate file upload
export function validateFileUpload(
  file: { name: string; size: number; type: string },
  options: {
    maxSize?: number
    allowedTypes?: string[]
    allowedExtensions?: string[]
  } = {}
): { valid: boolean; error?: string } {
  const { maxSize = 10 * 1024 * 1024, allowedTypes = [], allowedExtensions = [] } = options
  
  if (file.size > maxSize) {
    return { valid: false, error: `File size exceeds ${maxSize / 1024 / 1024}MB limit` }
  }
  
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return { valid: false, error: `File type ${file.type} not allowed` }
  }
  
  if (allowedExtensions.length > 0) {
    const ext = file.name.split('.').pop()?.toLowerCase()
    if (!ext || !allowedExtensions.includes(ext)) {
      return { valid: false, error: `File extension not allowed` }
    }
  }
  
  return { valid: true }
}

// Common error response
export function createErrorResponse(message: string, status: number = 500, details?: unknown) {
  return {
    success: false,
    message,
    ...(details && { details }),
  }
}

export function createSuccessResponse<T>(data: T, message?: string) {
  return {
    success: true,
    data,
    ...(message && { message }),
  }
}