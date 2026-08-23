import { getHermesManager } from '@/lib/hermes'
import { getTelegramStorage } from '@/telegram/storage'

// Scheduled workflows configuration
interface ScheduledWorkflow {
  workflowId: string
  cronExpression: string // Using standard cron format
  input: Record<string, unknown>
  projectId?: string
  clientId?: string
  enabled: boolean
}

const SCHEDULED_WORKFLOWS: ScheduledWorkflow[] = [
  // Daily content generation at 9 AM
  {
    workflowId: 'content-marketing-campaign',
    cronExpression: '0 9 * * *',
    input: { topic: 'AI automation trends', targetAudience: 'developers' },
    projectId: 'daily-content',
    clientId: 'internal',
    enabled: true,
  },
  // Weekly report every Monday at 8 AM
  {
    workflowId: 'full-website-project',
    cronExpression: '0 8 * * 1',
    input: { projectType: 'weekly-maintenance' },
    projectId: 'weekly-maintenance',
    clientId: 'internal',
    enabled: false, // Disabled by default
  },
]

// Simple cron parser for common expressions
function parseCronExpression(expression: string): { minute: number; hour: number; dayOfMonth: number; month: number; dayOfWeek: number } | null {
  const parts = expression.split(' ')
  if (parts.length !== 5) return null
  
  const [minute, hour, dayOfMonth, month, dayOfWeek] = parts
  
  return {
    minute: parseCronPart(minute, 0, 59),
    hour: parseCronPart(hour, 0, 23),
    dayOfMonth: parseCronPart(dayOfMonth, 1, 31),
    month: parseCronPart(month, 1, 12),
    dayOfWeek: parseCronPart(dayOfWeek, 0, 6),
  }
}

function parseCronPart(part: string, min: number, max: number): number {
  if (part === '*') return -1 // -1 means any
  const num = parseInt(part, 10)
  if (isNaN(num) || num < min || num > max) return -1
  return num
}

function shouldRunNow(cron: { minute: number; hour: number; dayOfMonth: number; month: number; dayOfWeek: number }): boolean {
  const now = new Date()
  const currentMinute = now.getMinutes()
  const currentHour = now.getHours()
  const currentDayOfMonth = now.getDate()
  const currentMonth = now.getMonth() + 1 // 1-12
  const currentDayOfWeek = now.getDay() // 0-6 (Sunday=0)
  
  if (cron.minute !== -1 && cron.minute !== currentMinute) return false
  if (cron.hour !== -1 && cron.hour !== currentHour) return false
  if (cron.dayOfMonth !== -1 && cron.dayOfMonth !== currentDayOfMonth) return false
  if (cron.month !== -1 && cron.month !== currentMonth) return false
  if (cron.dayOfWeek !== -1 && cron.dayOfWeek !== currentDayOfWeek) return false
  
  return true
}

// Run scheduled workflows
export async function runScheduledWorkflows() {
  const hermesManager = getHermesManager()
  const storage = getTelegramStorage({
    botToken: process.env.TELEGRAM_BOT_TOKEN || '',
    adminChatId: process.env.TELEGRAM_ADMIN_CHAT_ID || '',
    storageChannelId: process.env.TELEGRAM_STORAGE_CHANNEL_ID || '',
  })

  for (const scheduled of SCHEDULED_WORKFLOWS) {
    if (!scheduled.enabled) continue
    
    const cron = parseCronExpression(scheduled.cronExpression)
    if (!cron) {
      console.error(`Invalid cron expression for ${scheduled.workflowId}: ${scheduled.cronExpression}`)
      continue
    }
    
    if (shouldRunNow(cron)) {
      console.log(`Running scheduled workflow: ${scheduled.workflowId}`)
      
      try {
        const result = await hermesManager.executeWorkflow(
          scheduled.workflowId,
          scheduled.input,
          {
            projectId: scheduled.projectId,
            clientId: scheduled.clientId,
          }
        )
        
        // Store result
        await storage.store({
          type: 'deliverable',
          id: `scheduled-${scheduled.workflowId}-${Date.now()}`,
          projectId: scheduled.projectId || 'scheduled',
          data: {
            ...result,
            trigger: 'scheduled',
            cronExpression: scheduled.cronExpression,
          },
        })
        
        // Notify admin
        await storage.notifyAdmin(
          `${result.success ? '✅' : '❌'} *Scheduled Workflow ${result.success ? 'Completed' : 'Failed'}*\n\n` +
          `🔄 *Workflow:* ${scheduled.workflowId}\n` +
          `🆔 *Execution:* ${result.executionId}\n` +
          `📊 *Steps:* ${result.steps.length}\n` +
          `⏱️ *Duration:* ${(new Date(result.completedAt!).getTime() - new Date(result.startedAt).getTime()) / 1000}s`,
          { parse_mode: 'Markdown' }
        )
      } catch (error) {
        console.error(`Scheduled workflow ${scheduled.workflowId} failed:`, error)
        await storage.notifyAdmin(
          `❌ *Scheduled Workflow Failed*\n\n` +
          `🔄 *Workflow:* ${scheduled.workflowId}\n` +
          `⚠️ *Error:* ${error instanceof Error ? error.message : 'Unknown error'}`,
          { parse_mode: 'Markdown' }
        )
      }
    }
  }
}

// Run every minute to check for scheduled workflows
export function startScheduler() {
  console.log('🕐 Starting Hermes scheduler...')
  
  // Run immediately on start
  runScheduledWorkflows()
  
  // Then run every minute
  setInterval(runScheduledWorkflows, 60 * 1000)
  
  console.log('✅ Scheduler started')
}

// Export for manual triggering
export { SCHEDULED_WORKFLOWS, ScheduledWorkflow }