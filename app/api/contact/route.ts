import { NextRequest, NextResponse } from 'next/server'
import { getTelegramStorage } from '@/telegram/storage'
import { contactFormSchema, validateSchema, createErrorResponse, createSuccessResponse, checkRateLimit } from '@/lib/validation'
import { getHermesManager, runWorkflowFromWebhook } from '@/lib/hermes'

export async function POST(request: NextRequest) {
  try {
    // Rate limiting by IP
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    const rateLimit = checkRateLimit(`contact-${ip}`, 5, 60 * 60 * 1000) // 5 requests per hour
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        createErrorResponse('Too many requests. Please try again later.', 429),
        { status: 429 }
      )
    }

    const body = await request.json()
    const validation = validateSchema(contactFormSchema, body)
    
    if (!validation.success) {
      return NextResponse.json(
        createErrorResponse('Validation failed', 400, validation.errors),
        { status: 400 }
      )
    }

    const validated = validation.data

    // Store in Telegram
    const storage = getTelegramStorage({
      botToken: process.env.TELEGRAM_BOT_TOKEN || '',
      adminChatId: process.env.TELEGRAM_ADMIN_CHAT_ID || '',
      storageChannelId: process.env.TELEGRAM_STORAGE_CHANNEL_ID || '',
    })

    const clientId = `client-${Date.now()}-${Math.random().toString(36).substring(7)}`
    
    await storage.store({
      type: 'client',
      id: clientId,
      data: {
        ...validated,
        status: 'new',
        source: 'website-contact-form',
      },
    })

    // Determine which workflow to trigger based on service
    const serviceToWorkflow: Record<string, string> = {
      'website-development': 'full-website-project',
      'content-creation': 'content-marketing-campaign',
      'design-services': 'digital-product-launch',
      'scripts-automation': 'client-onboarding',
      'seo-traffic': 'content-marketing-campaign',
      'ebooks-digital': 'digital-product-launch',
      'social-media': 'content-marketing-campaign',
      'legal-drafting': 'client-onboarding',
      'cybersecurity': 'client-onboarding',
      'sales-copy': 'digital-product-launch',
    }

    const workflowId = serviceToWorkflow[validated.service]
    
    // Notify admin
    await storage.notifyAdmin(
      `🔔 *New Project Inquiry*\n\n` +
      `👤 *Name:* ${validated.name}\n` +
      `📧 *Email:* ${validated.email}\n` +
      `🎯 *Service:* ${validated.service}\n` +
      `💰 *Budget:* ${validated.budget || 'Not specified'}\n` +
      `⏰ *Timeline:* ${validated.timeline || 'Not specified'}\n` +
      `📝 *Message:* ${validated.message.substring(0, 200)}...`,
      { parse_mode: 'Markdown' }
    )

    // Trigger Hermes workflow if mapped
    if (workflowId) {
      const projectId = `proj-${Date.now()}-${Math.random().toString(36).substring(7)}`
      
      // Run workflow asynchronously
      runWorkflowFromWebhook(workflowId, {
        ...validated,
        clientId,
        projectId,
        service: validated.service,
      }).then(async (result) => {
        await storage.store({
          type: 'deliverable',
          id: `hermes-${result.executionId}`,
          projectId,
          data: result,
        })

        await storage.notifyAdmin(
          `${result.success ? '✅' : '❌'} *Auto-triggered Workflow ${result.success ? 'Completed' : 'Failed'}*\n\n` +
          `🔄 *Workflow:* ${workflowId}\n` +
          `🆔 *Execution:* ${result.executionId}\n` +
          `📋 *Project:* ${projectId}\n` +
          `📊 *Steps:* ${result.steps.length}\n` +
          `⏱️ *Duration:* ${(new Date(result.completedAt!).getTime() - new Date(result.startedAt).getTime()) / 1000}s`,
          { parse_mode: 'Markdown' }
        )
      }).catch(async (error) => {
        await storage.notifyAdmin(
          `❌ *Auto-triggered Workflow Error*\n\n` +
          `🔄 *Workflow:* ${workflowId}\n` +
          `📋 *Project:* ${projectId}\n` +
          `⚠️ *Error:* ${error instanceof Error ? error.message : 'Unknown error'}`,
          { parse_mode: 'Markdown' }
        )
      })
    }

    return NextResponse.json(
      createSuccessResponse(
        { clientId, workflowTriggered: !!workflowId, workflowId },
        'Project submitted successfully'
      )
    )
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      createErrorResponse('Failed to submit. Please try again.'),
      { status: 500 }
    )
  }
}