export interface AgentTask {
  id: string
  service: string
  clientId: string
  projectId: string
  input: unknown
  status: 'pending' | 'planning' | 'executing' | 'reviewing' | 'completed' | 'failed'
  progress: number
  output?: unknown
  error?: string
  createdAt: string
  updatedAt: string
}

export interface AgentResult {
  success: boolean
  deliverable?: unknown
  message?: string
  files?: Array<{ name: string; content: string; type: string }>
  nextSteps?: string[]
}

export abstract class BaseAgent {
  protected serviceName: string
  protected systemPrompt: string
  protected tools: string[]

  constructor(serviceName: string, systemPrompt: string, tools: string[] = []) {
    this.serviceName = serviceName
    this.systemPrompt = systemPrompt
    this.tools = tools
  }

  abstract execute(task: AgentTask): Promise<AgentResult>

  protected async plan(input: unknown): Promise<string[]> {
    // Override in subclasses for custom planning
    return ['Analyze requirements', 'Execute task', 'Review output', 'Deliver']
  }

  protected async executeStep(step: string, input: unknown): Promise<unknown> {
    // Override in subclasses for custom execution
    return { step, completed: true }
  }

  protected async review(output: unknown): Promise<{ approved: boolean; feedback?: string }> {
    // Override in subclasses for custom review
    return { approved: true }
  }

  protected formatOutput(result: unknown): AgentResult {
    return {
      success: true,
      deliverable: result,
      message: `${this.serviceName} task completed successfully`,
    }
  }

  getServiceName(): string {
    return this.serviceName
  }

  getTools(): string[] {
    return this.tools
  }
}

export class AgentRegistry {
  private agents: Map<string, BaseAgent> = new Map()

  register(agent: BaseAgent) {
    this.agents.set(agent.getServiceName(), agent)
  }

  get(serviceName: string): BaseAgent | undefined {
    return this.agents.get(serviceName)
  }

  getAll(): BaseAgent[] {
    return Array.from(this.agents.values())
  }

  async executeTask(task: AgentTask): Promise<AgentResult> {
    const agent = this.get(task.service)
    if (!agent) {
      return {
        success: false,
        error: `No agent found for service: ${task.service}`,
      }
    }
    return agent.execute(task)
  }
}

export const agentRegistry = new AgentRegistry()