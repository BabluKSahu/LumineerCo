import { BaseAgent } from '@/lib/agents/base'
import { agentRegistry } from '@/lib/agents/base'

export class LegalAgent extends BaseAgent {
  constructor() {
    super({
      name: 'Legal Document Drafting',
      description: 'Expert legal document specialist',
      systemPrompt: `You are an expert legal document specialist (not a lawyer - always include disclaimer).

Your expertise includes:
- Contract drafting (NDAs, MSAs, freelancer agreements, employment)
- Terms of Service and Privacy Policies (GDPR, CCPA, DPDP compliant)
- Data Processing Agreements (DPAs)
- Cookie policies and consent management
- Compliance checklists (SOC2, ISO27001, HIPAA basics)
- Disclaimer and liability limitation
- Jurisdiction-aware drafting (India, US, EU, UK, Global)

When given a project, you:
1. Gather requirements and jurisdiction
2. Select appropriate template/framework
3. Customize clauses for specific use case
4. Add plain-language summaries
5. Include compliance checklists
6. Provide review checklist for legal counsel

Output format: Complete document, plain-language summary, compliance checklist, jurisdiction notes, review guide.

⚠️ DISCLAIMER: AI-generated documents are templates only. Always have a qualified attorney review before use.`,
      tools: ['legal_research', 'template_library', 'compliance_check']
    })
  }

  async execute(input: { prompt: string; context?: Record<string, unknown>; projectId?: string }): Promise<{ success: boolean; result?: unknown; error?: string }> {
    const req = {
      type: 'nda' as 'nda' | 'terms' | 'privacy' | 'freelancer' | 'employment' | 'dpa' | 'cookie' | 'custom',
      jurisdiction: 'india' as 'india' | 'us' | 'eu' | 'uk' | 'global',
      partyDetails: { client: {}, counterparty: {} },
      specificClauses: [] as string[],
      language: 'plain' as 'plain' | 'legalese' | 'both',
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
      'Gather requirements and determine jurisdiction',
      'Select base template for document type',
      'Customize party definitions and terms',
      'Draft core clauses (obligations, liability, termination)',
      'Add jurisdiction-specific provisions',
      'Include compliance requirements (GDPR, DPDP, etc.)',
      'Write plain-language summaries',
      'Create review checklist for attorney',
      'Format final document',
    ]
  }

  protected async executeStep(step: string, input: unknown): Promise<unknown> {
    console.log(`[Legal] Executing: ${step}`)
    return { step, completed: true }
  }

  private generateDeliverable(req: any) {
    return {
      type: req.type,
      jurisdiction: req.jurisdiction,
      document: this.generateDocument(req),
      plainLanguageSummary: this.generateSummary(req),
      complianceChecklist: this.generateCompliance(req),
      jurisdictionNotes: this.getJurisdictionNotes(req.jurisdiction),
      attorneyReviewGuide: this.getReviewGuide(),
      disclaimer: this.getDisclaimer(),
    }
  }

  private generateDocument(req: any) {
    const templates: Record<string, string> = {
      nda: this.getNDATemplate(req),
      terms: this.getTermsTemplate(req),
      privacy: this.getPrivacyTemplate(req),
      freelancer: this.getFreelancerTemplate(req),
      employment: this.getEmploymentTemplate(req),
      dpa: this.getDPATemplate(req),
      cookie: this.getCookieTemplate(req),
    }
    return templates[req.type] || 'Custom document generated based on requirements'
  }

  private getNDATemplate(req: any) {
    return `MUTUAL NON-DISCLOSURE AGREEMENT

This Agreement is entered into between ${req.partyDetails.client.name} ("Disclosing Party") 
and ${req.partyDetails.counterparty?.name || '[Counterparty]'} ("Receiving Party").

1. DEFINITION OF CONFIDENTIAL INFORMATION
2. OBLIGATIONS OF RECEIVING PARTY
3. EXCEPTIONS
4. TERM AND TERMINATION
5. RETURN/DESTRUCTION OF INFORMATION
6. REMEDIES
7. GOVERNING LAW: ${this.getGoverningLaw(req.jurisdiction)}
8. DISPUTE RESOLUTION
9. GENERAL PROVISIONS

[Full clauses with jurisdiction-specific modifications]`
  }

  private getTermsTemplate(req: any) {
    return `TERMS OF SERVICE

Last updated: ${new Date().toLocaleDateString()}

1. ACCEPTANCE OF TERMS
2. DESCRIPTION OF SERVICE
3. USER ACCOUNTS
4. USER CONDUCT
5. INTELLECTUAL PROPERTY
6. PAYMENT AND BILLING
7. TERMINATION
8. DISCLAIMERS AND LIMITATION OF LIABILITY
9. GOVERNING LAW: ${this.getGoverningLaw(req.jurisdiction)}
10. CHANGES TO TERMS
11. CONTACT INFORMATION

[Full clauses with consumer protection compliance]`
  }

  private getPrivacyTemplate(req: any) {
    return `PRIVACY POLICY

Last updated: ${new Date().toLocaleDateString()}

1. DATA CONTROLLER
2. DATA WE COLLECT
3. LEGAL BASIS FOR PROCESSING
4. PURPOSES OF PROCESSING
5. DATA SHARING AND DISCLOSURE
6. INTERNATIONAL TRANSFERS
7. DATA RETENTION
8. YOUR RIGHTS (${this.getRights(req.jurisdiction)})
9. SECURITY MEASURES
10. CHILDREN'S PRIVACY
11. CHANGES TO THIS POLICY
12. CONTACT US / DPO

[Full clauses compliant with ${req.jurisdiction.toUpperCase()} regulations]`
  }

