import { NextRequest, NextResponse } from 'next/server'
import { Telegraf } from 'telegraf'
import { setupAdminCommands } from '@/telegram/handlers'
import { getTelegramStorage } from '@/telegram/storage'

// Initialize bot for webhook
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN || '')
const storage = getTelegramStorage({
  botToken: process.env.TELEGRAM_BOT_TOKEN || '',
  adminChatId: process.env.TELEGRAM_ADMIN_CHAT_ID || '',
  storageChannelId: process.env.TELEGRAM_STORAGE_CHANNEL_ID || '',
})

setupAdminCommands(bot, storage)

// Handle webhook
export async function POST(request: NextRequest) {
  try {
    // Verify secret token if set
    const secretToken = request.headers.get('x-telegram-bot-api-secret-token')
    if (process.env.TELEGRAM_WEBHOOK_SECRET && secretToken !== process.env.TELEGRAM_WEBHOOK_SECRET) {
      return NextResponse.json({ ok: false, error: 'Invalid secret token' }, { status: 401 })
    }

    const update = await request.json()
    await bot.handleUpdate(update)
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ ok: false, error: 'Internal server error' }, { status: 500 })
  }
}

// Setup webhook (call once)
export async function GET() {
  try {
    const webhookUrl = `${process.env.NEXTAUTH_URL}/api/telegram/webhook`
    
    // Delete existing webhook first
    await bot.telegram.deleteWebhook({ drop_pending_updates: true })
    
    // Set new webhook with secret token if configured
    const options: any = {
      allowed_updates: ['message', 'callback_query', 'edited_message', 'channel_post'],
      drop_pending_updates: true,
    }
    
    if (process.env.TELEGRAM_WEBHOOK_SECRET) {
      options.secret_token = process.env.TELEGRAM_WEBHOOK_SECRET
    }
    
    await bot.telegram.setWebhook(webhookUrl, options)
    
    // Verify webhook
    const info = await bot.telegram.getWebhookInfo()
    
    return NextResponse.json({ 
      ok: true, 
      url: webhookUrl,
      info: {
        url: info.url,
        pendingUpdates: info.pending_update_count,
        lastError: info.last_error_message,
        lastErrorDate: info.last_error_date ? new Date(info.last_error_date * 1000).toISOString() : null,
      }
    })
  } catch (error) {
    console.error('Webhook setup error:', error)
    return NextResponse.json({ ok: false, error: String(error) }, { status: 500 })
  }
}

// Health check endpoint
export async function HEAD() {
  return new NextResponse(null, { status: 200 })
}