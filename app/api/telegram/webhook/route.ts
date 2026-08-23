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
    const update = await request.json()
    await bot.handleUpdate(update)
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}

// Setup webhook (call once)
export async function GET() {
  try {
    const webhookUrl = `${process.env.NEXTAUTH_URL}/api/telegram/webhook`
    await bot.telegram.setWebhook(webhookUrl, {
      allowed_updates: ['message', 'callback_query'],
      drop_pending_updates: true,
    })
    return NextResponse.json({ ok: true, url: webhookUrl })
  } catch (error) {
    console.error('Webhook setup error:', error)
    return NextResponse.json({ ok: false, error: String(error) }, { status: 500 })
  }
}