import { Telegraf, Context, Markup } from 'telegraf'
import { encrypt, decrypt } from '@/lib/encryption'

export interface TelegramConfig {
  botToken: string
  adminChatId: string
  storageChannelId: string
}

export interface StoredData {
  type: 'client' | 'project' | 'deliverable' | 'conversation' | 'backup'
  id: string
  projectId?: string
  data: unknown
  timestamp: string
  encrypted: boolean
}

class TelegramStorage {
  private bot: Telegraf
  private config: TelegramConfig

  constructor(config: TelegramConfig) {
    this.config = config
    this.bot = new Telegraf(config.botToken)
  }

  async initialize() {
    await this.bot.launch()
    console.log('Telegram bot started')
  }

  async stop() {
    this.bot.stop()
  }

  // Store data in Telegram channel as encrypted message
  async store(data: Omit<StoredData, 'encrypted' | 'timestamp'>): Promise<boolean> {
    try {
      const storedData: StoredData = {
        ...data,
        encrypted: true,
        timestamp: new Date().toISOString(),
      }

      const encrypted = encrypt(storedData)
      
      await this.bot.telegram.sendMessage(
        this.config.storageChannelId,
        `\`\`\`json\n${encrypted}\n\`\`\``,
        { parse_mode: 'Markdown' }
      )
      return true
    } catch (error) {
      console.error('Telegram storage error:', error)
      return false
    }
  }

  // Retrieve latest data by type and project
  async retrieve(type: StoredData['type'], projectId?: string): Promise<StoredData[]> {
    // In production, you'd use getChatHistory or maintain an index
    // For now, this is a placeholder - you'd implement message search
    return []
  }

  // Send admin notification
  async notifyAdmin(message: string, options?: { parse_mode?: 'Markdown' | 'HTML' }) {
    try {
      await this.bot.telegram.sendMessage(this.config.adminChatId, message, options)
    } catch (error) {
      console.error('Admin notification error:', error)
    }
  }

  // Send file to admin
  async sendFileToAdmin(filePath: string, caption?: string) {
    try {
      await this.bot.telegram.sendDocument(this.config.adminChatId, { source: filePath }, { caption })
    } catch (error) {
      console.error('Send file error:', error)
    }
  }

  // Test connection to Telegram API
  async testConnection(): Promise<boolean> {
    try {
      const me = await this.bot.telegram.getMe()
      return !!me
    } catch (error) {
      console.error('Telegram connection test failed:', error)
      return false
    }
  }

  // Get bot info
  async getBotInfo() {
    try {
      return await this.bot.telegram.getMe()
    } catch (error) {
      console.error('Get bot info failed:', error)
      return null
    }
  }

  // Get chat info (for admin or storage channel)
  async getChatInfo(chatId: string) {
    try {
      return await this.bot.telegram.getChat(chatId)
    } catch (error) {
      console.error('Get chat info failed:', error)
      return null
    }
  }

  // List recent messages from storage channel
  async getRecentMessages(limit = 50): Promise<any[]> {
    // Note: Telegram Bot API doesn't directly support getting message history
    // In production, you'd maintain a local index or use MTProto
    return []
  }

  // Delete a message
  async deleteMessage(chatId: string, messageId: number) {
    try {
      await this.bot.telegram.deleteMessage(chatId, messageId)
      return true
    } catch (error) {
      console.error('Delete message failed:', error)
      return false
    }
  }

  // Update a message
  async updateMessage(chatId: string, messageId: number, text: string, options?: { parse_mode?: 'Markdown' | 'HTML' }) {
    try {
      await this.bot.telegram.editMessageText(chatId, messageId, undefined, text, options)
      return true
    } catch (error) {
      console.error('Update message failed:', error)
      return false
    }
  }

  getBot() {
    return this.bot
  }
}

// Singleton instance
let telegramStorage: TelegramStorage | null = null

export function getTelegramStorage(config?: TelegramConfig): TelegramStorage {
  if (!telegramStorage && config) {
    telegramStorage = new TelegramStorage(config)
  }
  if (!telegramStorage) {
    throw new Error('Telegram storage not initialized')
  }
  return telegramStorage
}

// Report generation
export async function generateDailyReport(storage: TelegramStorage): Promise<string> {
  const today = new Date().toISOString().split('T')[0]
  // In production, query your database for today's stats
  return `
📊 *Daily Report - ${today}*

🎯 *Projects*
• New: 0
• In Progress: 0
• Completed: 0

💰 *Revenue*
• Today: ₹0
• This Month: ₹0

🤖 *Agents*
• Website Dev: 0 tasks
• Content: 0 tasks
• Design: 0 tasks
• Scripts: 0 tasks
• SEO: 0 tasks
• E-Books: 0 tasks
• Social Media: 0 tasks
• Legal: 0 tasks
• Security: 0 tasks
• Sales: 0 tasks

⚡ *System Health*: ✅ Operational
  `.trim()
}

export async function generateWeeklyReport(storage: TelegramStorage): Promise<string> {
  return `
📈 *Weekly Analytics*

📊 *Conversion*
• Leads → Projects: 0%
• Avg. Project Value: ₹0

🏆 *Top Services*
1. Website Development - 0 projects
2. Content Creation - 0 projects
3. Design Services - 0 projects

👥 *Clients*
• New: 0
• Returning: 0
• Satisfaction: N/A

🤖 *Agent Performance*
• Avg. Completion Time: 0min
• Approval Rate: 0%
• Revision Rate: 0%
  `.trim()
}