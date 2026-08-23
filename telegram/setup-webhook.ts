#!/usr/bin/env tsx

import { Telegraf } from 'telegraf'
import { config } from 'dotenv'

config({ path: '.env.local' })

const botToken = process.env.TELEGRAM_BOT_TOKEN
const webhookUrl = process.env.NEXTAUTH_URL

if (!botToken) {
  console.error('❌ TELEGRAM_BOT_TOKEN not set in .env.local')
  process.exit(1)
}

if (!webhookUrl) {
  console.error('❌ NEXTAUTH_URL not set in .env.local')
  process.exit(1)
}

const fullWebhookUrl = `${webhookUrl}/api/telegram/webhook`

const bot = new Telegraf(botToken)

async function setupWebhook() {
  try {
    console.log('🔧 Setting up Telegram webhook...')
    console.log(`   URL: ${fullWebhookUrl}`)

    // Delete existing webhook first
    await bot.telegram.deleteWebhook({ drop_pending_updates: true })
    console.log('   ✅ Deleted existing webhook')

    // Set new webhook
    await bot.telegram.setWebhook(fullWebhookUrl, {
      allowed_updates: ['message', 'callback_query'],
      drop_pending_updates: true,
    })
    console.log('   ✅ Webhook set successfully')

    // Verify
    const info = await bot.telegram.getWebhookInfo()
    console.log('\n📋 Webhook Info:')
    console.log(`   URL: ${info.url}`)
    console.log(`   Pending Updates: ${info.pending_update_count}`)
    console.log(`   Last Error: ${info.last_error_message || 'None'}`)
    console.log(`   Last Error Date: ${info.last_error_date ? new Date(info.last_error_date * 1000).toISOString() : 'Never'}`)

    // Get bot info
    const me = await bot.telegram.getMe()
    console.log('\n🤖 Bot Info:')
    console.log(`   Username: @${me.username}`)
    console.log(`   Name: ${me.first_name}`)
    console.log(`   ID: ${me.id}`)

    console.log('\n✅ Setup complete!')
    console.log('\n📝 Next steps:')
    console.log('   1. Deploy your app to Vercel')
    console.log('   2. Set environment variables in Vercel dashboard')
    console.log('   3. Run this script again after deployment')
    console.log('   4. Test with /start command in Telegram')

  } catch (error) {
    console.error('❌ Setup failed:', error)
    process.exit(1)
  }
}

setupWebhook()