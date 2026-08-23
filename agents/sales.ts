import { BaseAgent, AgentTask, AgentResult } from './base'

export class SalesAgent extends BaseAgent {
  constructor() {
    super(
      'Sales Copy & Proposals',
      `You are an expert conversion copywriter and proposal strategist.

Your expertise includes:
- Direct response copywriting (AIDA, PAS, BAB, 4Ps)
- Sales email sequences (cold, warm, follow-up)
- Upwork/Fiverr/freelance proposals
- Landing page copy
- VSL (Video Sales Letter) scripts
- Pitch decks and investor presentations
- Case study storytelling
- Objection handling frameworks
- A/B test hypotheses

When given a project, you:
1. Research audience, offer, and competitors
2. Choose optimal framework for channel
3. Write multiple variants for testing
4. Create follow-up sequences
5. Design proposal structure
6. Provide swipe file and templates

Output format: Complete copy docs, variants, sequences, proposal templates, test plan.`,
      ['copywriting_frameworks', 'market_research', 'competitor_analysis']
    )
  }

  async execute(task: AgentTask): Promise<AgentResult> {
    const { input } = task
    const req = input as {
      type: 'cold-email' | 'proposal' | 'landing-page' | 'vsl' | 'pitch-deck' | 'case-study' | 'follow-up'
      offer: string
      targetAudience: string
      valueProps: string[]
      objections?: string[]
      tone?: string
      length?: string
      variants?: number
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
      'Research audience pains, desires, awareness level',
      'Analyze competitor messaging and positioning',
      'Select optimal copywriting framework',
      'Write primary variant (control)',
      'Write test variants (3-5)',
      'Create follow-up sequence (5-7 emails)',
      'Design proposal structure (if applicable)',
      'Add objection handling matrix',
      'Create A/B test plan',
    ]
  }

  protected async executeStep(step: string, input: unknown): Promise<unknown> {
    console.log(`[Sales] Executing: ${step}`)
    return { step, completed: true }
  }

  private generateDeliverable(req: any) {
    return {
      type: req.type,
      framework: this.selectFramework(req),
      primaryCopy: this.generatePrimaryCopy(req),
      variants: this.generateVariants(req),
      sequences: this.generateSequences(req),
      proposals: this.generateProposals(req),
      objectionHandling: this.generateObjectionHandling(req),
      testPlan: this.generateTestPlan(),
      swipeFile: this.getSwipeFile(),
    }
  }

  private selectFramework(req: any) {
    const frameworks: Record<string, string> = {
      'cold-email': 'PAS (Problem-Agitation-Solution)',
      proposal: '4Ps (Promise-Picture-Proof-Push)',
      'landing-page': 'AIDA (Attention-Interest-Desire-Action)',
      vsl: 'AIDA + Story',
      'pitch-deck': 'Problem-Solution-Market-Traction-Team-Ask',
      'case-study': 'Challenge-Action-Result',
      'follow-up': 'Value-Add + Soft CTA',
    }
    return frameworks[req.type] || 'AIDA'
  }

  private generatePrimaryCopy(req: any) {
    const templates: Record<string, string> = {
      'cold-email': this.getColdEmailTemplate(req),
      proposal: this.getProposalTemplate(req),
      'landing-page': this.getLandingPageTemplate(req),
      vsl: this.getVSLTemplate(req),
      'pitch-deck': this.getPitchDeckTemplate(req),
      'case-study': this.getCaseStudyTemplate(req),
      'follow-up': this.getFollowUpTemplate(req),
    }
    return templates[req.type] || 'Custom copy generated'
  }

  private getColdEmailTemplate(req: any) {
    return `Subject: {{first_name}}, {{pain_point}}?

Hi {{first_name}},

{{problem_statement}} — and it's costing you {{specific_cost}}.

Most {{target_audience}} try {{common_solution}} but {{why_it_fails}}.

We've helped {{social_proof}} achieve {{result}} by {{unique_mechanism}}.

Worth a 10-min chat to see if it fits?

Best,
{{sender_name}}

P.S. {{credibility_marker}}`
  }

