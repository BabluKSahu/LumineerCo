import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getTelegramStorage } from '@/telegram/storage'
import { encrypt } from '@/lib/encryption'

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  service: z.string().min(1, 'Service is required'),
  budget: z.string().optional(),
  timeline: z.string().optional(),
  message: z.string().min(20, 'Message must be at least 20 characters'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = contactSchema.parse(body)

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

    return NextResponse.json({ 
      success: true, 
      message: 'Project submitted successfully',
      clientId 
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: error.flatten().fieldErrors },
        { status: 400 }
      )
    }
    
    console.error('Contact form error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to submit. Please try again.' },
      { status: 500 }
    )
  }
}