  private getFreelancerTemplate(req: any) {
    return `FREELANCE SERVICES AGREEMENT

1. SERVICES AND DELIVERABLES
2. COMPENSATION AND PAYMENT TERMS
3. TIMELINE AND MILESTONES
4. INTELLECTUAL PROPERTY OWNERSHIP
5. CONFIDENTIALITY
6. INDEPENDENT CONTRACTOR STATUS
7. TERMINATION
8. INDEMNIFICATION
9. GOVERNING LAW: ${this.getGoverningLaw(req.jurisdiction)}
10. DISPUTE RESOLUTION`
  }

  private getEmploymentTemplate(req: any) {
    return `EMPLOYMENT AGREEMENT

1. POSITION AND DUTIES
2. COMPENSATION AND BENEFITS
3. WORKING HOURS AND LOCATION
4. PROBATION PERIOD
5. LEVE POLICIES
6. INTELLECTUAL PROPERTY
7. CONFIDENTIALITY AND NON-COMPETE
8. TERMINATION
9. GOVERNING LAW: ${this.getGoverningLaw(req.jurisdiction)}
10. DISPUTE RESOLUTION`
  }

  private getDPATemplate(req: any) {
    return `DATA PROCESSING AGREEMENT

1. DEFINITIONS (GDPR Art. 28)
2. SCOPE AND DURATION
3. PROCESSOR OBLIGATIONS
4. DATA SUBJECT RIGHTS ASSISTANCE
5. SECURITY MEASURES
6. SUB-PROCESSORS
7. DATA BREACH NOTIFICATION
8. DATA TRANSFERS
9. AUDIT RIGHTS
10. TERMINATION AND DATA RETURN`
  }

  private getCookieTemplate(req: any) {
    return `COOKIE POLICY

1. WHAT ARE COOKIES
2. TYPES OF COOKIES WE USE
   - Essential
   - Analytics
   - Marketing
   - Preferences
3. HOW TO MANAGE COOKIES
4. CONSENT MANAGEMENT
5. THIRD-PARTY COOKIES
6. CHANGES TO THIS POLICY`
  }

  private getGoverningLaw(jurisdiction: string) {
    const laws: Record<string, string> = {
      india: 'Laws of India, Courts of [City]',
      us: 'Laws of the State of Delaware, USA',
      eu: 'Laws of Ireland, EU',
      uk: 'Laws of England and Wales',
      global: 'Laws of Singapore, with arbitration in Singapore',
    }
    return laws[jurisdiction] || laws.global
  }

  private getRights(jurisdiction: string) {
    const rights: Record<string, string> = {
      india: 'Access, Correction, Erasure, Portability, Objection (DPDP Act)',
      us: 'Access, Deletion, Opt-out (CCPA/CPRA), State-specific rights',
      eu: 'Access, Rectification, Erasure, Restriction, Portability, Objection (GDPR)',
      uk: 'Access, Rectification, Erasure, Restriction, Portability, Objection (UK GDPR)',
      global: 'Comprehensive rights per applicable jurisdiction',
    }
    return rights[jurisdiction] || rights.global
  }

  private getJurisdictionNotes(jurisdiction: string) {
    const notes: Record<string, string[]> = {
      india: ['DPDP Act 2023 compliance', 'IT Act 2000 provisions', 'Consumer Protection Act 2019'],
      us: ['State law variations (CA, NY, etc.)', 'FTC guidelines', 'Industry-specific (HIPAA, GLBA)'],
      eu: ['GDPR full compliance', 'ePrivacy Directive', 'National implementations'],
      uk: ['UK GDPR', 'Data Protection Act 2018', 'PECR'],
    }
    return notes[jurisdiction] || []
  }

  private generateSummary(req: any) {
    return `This ${req.type.toUpperCase()} protects your interests by:
- Clearly defining obligations for both parties
- Limiting liability appropriately
- Ensuring ${req.jurisdiction.toUpperCase()} compliance
- Providing clear dispute resolution path`
  }

  private generateCompliance(req: any) {
    return {
      gdpr: req.jurisdiction === 'eu' || req.jurisdiction === 'global',
      dpdp: req.jurisdiction === 'india' || req.jurisdiction === 'global',
      ccpa: req.jurisdiction === 'us' || req.jurisdiction === 'global',
      consumerProtection: true,
      electronicSignatures: true,
    }
  }

  private getReviewGuide() {
    return [
      'Verify party names and details are correct',
      'Confirm jurisdiction matches business operations',
      'Review liability caps for reasonableness',
      'Check termination clauses are fair',
      'Ensure IP ownership aligns with intent',
      'Validate compliance requirements are current',
      'Have qualified attorney in jurisdiction review',
    ]
  }

  private getDisclaimer() {
    return `⚠️ IMPORTANT: This document is generated by AI for template purposes only. 
It does not constitute legal advice. Laws vary by jurisdiction and change frequently. 
You MUST have a qualified attorney licensed in the relevant jurisdiction review this 
document before use. LumineerCo accepts no liability for any consequences arising 
from use of this template without professional legal review.`
  }
}

// Register agent
agentRegistry.register('legal', new LegalAgent())