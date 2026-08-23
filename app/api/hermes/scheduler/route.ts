import { NextRequest, NextResponse } from 'next/server'
import { runScheduledWorkflows, startScheduler } from '@/scripts/scheduler'
import { createErrorResponse, createSuccessResponse } from '@/lib/validation'

// This endpoint can be called by external cron services (like cron-job.org)
// or by Vercel cron jobs to trigger scheduled workflows
export async function POST(request: NextRequest) {
  try {
    // Verify secret token if set
    const secretToken = request.headers.get('x-scheduler-secret')
    if (process.env.SCHEDULER_WEBHOOK_SECRET && secretToken !== process.env.SCHEDULER_WEBHOOK_SECRET) {
      return NextResponse.json(
        createErrorResponse('Invalid scheduler secret', 401),
        { status: 401 }
      )
    }

    await runScheduledWorkflows()
    
    return NextResponse.json(
      createSuccessResponse({ triggered: true }, 'Scheduled workflows checked')
    )
  } catch (error) {
    console.error('Scheduler webhook error:', error)
    return NextResponse.json(
      createErrorResponse('Failed to run scheduled workflows'),
      { status: 500 }
    )
  }
}

// Manual trigger endpoint for testing
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')

  if (action === 'start') {
    // Start the scheduler in background (for development)
    startScheduler()
    return NextResponse.json(
      createSuccessResponse({ started: true }, 'Scheduler started in background')
    )
  }

  return NextResponse.json({
    status: 'ok',
    service: 'hermes-scheduler',
    timestamp: new Date().toISOString(),
    scheduledWorkflows: [
      { workflowId: 'content-marketing-campaign', cron: '0 9 * * *', enabled: true },
      { workflowId: 'full-website-project', cron: '0 8 * * 1', enabled: false },
    ],
  })
}