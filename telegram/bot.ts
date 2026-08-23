import { Telegraf } from 'telegraf'
import { getTelegramStorage, TelegramStorage } from './storage'
import { setupAdminCommands } from './handlers'

const config = {
  botToken: process.env.TELEGRAM_BOT_TOKEN || '',
  adminChatId: process.env.TELEGRAM_ADMIN_CHAT_ID || '',
  storageChannelId: process.env.TELEGRAM_STORAGE_CHANNEL_ID || '',
}

if (!config.botToken) {
  console.error('TELEGRAM_BOT_TOKEN not set')
  process.exit(1)
}

const storage = getTelegramStorage(config)
const bot = storage.getBot()

// Setup admin commands
setupAdminCommands(bot, storage)

// Initialize storage
storage.initialize().then(() => {
  console.log('✅ Telegram bot fully initialized')
  
  // Send startup notification
  storage.notifyAdmin(
    '🚀 *LumineerCo Bot Started*\n\n' +
    'All systems operational. Ready to serve.',
    { parse_mode: 'Markdown' }
  )
}).catch((err) => {
  console.error('Failed to initialize:', err)
  process.exit(1)
})

// Graceful shutdown
process.once('SIGINT', () => {
  storage.stop()
  console.log('Bot stopped')
})

process.once('SIGTERM', () => {
  storage.stop()
  console.log('Bot stopped')
})

export { bot, storage }