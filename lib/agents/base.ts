import OpenAI from 'openai'
import { Anthropic } from '@anthropic-ai/sdk'

export interface AgentConfig {
  name: string
  description: string
  systemPrompt: string
  tools?: AgentTool[]
  model?: 'gpt-4' | 'gpt-4-turbo' | 'claude-3-opus' | 'claude-3-sonnet'
  temperature?: number
  maxTokens?: number
}

export interface AgentTool {
  name: string
  description: string
  execute: (args: unknown) => Promise<unknown>
}

export interface AgentInput {
  prompt: string
  context?: Record<string, unknown>
  projectId?: string
}

export interface AgentOutput {
  success: boolean
  result?: unknown
  error?: string
  tokensUsed?: number
  iterations?: number
}

export abstract class BaseAgent {
  protected config: AgentConfig
  protected openai: OpenAI
  protected anthropic: Anthropic
  protected projectId: string

  constructor(config: AgentConfig) {
    this.config = config
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    this.anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
    this.projectId = ''
  }

  setProjectId(projectId: string) {
    this.projectId = projectId
  }

  abstract execute(input: AgentInput): Promise<AgentOutput>

  protected async callLLM(messages: { role: string; content: string }[]): Promise<string> {
    const model = this.config.model || 'gpt-4-turbo'
    
    if (model.startsWith('gpt')) {
      const completion = await this.openai.chat.completions.create({
        model,
        messages: messages as any,
        temperature: this.config.temperature ?? 0.7,
        max_tokens: this.config.maxTokens ?? 4000,
      })
      return completion.choices[0]?.message?.content || ''
    } else {
      const completion = await this.anthropic.messages.create({
        model,
        messages: messages as any,
        temperature: this.config.temperature ?? 0.7,
        max_tokens: this.config.maxTokens ?? 4000,
      })
      return completion.content[0]?.type === 'text' ? completion.content[0].text : ''
    }
  }

  protected buildMessages(input: AgentInput): { role: string; content: string }[] {
    return [
      { role: 'system', content: this.config.systemPrompt },
      { role: 'user', content: this.buildUserPrompt(input) },
    ]
  }

  protected buildUserPrompt(input: AgentInput): string {
    let prompt = input.prompt
    
    if (input.context) {
      prompt += '\n\nContext:\n' + JSON.stringify(input.context, null, 2)
    }
    
    if (this.projectId) {
      prompt += `\n\nProject ID: ${this.projectId}`
    }
    
    return prompt
  }

  protected async executeWithTools(
    messages: { role: string; content: string }[],
    maxIterations = 3
  ): Promise<{ content: string; iterations: number }> {
    let currentMessages = [...messages]
    let iterations = 0
    
    while (iterations < maxIterations) {
      const response = await this.callLLM(currentMessages)
      currentMessages.push({ role: 'assistant', content: response })
      
      // Check if agent wants to use a tool (simplified - in production use function calling)
      const toolCall = this.parseToolCall(response)
      if (!toolCall) break
      
      const tool = this.config.tools?.find(t => t.name === toolCall.name)
      if (!tool) {
        currentMessages.push({ 
          role: 'user', 
          content: `Tool ${toolCall.name} not found. Available: ${this.config.tools?.map(t => t.name).join(', ')}` 
        })
        continue
      }
      
      try {
        const result = await tool.execute(toolCall.args)
        currentMessages.push({ 
          role: 'user', 
          content: `Tool result: ${JSON.stringify(result)}` 
        })
      } catch (error) {
        currentMessages.push({ 
          role: 'user', 
          content: `Tool error: ${error instanceof Error ? error.message : 'Unknown error'}` 
        })
      }
      
      iterations++
    }
    
    const finalResponse = await this.callLLM(currentMessages)
    return { content: finalResponse, iterations }
  }

  private parseToolCall(response: string): { name: string; args: unknown } | null {
    // Simple parsing - in production use proper function calling
    const match = response.match(/TOOL_CALL:\s*(\w+)\s*\((.*?)\)/s)
    if (match) {
      try {
        return { name: match[1], args: JSON.parse(match[2]) }
      } catch {
        return { name: match[1], args: {} }
      }
    }
    return null
  }
}

export class AgentRegistry {
  private agents: Map<string, BaseAgent> = new Map()
  
  register(id: string, agent: BaseAgent) {
    this.agents.set(id, agent)
  }
  
  get(id: string): BaseAgent | undefined {
    return this.agents.get(id)
  }
  
  getAll(): BaseAgent[] {
    return Array.from(this.agents.values())
  }
  
  getIds(): string[] {
    return Array.from(this.agents.keys())
  }
}

export const agentRegistry = new AgentRegistry()