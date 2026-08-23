import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { agentRegistry } from '@/agents'
import { getTelegramStorage } from '@/telegram/storage'

const executeSchema = z.object({
  service: z.string(),
  clientId: z.string(),
  projectId: z.string(),
  input: z.any(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = executeSchema.parse(body)

    const task = {
      id: `task-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      service: validated.service,
      clientId: validated.clientId,
      projectId: validated.projectId,
      input: validated.input,
      status: 'pending' as const,
      progress: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Store task in Telegram
    const storage = getTelegramStorage({
      botToken: process.env.TELEGRAM_BOT_TOKEN || '',
      adminChatId: process.env.TELEGRAM_ADMIN_CHAT_ID || '',
      storageChannelId: process.env.TELEGRAM_STORAGE_CHANNEL_ID || '',
    })

    await storage.store({
      type: 'project',
      id: task.id,
      projectId: validated.projectId,
      data: task,
    })

    // Notify admin
    await storage.notifyAdmin(
      `🤖 *Agent Task Started*\n\n` +
      `🎯 *Service:* ${validated.service}\n` +
      `📋 *Project:* ${validated.projectId}\n` +
      `👤 *Client:* ${validated.clientId}`,
      { parse_mode: 'Markdown' }
    )

    // Execute agent asynchronously (in production, use a queue)
    executeAgentAsync(task, storage)

    return NextResponse.json({
      success: true,
      taskId: task.id,
      message: 'Task started',
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    console.error('Agent execution error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to start task' },
      { status: 500 }
    )
  }
}

async function executeAgentAsync(task: any, storage: any) {
  try {
    // Update status to planning
    await storage.store({
      type: 'project',
      id: task.id,
      projectId: task.projectId,
      data: { ...task, status: 'planning', progress: 10 },
    })

    // Execute agent
    const result = await agentRegistry.executeTask(task)

    // Store result
    await storage.store({
      type: 'deliverable',
      id: `deliverable-${task.id}`,
      projectId: task.projectId,
      data: {
        taskId: task.id,
        result,
        completedAt: new Date().toISOString(),
      },
    })

    // Update task status
    await storage.store({
      type: 'project',
      id: task.id,
      projectId: task.projectId,
      data: { ...task, status: result.success ? 'completed' : 'failed', progress: 100, output: result },
    })

    // Notify admin of completion
    await storage.notifyAdmin(
      `${result.success ? '✅' : '❌'} *Agent Task ${result.success ? 'Completed' : 'Failed'}*\n\n` +
      `🎯 *Service:* ${task.service}\n` +
      `📋 *Project:* ${task.projectId}\n` +
      `${result.message || ''}`,
      { parse_mode: 'Markdown' }
    )
  } catch (error) {
    console.error('Agent execution failed:', error)
    await storage.notifyAdmin(
      `❌ *Agent Task Error*\n\n` +
      `🎯 *Service:* ${task.service}\n` +
      `📋 *Project:* ${task.projectId}\n` +
      `⚠️ *Error:* ${error instanceof Error ? error.message : 'Unknown error'}`,
      { parse_mode: 'Markdown' }
    )
  }
}