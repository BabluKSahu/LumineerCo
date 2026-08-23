import { BaseAgent, AgentTask, AgentResult } from './base'

export class SocialMediaAgent extends BaseAgent {
  constructor() {
    super(
      'Social Media Marketing',
      `You are an expert social media strategist and growth marketer.

Your expertise includes:
- Platform strategy (Twitter/X, LinkedIn, Instagram, Threads, YouTube)
- Content pillars and editorial calendars
- Viral hook writing and copywriting
- Visual content direction
- Community building and engagement
- Influencer outreach and partnerships
- Paid social amplification
- Analytics and attribution
- Personal branding for founders

When given a project, you:
1. Audit current presence and competitors
2. Define strategy and content pillars
3. Create 30-day content calendar
4. Write hooks and copy for each post
5. Design visual direction/specs
6. Set up engagement systems
7. Launch and optimize

Output format: Strategy doc, content calendar, 30 posts written, visual specs, engagement playbook, analytics setup.`,
      ['web_search', 'trend_research', 'platform_apis']
    )
  }

  async execute(task: AgentTask): Promise<AgentResult> {
    const { input } = task
    const req = input as {
      platforms: ('twitter' | 'linkedin' | 'instagram' | 'threads' | 'youtube')[]
      goals: string[]
      targetAudience: string
      brandVoice: string
      postingFrequency: string
      contentTypes: string[]
    }

    const steps = await this.plan(req)
    for (const step of steps) {
      await this.executeStep(step, req)
    }

    const deliverable = this.generateDeliverable(req)
    const review = await this.review(deliverable)

    if (!review.approved) {
      return { success: false, error: review.feedback }
    }

    return this.formatOutput(deliverable)
  }

  protected async plan(input: unknown): Promise<string[]> {
    return [
      'Audit current profiles and competitors',
      'Define content pillars and themes',
      'Create 30-day content calendar',
      'Write hooks and copy for each post',
      'Design visual content specs',
      'Set up hashtag/keyword strategy',
      'Create engagement playbook',
      'Configure analytics and tracking',
      'Launch plan and optimization loop',
    ]
  }

  protected async executeStep(step: string, input: unknown): Promise<unknown> {
    console.log(`[Social] Executing: ${step}`)
    return { step, completed: true }
  }

  private generateDeliverable(req: any) {
    return {
      strategy: this.generateStrategy(req),
      calendar: this.generateCalendar(req),
      posts: this.generatePosts(req),
      visualSpecs: this.generateVisualSpecs(),
      engagement: this.generateEngagementPlaybook(),
      analytics: this.generateAnalyticsSetup(),
      tools: this.getRecommendedTools(),
    }
  }

  private generateStrategy(req: any) {
    return {
      pillars: [
        'Educational/Value',
        'Behind the Scenes',
        'Social Proof',
        'Personal/Founder Story',
        'Industry Commentary',
      ],
      voice: req.brandVoice,
      audience: req.targetAudience,
      differentiators: ['Authentic voice', 'Data-backed insights', 'Actionable takeaways'],
    }
  }

  private generateCalendar(req: any) {
    const days = 30
    return Array.from({ length: days }, (_, i) => ({
      day: i + 1,
      platform: req.platforms[i % req.platforms.length],
      pillar: ['Educational', 'Behind Scenes', 'Social Proof', 'Founder Story', 'Commentary'][i % 5],
      format: ['Text', 'Image', 'Carousel', 'Video', 'Thread'][i % 5],
      topic: `Topic ${i + 1}`,
    }))
  }

  private generatePosts(req: any) {
    return req.platforms.flatMap((platform: string) => 
      Array.from({ length: 6 }, (_, i) => ({
        platform,
        hook: this.getHook(platform, i),
        body: `Full post copy for ${platform}...`,
        cta: this.getCTA(platform),
        hashtags: this.getHashtags(platform),
        visualNote: 'Visual description for designer',
      }))
    )
  }

  private getHook(platform: string, index: number) {
    const hooks: Record<string, string[]> = {
      twitter: ['🧵 Thread:', '💡 Hot take:', '📊 Data shows:', '🚀 Just launched:', '🤔 Unpopular opinion:'],
      linkedin: ['💼 Lesson learned:', '📈 Results:', '🎯 Key insight:', '💡 Pro tip:', '🚀 Milestone:'],
      instagram: ['✨ New post:', '💡 Did you know?', '🎯 Pro tip:', '📸 Behind the scenes:', '🚀 Exciting news:'],
    }
    return hooks[platform]?.[index] || '📝 Post:'
  }

  private getCTA(platform: string) {
    const ctas: Record<string, string> = {
      twitter: 'Retweet if you agree!',
      linkedin: 'Comment your thoughts below',
      instagram: 'Save for later 📌',
      threads: 'Follow for more',
      youtube: 'Subscribe for weekly videos',
    }
    return ctas[platform] || 'Engage!'
  }

  private getHashtags(platform: string) {
    const tags: Record<string, string[]> = {
      twitter: ['#buildinpublic', '#startups', '#tech'],
      linkedin: ['#leadership', '#innovation', '#growth'],
      instagram: ['#entrepreneur', '#motivation', '#success'],
    }
    return tags[platform] || []
  }

  private generateVisualSpecs() {
    return {
      twitter: { dimensions: '1600x900', style: 'Clean, branded templates' },
      linkedin: { dimensions: '1200x627', style: 'Professional, data viz' },
      instagram: { dimensions: '1080x1080', style: 'Aesthetic, carousel-ready' },
      threads: { dimensions: '1600x900', style: 'Minimal, text-focused' },
      youtube: { dimensions: '1280x720', style: 'High-retention thumbnails' },
    }
  }

  private generateEngagementPlaybook() {
    return {
      replyStrategy: 'Reply to all comments within 1 hour',
      outreach: 'Engage with 20 target accounts daily',
      community: 'Host weekly AMA/thread',
      collaborations: 'Monthly cross-promotion',
    }
  }

  private generateAnalyticsSetup() {
    return {
      metrics: ['Follower growth', 'Engagement rate', 'Reach', 'Click-through', 'Conversions'],
      tools: ['Native analytics', 'Typefully/Hypefury', 'Shield (LinkedIn)'],
      reporting: 'Weekly dashboard, monthly deep-dive',
    }
  }

  private getRecommendedTools() {
    return ['Typefully/Hypefury (Twitter)', 'Shield/Taplio (LinkedIn)', 'Later/Buffer (Instagram)', 'Canva/Figma (Design)']
  }
}