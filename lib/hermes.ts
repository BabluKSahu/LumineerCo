import { BaseAgent } from '@/lib/agents/base'
import { agentRegistry } from '@/lib/agents/base'
import { AgentTask, AgentResult } from '@/lib/agents/base'

// Hermes Agent types for continuous workflow
export interface HermesAgentConfig {
  id: string
  name: string
  description: string
  capabilities: string[]
  requiresAuth?: boolean
}

export interface WorkflowStep {
  agentId: string
  input: Record<string, unknown>
  outputKey: string
  condition?: (context: WorkflowContext) => boolean
}

export interface WorkflowContext {
  [key: string]: unknown
  _originalInput: Record<string, unknown>
  _stepResults: Record<string, unknown>
}

export interface WorkflowDefinition {
  id: string
  name: string
  description: string
  steps: WorkflowStep[]
  trigger: 'manual' | 'webhook' | 'schedule' | 'agent-complete'
}

export interface HermesExecutionResult {
  success: boolean
  workflowId: string
  executionId: string
  steps: Array<{
    agentId: string
    success: boolean
    output?: unknown
    error?: string
    duration: number
  }>
  finalOutput: Record<string, unknown>
  startedAt: string
  completedAt?: string
}

// Built-in Hermes workflows
export const HERMES_WORKFLOWS: WorkflowDefinition[] = [
  {
    id: 'full-website-project',
    name: 'Full Website Development Project',
    description: 'Complete website project from requirements to deployment',
    trigger: 'manual',
    steps: [
      { agentId: 'website-dev', input: {}, outputKey: 'planning' },
      { agentId: 'design', input: {}, outputKey: 'design' },
      { agentId: 'content', input: {}, outputKey: 'content' },
      { agentId: 'website-dev', input: {}, outputKey: 'development' },
      { agentId: 'seo', input: {}, outputKey: 'seo' },
      { agentId: 'security', input: {}, outputKey: 'security-audit' },
    ],
  },
  {
    id: 'content-marketing-campaign',
    name: 'Content Marketing Campaign',
    description: 'End-to-end content marketing with SEO and social media',
    trigger: 'manual',
    steps: [
      { agentId: 'seo', input: {}, outputKey: 'keyword-research' },
      { agentId: 'content', input: {}, outputKey: 'content-creation' },
      { agentId: 'social', input: {}, outputKey: 'social-media' },
      { agentId: 'seo', input: {}, outputKey: 'optimization' },
    ],
  },
  {
    id: 'digital-product-launch',
    name: 'Digital Product Launch',
    description: 'Create and launch digital products (ebooks, courses)',
    trigger: 'manual',
    steps: [
      { agentId: 'ebooks', input: {}, outputKey: 'product-creation' },
      { agentId: 'design', input: {}, outputKey: 'product-design' },
      { agentId: 'content', input: {}, outputKey: 'marketing-copy' },
      { agentId: 'sales', input: {}, outputKey: 'sales-materials' },
      { agentId: 'social', input: {}, outputKey: 'launch-campaign' },
    ],
  },
  {
    id: 'client-onboarding',
    name: 'Client Onboarding Automation',
    description: 'Automated onboarding for new clients',
    trigger: 'webhook',
    steps: [
      { agentId: 'legal', input: {}, outputKey: 'contracts' },
      { agentId: 'scripts', input: {}, outputKey: 'automation-setup' },
      { agentId: 'security', input: {}, outputKey: 'security-setup' },
    ],
  },
]

// Hermes Agent Manager
export class HermesAgentManager {
  private workflows: Map<string, WorkflowDefinition> = new Map()
  private executionHistory: HermesExecutionResult[] = []

  constructor() {
    // Register built-in workflows
    HERMES_WORKFLOWS.forEach(w => this.workflows.set(w.id, w))
  }

  // Register a custom workflow
  registerWorkflow(workflow: WorkflowDefinition) {
    this.workflows.set(workflow.id, workflow)
  }

  // Get workflow by ID
  getWorkflow(id: string): WorkflowDefinition | undefined {
    return this.workflows.get(id)
  }

  // List all workflows
  listWorkflows(): WorkflowDefinition[] {
    return Array.from(this.workflows.values())
  }

