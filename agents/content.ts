import { BaseAgent } from '@/lib/agents/base'
import { agentRegistry } from '@/lib/agents/base'

export class ContentAgent extends BaseAgent {
  constructor() {
    super({
      name: 'Content Creation',
      description: 'Expert content writer and SEO specialist',
      systemPrompt: `You are an expert content writer, SEO strategist, and copywriter.

Your expertise includes:
- SEO-optimized blog posts and articles
- Long-form content (guides, whitepapers, case studies)
- Website copy (landing pages, service pages, about pages)
- Email marketing sequences and newsletters
- Social media content (LinkedIn, Twitter, Instagram)
- Video scripts and podcast outlines
- Content repurposing and distribution
- Keyword research and content clustering
- Content strategy and editorial calendars
- Conversion copywriting (AIDA, PAS frameworks)

When given a project, you:
1. Research topic, audience, and competitors
2. Develop content strategy and keyword plan
3. Create detailed outlines with SEO structure
4. Write engaging, optimized content
5. Edit for clarity, tone, and conversion
6. Provide meta tags, schemas, and distribution plan

Output format: Complete articles, content briefs, editorial calendar, SEO metadata, repurposing plan.`,
      tools: ['web_search', 'seo_analysis', 'keyword_research']
    })
  }

  async execute(input: { prompt: string; context?: Record<string, unknown>; projectId?: string }): Promise<{ success: boolean; result?: unknown; error?: string }> {
    const req = {
      type: 'blog' as 'blog' | 'website-copy' | 'email' | 'social' | 'script' | 'case-study',
      topic: '',
      targetAudience: '',
      keywords: [] as string[],
      tone: 'professional' as 'professional' | 'casual' | 'authoritative' | 'conversational',
      length: 'medium' as 'short' | 'medium' | 'long',
      cta: '',
      ...JSON.parse(input.prompt)
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

    return { success: true, result: this.formatOutput(deliverable) }
  }

  protected async plan(input: unknown): Promise<string[]> {
    return [
      'Research topic, audience, and keyword landscape',
      'Analyze top-ranking content and gaps',
      'Create SEO-optimized outline with headings',
      'Write compelling introduction with hook',
      'Develop body sections with evidence/examples',
      'Craft strong conclusion and CTA',
      'Optimize on-page SEO (meta, headers, schema)',
      'Create social media snippets for distribution',
      'Build content repurposing plan',
    ]
  }

  protected async executeStep(step: string, input: unknown): Promise<unknown> {
    console.log(`[Content] Executing: ${step}`)
    return { step, completed: true }
  }

  private generateDeliverable(req: any) {
    return {
      type: req.type,
      title: this.generateTitle(req),
      content: this.generateContent(req),
      seo: this.generateSEO(req),
      meta: this.generateMeta(req),
      socialSnippets: this.generateSocialSnippets(req),
      repurposing: this.generateRepurposing(req),
      editorialNotes: this.getEditorialNotes(),
    }
  }

  private generateTitle(req: any) {
    const templates: Record<string, string[]> = {
      blog: [
        `The Ultimate Guide to ${req.topic}`,
        `${req.topic}: Everything You Need to Know`,
        `How to ${req.topic} in ${new Date().getFullYear()}`,
        `${req.topic} vs Alternatives: Complete Comparison`,
      ],
      'website-copy': [
        `${req.topic} - Professional Services`,
        `Why Choose Us for ${req.topic}`,
      ],
      email: [
        `Your ${req.topic} Guide is Ready`,
        `Unlock ${req.topic} Success`,
      ],
      social: [
        `🚀 ${req.topic} Tips That Work`,
        `The Truth About ${req.topic}`,
      ],
    }
    return templates[req.type]?.[0] || req.topic
  }

  private generateContent(req: any) {
    const wordCounts = { short: '800-1200', medium: '1500-2500', long: '3000-5000' }
    return {
      outline: [
        'Introduction: Hook + Problem + Promise',
        'What is ' + req.topic + '?',
        'Why ' + req.topic + ' Matters',
        'How to ' + req.topic + ' (Step-by-Step)',
        'Common Mistakes to Avoid',
        'Pro Tips & Best Practices',
        'Tools & Resources',
        'Conclusion + CTA',
      ],
      wordCount: wordCounts[req.length] || wordCounts.medium,
      tone: req.tone,
      keywords: req.keywords,
      readability: 'Grade 8-10 (accessible)',
    }
  }

  private generateSEO(req: any) {
    return {
      primaryKeyword: req.keywords[0] || req.topic,
      secondaryKeywords: req.keywords.slice(1, 6),
      lsiKeywords: ['related term 1', 'related term 2', 'related term 3'],
      metaTitle: `${req.topic} | Complete Guide ${new Date().getFullYear()}`,
      metaDescription: `Learn everything about ${req.topic}. Expert tips, step-by-step guide, and actionable strategies. Read now!`,
      schema: 'Article',
      internalLinks: 3,
      externalLinks: 2,
    }
  }

  private generateMeta(req: any) {
    return {
      title: this.generateTitle(req),
      description: `Master ${req.topic} with our comprehensive guide. ${req.length === 'long' ? 'Deep-dive' : 'Quick'} strategies, examples, and templates.`,
      ogTitle: this.generateTitle(req),
      ogDescription: `Learn ${req.topic} from industry experts.`,
      ogImage: '/og-image.jpg',
      twitterCard: 'summary_large_image',
    }
  }

  private generateSocialSnippets(req: any) {
    return {
      linkedin: `📝 Just published: ${this.generateTitle(req)}\n\nKey takeaways:\n• Insight 1\n• Insight 2\n• Insight 3\n\n#${req.topic.replace(/\s+/g, '')} #ContentMarketing`,
      twitter: `🧵 Thread: ${req.topic}\n\n1/ ${this.generateTitle(req)}\n\nKey insight: [main point]\n\nRead more: [link]`,
      instagram: `📚 ${req.topic}\n\nSwipe for tips →\n\n#${req.topic.replace(/\s+/g, '')} #learning`,
    }
  }

  private generateRepurposing(req: any) {
    return {
      videoScript: '3-5 min YouTube/Reels script',
      podcastOutline: '20-min episode structure',
      emailSequence: '5-part nurture series',
      infographic: 'Key stats visualization',
      checklist: 'Actionable download',
    }
  }

  private getEditorialNotes() {
    return [
      'Fact-check all statistics and claims',
      'Add expert quotes or case studies',
      'Include original data/research if possible',
      'Optimize images with alt text',
      'Add table of contents for long-form',
      'Internal link to related content',
    ]
  }
}

// Register agent
agentRegistry.register('content', new ContentAgent())