import { BaseAgent, AgentTask, AgentResult } from './base'

export class ContentAgent extends BaseAgent {
  constructor() {
    super(
      'Content Creation',
      `You are an expert SEO content strategist and writer.

Your expertise includes:
- Keyword research and clustering
- Search intent analysis
- Content outlines and structures
- SEO-optimized writing (on-page SEO)
- Multiple formats: blogs, articles, guides, case studies, whitepapers
- Content repurposing for social media
- E-E-A-T optimization
- Internal linking strategy
- Content briefs for writers

When given a project, you:
1. Research keywords and competition
2. Create comprehensive content brief
3. Write engaging, optimized content
4. Optimize for featured snippets
5. Provide meta tags and schema
6. Suggest distribution strategy

Output format: Content brief, full article, meta tags, keyword list, distribution checklist.`,
      ['web_search', 'keyword_research', 'content_analysis']
    )
  }

  async execute(task: AgentTask): Promise<AgentResult> {
    const { input } = task
    const req = input as {
      topic: string
      format: 'blog' | 'article' | 'guide' | 'case-study' | 'whitepaper' | 'social-package'
      targetKeywords?: string[]
      wordCount?: number
      tone?: string
      audience?: string
      competitorUrls?: string[]
    }

    const steps = await this.plan(req)
    for (const step of steps) {
      await this.executeStep(step, req)
    }

    const deliverable = this.generateContentDeliverable(req)
    const review = await this.review(deliverable)

    if (!review.approved) {
      return { success: false, error: review.feedback }
    }

    return this.formatOutput(deliverable)
  }

  protected async plan(input: unknown): Promise<string[]> {
    const req = input as { format: string }
    return [
      'Research target keywords and search intent',
      'Analyze top-ranking competitors',
      'Create comprehensive content outline',
      'Write SEO-optimized draft',
      'Optimize for on-page SEO (headers, meta, schema)',
      'Add internal/external linking suggestions',
      'Create meta title, description, OG tags',
      'Format for readability (images, tables, bullets)',
      'Proofread and fact-check',
      'Prepare distribution checklist',
    ]
  }

  protected async executeStep(step: string, input: unknown): Promise<unknown> {
    console.log(`[Content] Executing: ${step}`)
    return { step, completed: true }
  }

  private generateContentDeliverable(req: any) {
    return {
      format: req.format,
      topic: req.topic,
      contentBrief: this.generateBrief(req),
      fullContent: this.generateContent(req),
      seo: this.generateSEO(req),
      distribution: this.generateDistribution(req),
      metadata: {
        wordCount: req.wordCount || this.getDefaultWordCount(req.format),
        readabilityScore: 'Grade 8-9',
        keywordDensity: '1-2%',
      },
    }
  }

  private generateBrief(req: any) {
    return {
      targetKeywords: req.targetKeywords || ['primary keyword', 'secondary keywords'],
      searchIntent: 'Informational/Commercial',
      audience: req.audience || 'General professionals',
      tone: req.tone || 'Professional yet accessible',
      structure: ['H1: Main Title', 'H2: Introduction', 'H2: Main Sections', 'H2: Conclusion', 'H2: FAQ'],
      competitorGaps: ['Gap 1', 'Gap 2', 'Gap 3'],
    }
  }

  private generateContent(req: any) {
    return `# ${req.topic}: Complete Guide

## Introduction
[Engaging hook + thesis statement + what reader will learn]

## Section 1: [Key Subtopic]
[In-depth coverage with examples, data, expert quotes]

## Section 2: [Key Subtopic]
[In-depth coverage with examples, data, expert quotes]

## Section 3: [Key Subtopic]
[In-depth coverage with examples, data, expert quotes]

## Conclusion
[Summary + call-to-action + next steps]

## FAQ
[5-7 frequently asked questions with concise answers]`
  }

  private generateSEO(req: any) {
    return {
      metaTitle: `${req.topic} | Complete Guide 2024`,
      metaDescription: `Learn everything about ${req.topic}. Expert guide with examples, tips, and actionable strategies.`,
      ogTitle: `${req.topic}: The Ultimate Guide`,
      ogDescription: `Master ${req.topic} with our comprehensive guide.`,
      schema: 'Article',
      keywords: req.targetKeywords || [],
      internalLinks: ['/related-article-1', '/related-article-2'],
      externalLinks: ['https://authoritative-source.com'],
    }
  }

  private generateDistribution(req: any) {
    return [
      'Publish on website/blog',
      'Share on LinkedIn (2-3 posts)',
      'Share on Twitter/X (thread)',
      'Include in newsletter',
      'Repurpose for Instagram carousel',
      'Submit to relevant communities',
      'Outreach for backlinks',
    ]
  }

  private getDefaultWordCount(format: string) {
    const counts: Record<string, number> = {
      blog: 1500,
      article: 2000,
      guide: 3000,
      'case-study': 1500,
      whitepaper: 4000,
      'social-package': 500,
    }
    return counts[format] || 1500
  }
}