  // Execute a workflow
  async executeWorkflow(
    workflowId: string,
    input: Record<string, unknown>,
    options: {
      projectId?: string
      clientId?: string
      onProgress?: (step: number, total: number, result: any) => void
    } = {}
  ): Promise<HermesExecutionResult> {
    const workflow = this.workflows.get(workflowId)
    if (!workflow) {
      throw new Error(`Workflow not found: ${workflowId}`)
    }

    const executionId = `exec-${Date.now()}-${Math.random().toString(36).substring(7)}`
    const startedAt = new Date().toISOString()
    
    const context: WorkflowContext = {
      _originalInput: input,
      _stepResults: {},
      ...input,
    }

    const stepResults: HermesExecutionResult['steps'] = []

    for (let i = 0; i < workflow.steps.length; i++) {
      const step = workflow.steps[i]
      
      // Check condition
      if (step.condition && !step.condition(context)) {
        stepResults.push({
          agentId: step.agentId,
          success: true,
          output: { skipped: true, reason: 'Condition not met' },
          duration: 0,
        })
        continue
      }

      // Prepare step input with context
      const stepInput = {
        ...step.input,
        ...context,
        _hermesContext: {
          workflowId,
          executionId,
          stepIndex: i,
          totalSteps: workflow.steps.length,
        },
      }

      const stepStart = Date.now()
      
      try {
        const agent = agentRegistry.get(step.agentId)
        if (!agent) {
          throw new Error(`Agent not found: ${step.agentId}`)
        }

        if (options.projectId) {
          agent.setProjectId(options.projectId)
        }

        const result = await agent.execute({
          prompt: JSON.stringify(stepInput),
          context: {
            clientId: options.clientId,
            projectId: options.projectId,
            workflowContext: context,
          },
          projectId: options.projectId,
        })

        const duration = Date.now() - stepStart
        
        stepResults.push({
          agentId: step.agentId,
          success: result.success,
          output: result.result,
          error: result.error,
          duration,
        })

        // Store result in context for next steps
        context._stepResults[step.outputKey] = result.result
        context[step.outputKey] = result.result

        // Notify progress
        if (options.onProgress) {
          options.onProgress(i + 1, workflow.steps.length, result)
        }

        // If step failed and no error handling, stop workflow
        if (!result.success) {
          break
        }
      } catch (error) {
        const duration = Date.now() - stepStart
        stepResults.push({
          agentId: step.agentId,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          duration,
        })
        break
      }
    }

    const completedAt = new Date().toISOString()
    
    // Compile final output
    const finalOutput = { ...context._stepResults }

    const executionResult: HermesExecutionResult = {
      success: stepResults.every(s => s.success),
      workflowId,
      executionId,
      steps: stepResults,
      finalOutput,
      startedAt,
      completedAt,
    }

    // Store in history
    this.executionHistory.unshift(executionResult)
    if (this.executionHistory.length > 100) {
      this.executionHistory.pop()
    }

    return executionResult
  }

  // Get execution history
  getExecutionHistory(limit = 20): HermesExecutionResult[] {
    return this.executionHistory.slice(0, limit)
  }

  // Get execution by ID
  getExecution(executionId: string): HermesExecutionResult | undefined {
    return this.executionHistory.find(e => e.executionId === executionId)
  }

  // Create a custom workflow from agent sequence
  createWorkflowFromAgents(
    id: string,
    name: string,
    agentIds: string[],
    baseInput: Record<string, unknown> = {}
  ): WorkflowDefinition {
    const workflow: WorkflowDefinition = {
      id,
      name,
      description: `Custom workflow: ${agentIds.join(' → ')}`,
      trigger: 'manual',
      steps: agentIds.map((agentId, index) => ({
        agentId,
        input: { ...baseInput, _stepIndex: index },
        outputKey: `step-${index}-${agentId}`,
      })),
    }
    this.registerWorkflow(workflow)
    return workflow
  }
}

// Singleton instance
let hermesManager: HermesAgentManager | null = null

export function getHermesManager(): HermesAgentManager {
  if (!hermesManager) {
    hermesManager = new HermesAgentManager()
  }
  return hermesManager
}

// Helper to run workflow from webhook
export async function runWorkflowFromWebhook(
  workflowId: string,
  payload: Record<string, unknown>
): Promise<HermesExecutionResult> {
  const manager = getHermesManager()
  return manager.executeWorkflow(workflowId, payload)
}