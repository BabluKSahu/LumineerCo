import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getHermesManager, HermesExecutionResult, runWorkflowFromWebhook } from '@/lib/hermes'
import { createErrorResponse, createSuccessResponse } from '@/lib/validation'
import { asyncHandler, AppError } from '@/lib/errors'
import { getTelegramStorage } from '@/telegram/storage'

const executeWorkflowSchema = z.object({
  workflowId: z.string().min(1, 'Workflow ID is required'),
  input: z.record(z.unknown()).default({}),
  projectId: z.string().optional(),
  clientId: z.string().optional(),
})

export const POST = asyncHandler(async (request: NextRequest) => {
  const body = await request.json()
  
  // Check if it's a webhook call (has workflowId directly) or a regular call
  const isWebhook = body.workflowId && !body.input
  
  if (isWebhook) {
    // Webhook trigger
    const result = await runWorkflowFromWebhook(body.workflowId, body)
    return NextResponse.json(
      createSuccessResponse(result, 'Workflow executed')
    )
  }

  const validation = executeWorkflowSchema.safeParse(body)
  if (!validation.success) {
    throw AppError.badRequest('Validation failed', validation.error.flatten().fieldErrors)
  }

  const { workflowId, input, projectId, clientId } = validation.data
  const manager = getHermesManager()

  // Execute workflow
  const result = await manager.executeWorkflow(workflowId, input, {
    projectId,
    clientId,
  })

  // Store execution result in Telegram
  const storage = getTelegramStorage({
    botToken: process.env.TELEGRAM_BOT_TOKEN || '',
    adminChatId: process.env.TELEGRAM_ADMIN_CHAT_ID || '',
    storageChannelId: process.env.TELEGRAM_STORAGE_CHANNEL_ID || '',
  })

  await storage.store({
    type: 'deliverable',
    id: `hermes-${result.executionId}`,
    projectId: projectId || 'hermes-workflow',
    data: result,
  })

  // Notify admin
  await storage.notifyAdmin(
    `${result.success ? '✅' : '❌'} *Hermes Workflow ${result.success ? 'Completed' : 'Failed'}*\n\n` +
    `🔄 *Workflow:* ${workflowId}\n` +
    `🆔 *Execution:* ${result.executionId}\n` +
    `📊 *Steps:* ${result.steps.length}\n` +
    `⏱️ *Duration:* ${(new Date(result.completedAt!).getTime() - new Date(result.startedAt).getTime()) / 1000}s`,
    { parse_mode: 'Markdown' }
  )

  return NextResponse.json(
    createSuccessResponse(result, 'Workflow executed')
  )
})

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')
  const manager = getHermesManager()

  try {
    switch (action) {
      case 'list':
        return NextResponse.json(
          createSuccessResponse(manager.listWorkflows(), 'Workflows retrieved')
        )
      
      case 'history':
        const limit = parseInt(searchParams.get('limit') || '20')
        return NextResponse.json(
          createSuccessResponse(manager.getExecutionHistory(limit), 'History retrieved')
        )
      
      case 'get':
        const executionId = searchParams.get('id')
        if (!executionId) {
          return NextResponse.json(
            createErrorResponse('Execution ID required', 400),
            { status: 400 }
          )
        }
        const execution = manager.getExecution(executionId)
        if (!execution) {
          return NextResponse.json(
            createErrorResponse('Execution not found', 404),
            { status: 404 }
          )
        }
        return NextResponse.json(
          createSuccessResponse(execution, 'Execution retrieved')
        )
      
      case 'workflow':
        const workflowId = searchParams.get('id')
        if (!workflowId) {
          return NextResponse.json(
            createErrorResponse('Workflow ID required', 400),
            { status: 400 }
          )
        }
        const workflow = manager.getWorkflow(workflowId)
        if (!workflow) {
          return NextResponse.json(
            createErrorResponse('Workflow not found', 404),
            { status: 404 }
          )
        }
        return NextResponse.json(
          createSuccessResponse(workflow, 'Workflow retrieved')
        )
      
      default:
        return NextResponse.json(
          createSuccessResponse({
            workflows: manager.listWorkflows(),
            history: manager.getExecutionHistory(10),
          }, 'Hermes API')
        )
    }
  } catch (error) {
    console.error('Hermes API error:', error)
    return NextResponse.json(
      createErrorResponse('Failed to process request'),
      { status: 500 }
    )
  }
}