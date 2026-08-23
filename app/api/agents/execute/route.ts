import { NextRequest, NextResponse } from 'next/server'
import { getTelegramStorage } from '@/telegram/storage'
import { agentTaskSchema, validateSchema, createErrorResponse, createSuccessResponse } from '@/lib/validation'
import { asyncHandler, AppError } from '@/lib/errors'
import { agentRegistry } from '@/agents'
import { AgentTask } from '@/agents/base'

export const POST = asyncHandler(async (request: NextRequest) => {
  const body = await request.json()
  const validation = validateSchema(agentTaskSchema, body)
  
  if (!validation.success) {
    throw AppError.badRequest('Validation failed', validation.errors)
  }

  const validated = validation.data

  const task: AgentTask = {
    id: `task-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    service: validated.service,
    clientId: validated.clientId,
    projectId: validated.projectId,
    input: validated.input,
    status: 'pending',
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

  // Execute agent asynchronously
  executeAgentAsync(task, storage)

  return NextResponse.json(
    createSuccessResponse(
      { taskId: task.id },
      'Task started'
    )
  )
})

async function executeAgentAsync(task: AgentTask, storage: ReturnType<typeof getTelegramStorage>) {
  try {
    // Update status to planning
    await storage.store({
      type: 'project',
      id: task.id,
      projectId: task.projectId,
      data: { ...task, status: 'planning', progress: 10 },
    })

    // Get and execute agent
    const agent = agentRegistry.get(task.service)
    if (!agent) {
      throw AppError.notFound(`Agent not found: ${task.service}`)
    }
    
    agent.setProjectId(task.projectId)
    const result = await agent.execute({
      prompt: JSON.stringify(task.input),
      context: { clientId: task.clientId, projectId: task.projectId },
      projectId: task.projectId,
    })

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
      `${result.error || 'Task completed successfully'}`,
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