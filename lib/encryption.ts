import CryptoJS from 'crypto-js'

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default-key-change-in-production-32b'

export function encrypt(data: unknown): string {
  const jsonString = JSON.stringify(data)
  return CryptoJS.AES.encrypt(jsonString, ENCRYPTION_KEY).toString()
}

export function decrypt(encryptedData: string): unknown {
  const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY)
  const decryptedString = bytes.toString(CryptoJS.enc.Utf8)
  return JSON.parse(decryptedString)
}

export function hashData(data: string): string {
  return CryptoJS.SHA256(data).toString()
}

export function generateEncryptionKey(): string {
  return CryptoJS.lib.WordArray.random(32).toString()
}