import { NextRequest, NextResponse } from 'next/server'
import { getHermesManager, runWorkflowFromWebhook } from '@/lib/hermes'
import { getTelegramStorage } from '@/telegram/storage'
import { createErrorResponse, createSuccessResponse } from '@/lib/validation'

// This endpoint handles webhooks that trigger Hermes workflows
// Can be called by Telegram bot, external services, or scheduled jobs

export async function POST(request: NextRequest) {
  try {
    // Verify secret token if set
    const secretToken = request.headers.get('x-hermes-webhook-secret')
    if (process.env.HERMES_WEBHOOK_SECRET && secretToken !== process.env.HERMES_WEBHOOK_SECRET) {
      return NextResponse.json(
        createErrorResponse('Invalid webhook secret', 401),
        { status: 401 }
      )
    }

    const body = await request.json()
    const { workflowId, ...payload } = body

    if (!workflowId) {
      return NextResponse.json(
        createErrorResponse('workflowId is required', 400),
        { status: 400 }
      )
    }

    const manager = getHermesManager()
    const workflow = manager.getWorkflow(workflowId)

    if (!workflow) {
      return NextResponse.json(
        createErrorResponse(`Workflow not found: ${workflowId}`, 404),
        { status: 404 }
      )
    }

    // Check if workflow trigger matches
    if (workflow.trigger !== 'webhook' && workflow.trigger !== 'manual') {
      return NextResponse.json(
        createErrorResponse(`Workflow ${workflowId} cannot be triggered via webhook`, 400),
        { status: 400 }
      )
    }

    // Execute workflow
    const result = await runWorkflowFromWebhook(workflowId, payload)

    // Store in Telegram
    const storage = getTelegramStorage({
      botToken: process.env.TELEGRAM_BOT_TOKEN || '',
      adminChatId: process.env.TELEGRAM_ADMIN_CHAT_ID || '',
      storageChannelId: process.env.TELEGRAM_STORAGE_CHANNEL_ID || '',
    })

    await storage.store({
      type: 'deliverable',
      id: `webhook-${result.executionId}`,
      projectId: payload.projectId as string || 'webhook-triggered',
      data: {
        ...result,
        trigger: 'webhook',
        webhookPayload: payload,
      },
    })

    // Notify admin
    await storage.notifyAdmin(
      `${result.success ? '✅' : '❌'} *Hermes Webhook Workflow ${result.success ? 'Completed' : 'Failed'}*\n\n` +
      `🔄 *Workflow:* ${workflowId}\n` +
      `🆔 *Execution:* ${result.executionId}\n` +
      `📊 *Steps:* ${result.steps.length}\n` +
      `⏱️ *Duration:* ${(new Date(result.completedAt!).getTime() - new Date(result.startedAt).getTime()) / 1000}s`,
      { parse_mode: 'Markdown' }
    )

    return NextResponse.json(
      createSuccessResponse(result, 'Webhook workflow executed')
    )
  } catch (error) {
    console.error('Hermes webhook error:', error)
    return NextResponse.json(
      createErrorResponse('Failed to execute webhook workflow'),
      { status: 500 }
    )
  }
}

// Health check for webhook endpoint
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'hermes-webhook',
    timestamp: new Date().toISOString(),
  })
}