import crypto from 'crypto'

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY
if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length < 32) {
  throw new Error('ENCRYPTION_KEY must be set and at least 32 characters long')
}

const ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 16
const SALT_LENGTH = 32
const TAG_LENGTH = 16
const KEY_LENGTH = 32

function getKey(): Buffer {
  return crypto.scryptSync(ENCRYPTION_KEY, 'lumineerco-salt', KEY_LENGTH)
}

export function encrypt(data: unknown): string {
  const jsonString = JSON.stringify(data)
  const iv = crypto.randomBytes(IV_LENGTH)
  const key = getKey()
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv)
  
  let encrypted = cipher.update(jsonString, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  
  const authTag = cipher.getAuthTag()
  
  // Combine IV + encrypted data + auth tag
  const combined = Buffer.concat([
    iv,
    Buffer.from(encrypted, 'hex'),
    authTag
  ])
  
  return combined.toString('base64')
}

export function decrypt(encryptedData: string): unknown {
  const combined = Buffer.from(encryptedData, 'base64')
  const iv = combined.subarray(0, IV_LENGTH)
  const authTag = combined.subarray(combined.length - TAG_LENGTH)
  const encrypted = combined.subarray(IV_LENGTH, combined.length - TAG_LENGTH)
  
  const key = getKey()
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)
  decipher.setAuthTag(authTag)
  
  let decrypted = decipher.update(encrypted, undefined, 'utf8')
  decrypted += decipher.final('utf8')
  
  return JSON.parse(decrypted)
}

export function hashData(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex')
}

export function generateEncryptionKey(): string {
  return crypto.randomBytes(32).toString('base64')
}