import { NextResponse } from 'next/server'
import { getTelegramStorage } from '@/telegram/storage'

export async function GET() {
  const checks = {
    timestamp: new Date().toISOString(),
    status: 'healthy' as 'healthy' | 'degraded' | 'unhealthy',
    services: {} as Record<string, { status: string; latency?: number; error?: string }>,
  }

  // Check Telegram storage
  try {
    const storage = getTelegramStorage({
      botToken: process.env.TELEGRAM_BOT_TOKEN || '',
      adminChatId: process.env.TELEGRAM_ADMIN_CHAT_ID || '',
      storageChannelId: process.env.TELEGRAM_STORAGE_CHANNEL_ID || '',
    })

    const start = Date.now()
    await storage.testConnection()
    checks.services.telegram = { status: 'ok', latency: Date.now() - start }
  } catch (error) {
    checks.services.telegram = { status: 'error', error: String(error) }
    checks.status = 'degraded'
  }

  // Check AI providers
  try {
    if (process.env.OPENAI_API_KEY) {
      checks.services.openai = { status: 'configured' }
    } else {
      checks.services.openai = { status: 'not_configured' }
    }

    if (process.env.ANTHROPIC_API_KEY) {
      checks.services.anthropic = { status: 'configured' }
    } else {
      checks.services.anthropic = { status: 'not_configured' }
    }
  } catch (error) {
    checks.services.ai = { status: 'error', error: String(error) }
  }

  // Check environment
  const requiredEnv = [
    'TELEGRAM_BOT_TOKEN',
    'TELEGRAM_ADMIN_CHAT_ID',
    'TELEGRAM_STORAGE_CHANNEL_ID',
    'ENCRYPTION_KEY',
    'NEXTAUTH_SECRET',
  ]

  const missingEnv = requiredEnv.filter((key) => !process.env[key])
  if (missingEnv.length > 0) {
    checks.services.environment = { status: 'missing_vars', error: missingEnv.join(', ') }
    checks.status = 'unhealthy'
  } else {
    checks.services.environment = { status: 'ok' }
  }

  const statusCode = checks.status === 'healthy' ? 200 : checks.status === 'degraded' ? 200 : 503

  return NextResponse.json(checks, { status: statusCode })
}