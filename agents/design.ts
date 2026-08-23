import { BaseAgent } from '@/lib/agents/base'
import { agentRegistry } from '@/lib/agents/base'

export class DesignAgent extends BaseAgent {
  constructor() {
    super({
      name: 'Design Services',
      description: 'Professional designer and brand strategist',
      systemPrompt: `You are a professional designer, brand strategist, and UI/UX expert.

Your expertise includes:
- Brand identity design (logos, color palettes, typography)
- UI/UX design for web and mobile applications
- Resume and portfolio design
- Marketing materials (brochures, presentations, social media)
- Figma prototyping and design systems
- Design handoff and developer collaboration
- Accessibility and inclusive design
- Design thinking and user research

When given a project, you:
1. Understand brand, audience, and goals
2. Research competitors and design trends
3. Create moodboards and style direction
4. Design core brand elements
5. Build UI components and screens
6. Create design system documentation
7. Prepare handoff assets and specs

Output format: Brand guidelines, Figma files, UI screens, component library, design tokens, handoff package.`,
      tools: ['figma_api', 'design_tools', 'accessibility_check']
    })
  }

  async execute(input: { prompt: string; context?: Record<string, unknown>; projectId?: string }): Promise<{ success: boolean; result?: unknown; error?: string }> {
    const req = {
      type: 'brand' as 'brand' | 'ui' | 'resume' | 'marketing' | 'presentation',
      brandName: '',
      industry: '',
      style: 'modern' as 'modern' | 'minimal' | 'bold' | 'playful' | 'corporate',
      colors: [] as string[],
      deliverables: [] as string[],
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
      'Brand discovery and research',
      'Moodboard and style direction',
      'Logo concepts and refinement',
      'Color palette and typography system',
      'Core UI components design',
      'Key screen/page designs',
      'Design system documentation',
      'Asset export and handoff prep',
    ]
  }

  protected async executeStep(step: string, input: unknown): Promise<unknown> {
    console.log(`[Design] Executing: ${step}`)
    return { step, completed: true }
  }

  private generateDeliverable(req: any) {
    return {
      type: req.type,
      brandGuidelines: this.generateBrandGuidelines(req),
      uiComponents: this.generateUIComponents(req),
      screens: this.generateScreens(req),
      designSystem: this.generateDesignSystem(req),
      handoff: this.generateHandoff(req),
    }
  }

  private generateBrandGuidelines(req: any) {
    return {
      logo: {
        primary: 'Logo mark + wordmark',
        variations: ['Horizontal', 'Vertical', 'Icon only', 'Monochrome'],
        clearSpace: '2x icon height',
        usage: 'Do not stretch, recolor, or add effects',
      },
      colors: {
        primary: req.colors[0] || '#1E40AF',
        secondary: req.colors[1] || '#F59E0B',
        accent: req.colors[2] || '#10B981',
        neutral: ['#FFFFFF', '#F3F4F6', '#9CA3AF', '#374151', '#111827'],
        semantic: { success: '#10B981', warning: '#F59E0B', error: '#EF4444' },
      },
      typography: {
        heading: 'Inter, system-ui',
        body: 'Inter, system-ui',
        mono: 'JetBrains Mono, monospace',
        scale: { xs: '12px', sm: '14px', base: '16px', lg: '18px', xl: '24px', '2xl': '32px', '3xl': '48px' },
      },
      spacing: { base: '4px', scale: [0, 4, 8, 12, 16, 24, 32, 48, 64] },
      borderRadius: { sm: '4px', md: '8px', lg: '12px', full: '9999px' },
      shadows: { sm: '0 1px 2px', md: '0 4px 6px', lg: '0 10px 15px' },
    }
  }

  private generateUIComponents(req: any) {
    return [
      'Buttons (Primary, Secondary, Ghost, Destructive)',
      'Inputs (Text, Select, Textarea, Checkbox, Radio)',
      'Cards (Default, Elevated, Outlined)',
      'Navigation (Header, Footer, Sidebar, Breadcrumbs)',
      'Feedback (Alert, Toast, Modal, Tooltip, Progress)',
      'Data Display (Table, Badge, Avatar, Divider)',
      'Forms (Field, Label, Error, Helper Text)',
    ]
  }

  private generateScreens(req: any) {
    const screens: Record<string, string[]> = {
      brand: ['Brand guidelines page', 'Logo usage examples', 'Color palette showcase'],
      ui: ['Dashboard', 'Settings', 'User Profile', 'Onboarding Flow'],
      resume: ['Resume (1-page)', 'Resume (2-page)', 'Cover Letter', 'Portfolio Page'],
      marketing: ['Landing Page', 'Email Template', 'Social Media Kit', 'Ad Banners'],
      presentation: ['Title Slide', 'Content Slides', 'Data Visualization', 'Closing Slide'],
    }
    return screens[req.type] || screens.ui
  }

  private generateDesignSystem(req: any) {
    return {
      figma: 'Figma file with all components, styles, and documentation',
      tokens: 'Design tokens JSON (Style Dictionary format)',
      storybook: 'Storybook integration for React components',
      documentation: 'Zeroheight/Notion documentation site',
    }
  }

  private generateHandoff(req: any) {
    return {
      assets: ['SVG icons', 'PNG exports (1x, 2x, 3x)', 'Font files'],
      specs: 'Redlines with measurements, colors, spacing',
      animations: 'Lottie/After Effects prototypes',
      checklist: [
        'All components documented',
        'Responsive breakpoints defined',
        'Accessibility audit passed',
        'Dark mode variants included',
        'Loading states designed',
        'Error states designed',
      ],
    }
  }
}

// Register agent
agentRegistry.register('design', new DesignAgent())