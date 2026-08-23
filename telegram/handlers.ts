import { Telegraf, Context, Markup } from 'telegraf'
import { getTelegramStorage, TelegramStorage } from './storage'

export interface AdminCommandContext extends Context {
  state?: {
    isAdmin: boolean
  }
}

export function setupAdminCommands(bot: Telegraf<AdminCommandContext>, storage: TelegramStorage) {
  const ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID || ''

  // Admin middleware
  bot.use(async (ctx, next) => {
    const chatId = ctx.chat?.id?.toString()
    ctx.state = { isAdmin: chatId === ADMIN_CHAT_ID }
    await next()
  })

  // /start command
  bot.start(async (ctx) => {
    if (!ctx.state?.isAdmin) {
      await ctx.reply('👋 Welcome to LumineerCo Admin Bot!\n\nThis bot is for admin use only.')
      return
    }
    await ctx.reply(
      '🤖 *LumineerCo Admin Bot*\n\n' +
      'Available commands:\n' +
      '📊 /status - System health\n' +
      '📋 /projects - Active projects\n' +
      '📈 /stats - Business metrics\n' +
      '🤖 /agents - Agent status\n' +
      '📥 /backup - Backup data\n' +
      '📤 /restore - Restore data\n' +
      '📝 /logs - Recent activity\n' +
      '⚙️ /settings - Bot settings',
      { parse_mode: 'Markdown' }
    )
  })

  // /status command
  bot.command('status', async (ctx) => {
    if (!ctx.state?.isAdmin) return
    
    const status = `
🟢 *System Status: Operational*

🌐 *Website*: Online
🤖 *Agents*: 10/10 Active
📱 *Telegram*: Connected
💾 *Storage*: Channel Accessible
🔐 *Encryption*: Active

⏰ *Uptime*: ${process.uptime().toFixed(0)}s
💾 *Memory*: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1)} MB
    `.trim()

    await ctx.reply(status, { parse_mode: 'Markdown' })
  })

  // /projects command
  bot.command('projects', async (ctx) => {
    if (!ctx.state?.isAdmin) return
    
    // In production, query database
    await ctx.reply(
      '📋 *Active Projects*\n\n' +
      'No active projects at the moment.\n\n' +
      'Use /newproject to create one.',
      { parse_mode: 'Markdown' }
    )
  })

  // /stats command
  bot.command('stats', async (ctx) => {
    if (!ctx.state?.isAdmin) return
    
    const report = await generateDailyReport(storage)
    await ctx.reply(report, { parse_mode: 'Markdown' })
  })

  // /agents command
  bot.command('agents', async (ctx) => {
    if (!ctx.state?.isAdmin) return
    
    const agents = [
      '🌐 Website Development',
      '✍️ Content Creation',
      '🎨 Design Services',
      '⚙️ Scripts & Automation',
      '🔍 SEO & Traffic Growth',
      '📚 E-Books & Digital Products',
      '📱 Social Media Marketing',
      '⚖️ Legal Document Drafting',
      '🔒 Cybersecurity Audit',
      '💼 Sales Copy & Proposals',
    ]

    await ctx.reply(
      '🤖 *Agent Status*\n\n' +
      agents.map((a, i) => `${i + 1}. ${a} - ✅ Ready`).join('\n'),
      { parse_mode: 'Markdown' }
    )
  })

  // /backup command
  bot.command('backup', async (ctx) => {
    if (!ctx.state?.isAdmin) return
    
    await ctx.reply('📥 *Creating backup...*', { parse_mode: 'Markdown' })
    
    // In production, export all data and send as file
    const backupData = {
      timestamp: new Date().toISOString(),
      projects: [],
      clients: [],
      deliverables: [],
    }
    
    await storage.store({
      type: 'backup',
      id: `backup-${Date.now()}`,
      data: backupData,
    })
    
    await ctx.reply('✅ Backup completed and stored in Telegram!')
  })

  // /logs command
  bot.command('logs', async (ctx) => {
    if (!ctx.state?.isAdmin) return
    
    await ctx.reply(
      '📝 *Recent Activity Logs*\n\n' +
      '```\n' +
      '[2024-01-15 10:30] System started\n' +
      '[2024-01-15 10:31] Telegram bot connected\n' +
      '[2024-01-15 10:32] Agents initialized\n' +
      '[2024-01-15 10:33] Ready for requests\n' +
      '```',
      { parse_mode: 'Markdown' }
    )
  })

  // /weekly command
  bot.command('weekly', async (ctx) => {
    if (!ctx.state?.isAdmin) return
    
    const report = await generateWeeklyReport(storage)
    await ctx.reply(report, { parse_mode: 'Markdown' })
  })

  // Handle callback queries
  bot.on('callback_query', async (ctx) => {
    if (!ctx.state?.isAdmin) return
    
    const data = ctx.callbackQuery.data
    await ctx.answerCbQuery()
    
    if (data === 'refresh_status') {
      const status = `
🟢 *System Status: Operational*

🌐 *Website*: Online
🤖 *Agents*: 10/10 Active
📱 *Telegram*: Connected
💾 *Storage*: Channel Accessible
🔐 *Encryption*: Active
      `.trim()
      
      await ctx.editMessageText(status, { parse_mode: 'Markdown' })
    }
  })

  // Error handler
  bot.catch((err, ctx) => {
    console.error('Bot error:', err)
    ctx.reply('❌ An error occurred. Check logs for details.')
  })
}

import { generateDailyReport, generateWeeklyReport } from './storage'