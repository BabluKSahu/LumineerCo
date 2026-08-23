import { BaseAgent } from '@/lib/agents/base'
import { agentRegistry } from '@/lib/agents/base'
import { WebsiteDevAgent } from './website-dev'
import { ContentAgent } from './content'
import { DesignAgent } from './design'
import { ScriptsAgent } from './scripts'
import { SEOAgent } from './seo'
import { EbooksAgent } from './ebooks'
import { SocialMediaAgent } from './social'
import { LegalAgent } from './legal'
import { SecurityAgent } from './security'
import { SalesAgent } from './sales'

// Agents are auto-registered in their respective files
// Just import them to trigger registration

export { agentRegistry, BaseAgent }
export type { AgentTask, AgentResult } from '@/lib/agents/base'