  private getProposalTemplate(req: any) {
    return `# Proposal: {{project_name}}

## Executive Summary
{{client_name}} needs {{outcome}}. We deliver {{solution}} in {{timeframe}} for {{investment}}.

## Understanding Your Challenge
{{detailed_problem_analysis}}

## Our Approach
### Phase 1: {{phase_1_name}} (Week 1-2)
{{deliverables}}

### Phase 2: {{phase_2_name}} (Week 3-4)
{{deliverables}}

### Phase 3: {{phase_3_name}} (Week 5-6)
{{deliverables}}

## Why Us
- {{differentiator_1}}
- {{differentiator_2}}
- {{differentiator_3}}

## Investment
| Option | Scope | Price |
|--------|-------|-------|
| Essential | {{scope_1}} | {{price_1}} |
| Professional | {{scope_2}} | {{price_2}} |
| Enterprise | {{scope_3}} | {{price_3}} |

## Next Steps
1. {{step_1}}
2. {{step_2}}
3. {{step_3}}`
  }

  private getLandingPageTemplate(req: any) {
    return `# {{headline}}

## {{subheadline}}

### {{benefit_1}}
{{proof_1}}

### {{benefit_2}}
{{proof_2}}

### {{benefit_3}}
{{proof_3}}

## {{social_proof_section}}

## {{guarantee}}

## {{cta_button}}

## {{faq_section}}`
  }

  private getVSLTemplate(req: any) {
    return `HOOK (0-10s): {{pattern_interrupt}}

STORY (10-60s): {{relatable_struggle}}

REVELATION (60-180s): {{unique_mechanism}}

PROOF (180-300s): {{case_studies}}

OFFER (300-420s): {{stack_value}}

CTA (420-480s): {{urgency_scarcity}}`
  }

  private getPitchDeckTemplate(req: any) {
    return `Slide 1: Title + Tagline
Slide 2: Problem ({{market_size}})
Slide 3: Solution ({{unique_value}})
Slide 4: Product Demo
Slide 5: Business Model
Slide 6: Traction ({{metrics}})
Slide 7: Market Strategy
Slide 8: Competition
Slide 9: Team
Slide 10: Financials
Slide 11: The Ask ({{amount}} for {{equity}})`
  }

  private getCaseStudyTemplate(req: any) {
    return `# How {{client}} Achieved {{result}} in {{timeframe}}

## The Challenge
{{problem_details}}

## The Solution
{{approach_summary}}

## The Results
- {{metric_1}}
- {{metric_2}}
- {{metric_3}}

## Key Takeaways
{{lessons_learned}}`
  }

  private getFollowUpTemplate(req: any) {
    return `Sequence: 7 emails over 14 days

Email 1 (Day 0): Value + Soft CTA
Email 2 (Day 2): Case Study
Email 3 (Day 5): Objection Handling
Email 4 (Day 8): Social Proof
Email 5 (Day 11): FAQ
Email 6 (Day 13): Urgency
Email 7 (Day 14): Break-up / Final`
  }

  private generateVariants(req: any) {
    return Array.from({ length: req.variants || 3 }, (_, i) => ({
      variant: `Variant ${i + 1}`,
      angle: ['Direct', 'Story', 'Data-driven', 'Contrarian', 'Short'][i],
      copy: `Alternative copy for ${req.type}...`,
    }))
  }

  private generateSequences(req: any) {
    return {
      cold: ['Day 0', 'Day 2', 'Day 5', 'Day 8', 'Day 11', 'Day 13', 'Day 14'],
      warm: ['Day 0', 'Day 3', 'Day 7', 'Day 14'],
      proposal: ['Sent', 'Day 2 follow-up', 'Day 5 call', 'Day 10 close'],
    }
  }

  private generateProposals(req: any) {
    return {
      upwork: 'Upwork-optimized proposal template',
      fiverr: 'Fiverr gig description + packages',
      agency: 'Agency proposal with tiers',
      enterprise: 'Enterprise RFP response template',
    }
  }

  private generateObjectionHandling(req: any) {
    const objections = req.objections || ['Too expensive', 'Not the right time', 'Need to think about it', 'Already have a provider']
    return objections.map((obj: string) => ({
      objection: obj,
      response: `Reframe: ${obj} actually means...`,
      proof: 'Relevant case study or data',
    }))
  }

  private generateTestPlan() {
    return {
      hypothesis: 'Variant B (story-based) will outperform control by 20%',
      metrics: ['Open rate', 'Reply rate', 'Meeting booked', 'Conversion'],
      sampleSize: '100 per variant',
      duration: '14 days',
      significance: '95% confidence',
    }
  }

  private getSwipeFile() {
    return [
      'Subject lines that work',
      'Opening hooks library',
      'Closing templates',
      'Objection responses',
      'Follow-up frameworks',
    ]
  }
}