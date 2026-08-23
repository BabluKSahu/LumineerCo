import { BaseAgent, AgentTask, AgentResult } from './base'

export class ScriptsAgent extends BaseAgent {
  constructor() {
    super(
      'Scripts & Automation',
      `You are an expert automation engineer and Python developer.

Your expertise includes:
- Python scripting (data processing, ETL, APIs)
- Workflow automation (cron, Airflow, Prefect)
- API development (FastAPI, Flask, REST, GraphQL)
- Database scripting (SQL, PostgreSQL, MongoDB)
- Web scraping (BeautifulSoup, Selenium, Playwright)
- Cloud automation (AWS CLI, Terraform, serverless)
- CI/CD pipelines (GitHub Actions, GitLab CI)
- Monitoring and alerting scripts

When given a project, you:
1. Analyze requirements and design architecture
2. Choose appropriate tech stack
3. Write clean, documented, tested code
4. Add error handling, logging, retries
5. Create deployment/running instructions
6. Provide maintenance guide

Output format: Complete codebase, requirements.txt, README, deployment guide, test cases.`,
      ['code_execution', 'web_search', 'api_testing']
    )
  }

  async execute(task: AgentTask): Promise<AgentResult> {
    const { input } = task
    const req = input as {
      type: 'data-analysis' | 'api' | 'scraper' | 'automation' | 'etl' | 'monitoring'
      requirements: string[]
      language?: 'python' | 'javascript' | 'bash'
      schedule?: string
      integrations?: string[]
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
      'Analyze requirements and design solution',
      'Set up project structure and dependencies',
      'Implement core functionality',
      'Add error handling and logging',
      'Write unit and integration tests',
      'Create configuration management',
      'Document usage and deployment',
      'Package for distribution',
    ]
  }

  protected async executeStep(step: string, input: unknown): Promise<unknown> {
    console.log(`[Scripts] Executing: ${step}`)
    return { step, completed: true }
  }

  private generateDeliverable(req: any) {
    return {
      type: req.type,
      language: req.language || 'python',
      structure: this.getStructure(req.type),
      mainFiles: this.getMainFiles(req.type),
      requirements: this.getRequirements(req.type),
      deployment: this.getDeploymentGuide(req.type),
      testing: this.getTestingGuide(),
    }
  }

  private getStructure(type: string) {
    const base = [
      'src/',
      '  main.py',
      '  config.py',
      '  utils.py',
      'tests/',
      '  test_main.py',
      'requirements.txt',
      'README.md',
      '.env.example',
      'Dockerfile',
    ]
    return base
  }

  private getMainFiles(type: string) {
    const files: Record<string, string> = {
      'data-analysis': 'src/main.py - Data loading, processing, analysis, visualization',
      api: 'src/main.py - FastAPI app with endpoints, validation, docs',
      scraper: 'src/main.py - Async scraper with rate limiting, parsing',
      automation: 'src/main.py - Workflow orchestration, triggers, actions',
      etl: 'src/main.py - Extract, transform, load pipeline',
      monitoring: 'src/main.py - Metrics collection, alerting, reporting',
    }
    return files[type] || files.automation
  }

  private getRequirements(type: string) {
    const base = ['python-dotenv', 'loguru', 'pydantic', 'pytest']
    const specific: Record<string, string[]> = {
      'data-analysis': ['pandas', 'numpy', 'matplotlib', 'seaborn'],
      api: ['fastapi', 'uvicorn', 'sqlalchemy', 'alembic'],
      scraper: ['httpx', 'beautifulsoup4', 'playwright'],
      automation: ['apscheduler', 'celery', 'redis'],
      etl: ['sqlalchemy', 'psycopg2', 'pandas'],
      monitoring: ['prometheus-client', 'grafana-api'],
    }
    return [...base, ...(specific[type] || [])]
  }

  private getDeploymentGuide(type: string) {
    return `
1. Create virtual environment: python -m venv venv
2. Install dependencies: pip install -r requirements.txt
3. Configure .env from .env.example
4. Run tests: pytest
5. Run locally: python src/main.py
6. For production: Docker build && deploy
    `.trim()
  }

  private getTestingGuide() {
    return {
      unit: 'pytest tests/ -v',
      coverage: 'pytest --cov=src tests/',
      lint: 'ruff src/ tests/',
      typeCheck: 'mypy src/',
    }
  }
}