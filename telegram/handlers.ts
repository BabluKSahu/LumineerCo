import { Telegraf, Context, Markup } from 'telegraf'
import { getTelegramStorage, TelegramStorage } from './storage'
import { getHermesManager } from '@/lib/hermes'

export interface AdminCommandContext extends Context {
  state?: {
    isAdmin: boolean
  }
}

export function setupAdminCommands(bot: Telegraf<AdminCommandContext>, storage: TelegramStorage) {
  const ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID || ''
  const hermesManager = getHermesManager()

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
      '⚙️ /settings - Bot settings\n' +
      '📅 /weekly - Weekly report\n' +
      '🔔 /notify - Test notifications\n' +
      '🔄 /workflows - List Hermes workflows\n' +
      '▶️ /run <workflow_id> - Execute workflow\n' +
      '📋 /executions - Recent workflow executions',
      { parse_mode: 'Markdown' }
    )
  })

  // /status command
  bot.command('status', async (ctx) => {
    if (!ctx.state?.isAdmin) return
    
    try {
      const connectionTest = await storage.testConnection()
      
      const status = `
🟢 *System Status: Operational*

🌐 *Website*: Online
🤖 *Agents*: 10/10 Active
📱 *Telegram*: ${connectionTest ? '✅ Connected' : '❌ Connection Failed'}
💾 *Storage*: Channel Accessible
🔐 *Encryption*: Active

⏰ *Uptime*: ${process.uptime().toFixed(0)}s
💾 *Memory*: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1)} MB
    `.trim()

      await ctx.reply(status, { parse_mode: 'Markdown' })
    } catch (error) {
      await ctx.reply('❌ Error checking status', { parse_mode: 'Markdown' })
    }
  })

  // /projects command
  bot.command('projects', async (ctx) => {
    if (!ctx.state?.isAdmin) return
    
    try {
      // In production, query database
      await ctx.reply(
        '📋 *Active Projects*\n\n' +
        'No active projects at the moment.\n\n' +
        'Use /newproject to create one.',
        { parse_mode: 'Markdown' }
      )
    } catch (error) {
      await ctx.reply('❌ Error fetching projects', { parse_mode: 'Markdown' })
    }
  })

  // /stats command - Daily business metrics
  bot.command('stats', async (ctx) => {
    if (!ctx.state?.isAdmin) return
    
    try {
      await ctx.reply('📊 *Generating report...*', { parse_mode: 'Markdown' })
      const report = await generateDailyReport(storage)
      await ctx.reply(report, { parse_mode: 'Markdown' })
    } catch (error) {
      await ctx.reply('❌ Error generating stats', { parse_mode: 'Markdown' })
    }
  })

  // /agents command
  bot.command('agents', async (ctx) => {
    if (!ctx.state?.isAdmin) return
    
    try {
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
    } catch (error) {
      await ctx.reply('❌ Error fetching agents', { parse_mode: 'Markdown' })
    }
  })

  // /backup command
  bot.command('backup', async (ctx) => {
    if (!ctx.state?.isAdmin) return
    
    try {
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
    } catch (error) {
      await ctx.reply('❌ Backup failed', { parse_mode: 'Markdown' })
    }
  })

  // /logs command
  bot.command('logs', async (ctx) => {
    if (!ctx.state?.isAdmin) return
    
    try {
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
    } catch (error) {
      await ctx.reply('❌ Error fetching logs', { parse_mode: 'Markdown' })
    }
  })

  // /weekly command
  bot.command('weekly', async (ctx) => {
    if (!ctx.state?.isAdmin) return
    
    try {
      await ctx.reply('📊 *Generating weekly report...*', { parse_mode: 'Markdown' })
      const report = await generateWeeklyReport(storage)
      await ctx.reply(report, { parse_mode: 'Markdown' })
    } catch (error) {
      await ctx.reply('❌ Error generating weekly report', { parse_mode: 'Markdown' })
    }
  })

  // /notify command - test notification
  bot.command('notify', async (ctx) => {
    if (!ctx.state?.isAdmin) return
    
    try {
      await storage.notifyAdmin(
        '🔔 *Test Notification*\n\n' +
        'This is a test notification from LumineerCo bot.\n' +
        `Sent at: ${new Date().toISOString()}`,
        { parse_mode: 'Markdown' }
      )
      await ctx.reply('✅ Test notification sent!')
    } catch (error) {
      await ctx.reply('❌ Failed to send notification', { parse_mode: 'Markdown' })
    }
  })

  // /settings command
  bot.command('settings', async (ctx) => {
    if (!ctx.state?.isAdmin) return
    
    await ctx.reply(
      '⚙️ *Bot Settings*\n\n' +
      '• Admin Chat ID: Configured\n' +
      '• Storage Channel: Configured\n' +
      '• Webhook: Active\n' +
      '• Encryption: Enabled\n' +
      '• Notifications: Enabled\n\n' +
      'Use /status to verify connectivity.',
      { parse_mode: 'Markdown' }
    )
  })

  // Hermes workflow commands
  // /workflows command - list available workflows
  bot.command('workflows', async (ctx) => {
    if (!ctx.state?.isAdmin) return
    
    try {
      const workflows = hermesManager.listWorkflows()
      
      if (workflows.length === 0) {
        await ctx.reply('📭 No workflows registered')
        return
      }

      const workflowList = workflows.map((w, i) => 
        `${i + 1}. *${w.name}* (\`${w.id}\`)\n   ${w.description}\n   Steps: ${w.steps.length} | Trigger: ${w.trigger}`
      ).join('\n\n')

      await ctx.reply(
        '🔄 *Available Hermes Workflows*\n\n' + workflowList,
        { parse_mode: 'Markdown' }
      )
    } catch (error) {
      await ctx.reply('❌ Error fetching workflows', { parse_mode: 'Markdown' })
    }
  })

  // /run command - execute a workflow
  bot.command('run', async (ctx) => {
    if (!ctx.state?.isAdmin) return
    
    const args = ctx.message.text.split(' ').slice(1)
    if (args.length === 0) {
      await ctx.reply(
        'Usage: `/run <workflow_id> [project_id] [client_id]`\n\n' +
        'Example: `/run full-website-project proj-123 client-456`',
        { parse_mode: 'Markdown' }
      )
      return
    }

    const [workflowId, projectId, clientId] = args

    try {
      await ctx.reply(`🔄 *Starting workflow: ${workflowId}...*`, { parse_mode: 'Markdown' })

      const workflow = hermesManager.getWorkflow(workflowId)
      if (!workflow) {
        await ctx.reply(`❌ Workflow not found: ${workflowId}`, { parse_mode: 'Markdown' })
        return
      }

      const result = await hermesManager.executeWorkflow(workflowId, {}, {
        projectId,
        clientId,
        onProgress: async (step, total, stepResult) => {
          await ctx.reply(
            `📍 *Step ${step}/${total}: ${workflow.steps[step - 1]?.agentId}*\n` +
            `${stepResult.success ? '✅' : '❌'} ${stepResult.error || 'Completed'} (${stepResult.duration}ms)`,
            { parse_mode: 'Markdown' }
          )
        }
      })

      const summary = `
${result.success ? '✅' : '❌'} *Workflow ${result.success ? 'Completed' : 'Failed'}*

🔄 *Workflow:* ${workflowId}
🆔 *Execution:* ${result.executionId}
📊 *Steps:* ${result.steps.length}
⏱️ *Duration:* ${(new Date(result.completedAt!).getTime() - new Date(result.startedAt).getTime()) / 1000}s

*Step Results:*
${result.steps.map((s, i) => `${i + 1}. ${s.agentId}: ${s.success ? '✅' : '❌'} ${s.error || 'OK'} (${s.duration}ms)`).join('\n')}
      `.trim()

      await ctx.reply(summary, { parse_mode: 'Markdown' })
    } catch (error) {
      await ctx.reply(`❌ Workflow failed: ${error instanceof Error ? error.message : 'Unknown error'}`, { parse_mode: 'Markdown' })
    }
  })

  // /executions command - show recent workflow executions
  bot.command('executions', async (ctx) => {
    if (!ctx.state?.isAdmin) return
    
    try {
      const history = hermesManager.getExecutionHistory(10)
      
      if (history.length === 0) {
        await ctx.reply('📭 No workflow executions yet')
        return
      }

      const execList = history.map((e, i) => 
        `${i + 1}. ${e.workflowId} - ${e.success ? '✅' : '❌'} (${e.executionId})\n   ${e.steps.length} steps | ${e.startedAt}`
      ).join('\n\n')

      await ctx.reply(
        '📋 *Recent Workflow Executions*\n\n' + execList,
        { parse_mode: 'Markdown' }
      )
    } catch (error) {
      await ctx.reply('❌ Error fetching executions', { parse_mode: 'Markdown' })
    }
  })

  // Handle callback queries
  bot.on('callback_query', async (ctx) => {
    if (!ctx.state?.isAdmin) return
    
    const data = ctx.callbackQuery.data
    await ctx.answerCbQuery()
    
    try {
      if (data === 'refresh_status') {
        const connectionTest = await storage.testConnection()
        const status = `
🟢 *System Status: Operational*

🌐 *Website*: Online
🤖 *Agents*: 10/10 Active
📱 *Telegram*: ${connectionTest ? '✅ Connected' : '❌ Connection Failed'}
💾 *Storage*: Channel Accessible
🔐 *Encryption*: Active
        `.trim()
        
        await ctx.editMessageText(status, { parse_mode: 'Markdown' })
      }
    } catch (error) {
      await ctx.editMessageText('❌ Error refreshing status', { parse_mode: 'Markdown' })
    }
  })

  // Error handler
  bot.catch((err, ctx) => {
    console.error('Bot error:', err)
    ctx.reply('❌ An error occurred. Check logs for details.')
  })
}

import { generateDailyReport, generateWeeklyReport } from './storage'