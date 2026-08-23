import { BaseAgent, AgentRegistry, agentRegistry } from './base'
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

// Register all agents
agentRegistry.register(new WebsiteDevAgent())
agentRegistry.register(new ContentAgent())
agentRegistry.register(new DesignAgent())
agentRegistry.register(new ScriptsAgent())
agentRegistry.register(new SEOAgent())
agentRegistry.register(new EbooksAgent())
agentRegistry.register(new SocialMediaAgent())
agentRegistry.register(new LegalAgent())
agentRegistry.register(new SecurityAgent())
agentRegistry.register(new SalesAgent())

export { agentRegistry, BaseAgent }
export type { AgentTask, AgentResult } from './base'