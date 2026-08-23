# LumineerCo — AI-Powered Creative Studio

A full-stack Next.js application recreating the LumineerCo website with **10 specialized AI agents** integrated for every service, **Telegram bot** for admin commands/reports, and **Telegram as encrypted cloud storage** for client data.

## 🌟 Features

### Website
- **Modern Dark Theme** — Amber accent, smooth animations, fully responsive
- **10 Services** — Website Dev, Content, Design, Scripts, SEO, E-Books, Social Media, Legal, Security, Sales, Marketing
- **Interactive Sections** — Hero, Services, Process, Stats Counter, Testimonials Carousel, CTA, Contact Form
- **Accessible** — Semantic HTML, focus management, ARIA labels

### AI Agents (10 Specialized)
| Agent | Service | Capabilities |
|-------|---------|--------------|
| 🌐 WebsiteDevAgent | Website Development | Next.js, React, TypeScript, Tailwind, DB, Auth, Deploy |
| ✍️ ContentAgent | Content Creation | SEO research, outlines, writing, optimization, distribution |
| 🎨 DesignAgent | Design Services | Brand identity, UI/UX, Figma specs, design systems, handoff |
| ⚙️ ScriptsAgent | Scripts & Automation | Python, APIs, scrapers, ETL, workflow automation, CI/CD |
| 🔍 SEOAgent | SEO & Traffic Growth | Technical audit, keyword strategy, content plan, link building |
| 📚 EbooksAgent | E-Books & Digital Products | Manuscripts, formatting (PDF/EPUB/Kindle), covers, launch |
| 📱 SocialMediaAgent | Social Media Marketing | Strategy, calendars, hooks, visual specs, engagement playbooks |
| ⚖️ LegalAgent | Legal Document Drafting | NDAs, ToS, Privacy, contracts, compliance (GDPR/DPDP/CCPA) |
| 🔒 SecurityAgent | Cybersecurity Audit | SAST/DAST, penetration testing, OWASP, remediation |
| 💼 SalesAgent | Sales Copy & Proposals | Cold email, proposals, landing pages, VSL, pitch decks |

### Telegram Integration
- **Admin Commands** — `/status`, `/projects`, `/stats`, `/agents`, `/backup`, `/logs`, `/weekly`
- **Automated Reports** — Daily summaries, weekly analytics, real-time alerts
- **Cloud Storage** — Encrypted client/project data in private Telegram channel
- **File Management** — Documents, code, assets stored as Telegram messages

### Architecture
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Website   │────▶│  API Routes │────▶│  AI Agents  │
│  (Next.js)  │     │  (Agent Exec)│     │  (10 Types) │
└─────────────┘     └─────────────┘     └─────────────┘
                           │                    │
                           ▼                    ▼
                    ┌─────────────┐     ┌─────────────┐
                    │  Telegram   │     │  Telegram   │
                    │   Storage   │     │   Reports   │
                    │ (Encrypted) │     │  (Admin)    │
                    └─────────────┘     └─────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Telegram Bot Token (from @BotFather)
- Private Telegram Channel for storage
- OpenAI/Anthropic API key (for agents)

### Installation

```bash
# Clone and install
cd lumineerco
npm install

# Copy environment template
cp .env.example .env.local

# Edit .env.local with your credentials
# Required: TELEGRAM_BOT_TOKEN, TELEGRAM_ADMIN_CHAT_ID, TELEGRAM_STORAGE_CHANNEL_ID
# Required: ENCRYPTION_KEY (generate: openssl rand -base64 32)
# Required: OPENAI_API_KEY or ANTHROPIC_API_KEY
# Required: NEXTAUTH_SECRET (generate: openssl rand -base64 32)
```

### Telegram Setup

1. **Create Bot** — Message @BotFather, `/newbot`, save token
2. **Get Admin Chat ID** — Message @userinfobot, save your numeric ID
3. **Create Storage Channel** — Create private channel, add bot as admin, get channel ID (starts with -100)
4. **Set Webhook** — After deploy: `curl -X GET https://your-app.vercel.app/api/telegram/webhook`

### Development

```bash
# Start dev server
npm run dev

# In another terminal, start Telegram bot
npm run telegram:bot
```

Visit `http://localhost:3000`

### Production Deployment

**Vercel (Frontend + API):**
```bash
vercel deploy --prod
```

**Railway/Render (Telegram Bot):**
```bash
# Set environment variables in dashboard
# Run: npm run telegram:bot
```

## 📁 Project Structure

```
lumineerco/
├── app/
│   ├── api/
│   │   ├── contact/route.ts          # Contact form → Telegram
│   │   ├── agents/execute/route.ts   # Trigger agent tasks
│   │   └── telegram/webhook/route.ts # Telegram webhook handler
│   ├── layout.tsx                    # Root layout + metadata
│   ├── page.tsx                      # Home page
│   └── globals.css                   # Tailwind + custom styles
├── components/
│   ├── ui/                           # Button, Card, Forms
│   └── sections/                     # Hero, Services, Process, etc.
├── agents/
│   ├── base.ts                       # BaseAgent class + registry
│   ├── website-dev.ts                # Website development agent
│   ├── content.ts                    # Content creation agent
│   ├── design.ts                     # Design services agent
│   ├── scripts.ts                    # Scripts & automation agent
│   ├── seo.ts                        # SEO & traffic agent
│   ├── ebooks.ts                     # E-books & digital products agent
│   ├── social.ts                     # Social media agent
│   ├── legal.ts                      # Legal documents agent
│   ├── security.ts                   # Cybersecurity agent
│   ├── sales.ts                      # Sales copy agent
│   └── index.ts                      # Agent registry
├── telegram/
│   ├── bot.ts                        # Bot initialization
│   ├── storage.ts                    # Encrypted Telegram storage
│   └── handlers.ts                   # Admin command handlers
├── lib/
│   ├── utils.ts                      # Constants, helpers, services data
│   └── encryption.ts                 # AES-256-GCM encryption
├── SPEC.md                           # Full specification
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── next.config.js
└── .env.example
```

## 🤖 Agent System

Each agent extends `BaseAgent` with:
- **Specialized system prompt** for domain expertise
- **Planning** — Breaks tasks into steps
- **Execution** — Runs steps with progress tracking
- **Review** — Quality gates before delivery
- **Output formatting** — Structured deliverables

### Adding a New Agent

```typescript
// agents/new-service.ts
import { BaseAgent, AgentTask, AgentResult } from './base'

export class NewServiceAgent extends BaseAgent {
  constructor() {
    super(
      'New Service',
      `You are an expert in...`,
      ['tool1', 'tool2']
    )
  }

  async execute(task: AgentTask): Promise<AgentResult> {
    // Implementation
  }

  protected async plan(input: unknown): Promise<string[]> {
    return ['Step 1', 'Step 2', 'Step 3']
  }
}

// Register in agents/index.ts
agentRegistry.register(new NewServiceAgent())
```

## 🔐 Telegram Cloud Storage

Data stored as encrypted JSON in private channel messages:

```json
{
  "type": "client|project|deliverable|conversation|backup",
  "id": "uuid",
  "projectId": "uuid",
  "data": { ... },
  "timestamp": "ISO8601",
  "encrypted": true
}
```

### Encryption
- AES-256-GCM via `crypto-js`
- Key from `ENCRYPTION_KEY` env (32 bytes base64)
- All client data encrypted before sending to Telegram

## 📊 Admin Commands

| Command | Description |
|---------|-------------|
| `/start` | Welcome & command list |
| `/status` | System health (agents, storage, uptime) |
| `/projects` | Active projects list |
| `/stats` | Daily business metrics |
| `/agents` | All 10 agent statuses |
| `/backup` | Create encrypted backup |
| `/logs` | Recent activity |
| `/weekly` | Weekly analytics report |

## 🔧 Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | Yes* | OpenAI API for agents |
| `ANTHROPIC_API_KEY` | Yes* | Anthropic API for agents |
| `TELEGRAM_BOT_TOKEN` | Yes | Bot token from @BotFather |
| `TELEGRAM_ADMIN_CHAT_ID` | Yes | Your numeric Telegram ID |
| `TELEGRAM_STORAGE_CHANNEL_ID` | Yes | Private channel ID (-100...) |
| `ENCRYPTION_KEY` | Yes | 32-byte base64 encryption key |
| `NEXTAUTH_SECRET` | Yes | NextAuth secret (32+ chars) |
| `NEXTAUTH_URL` | Yes | Production URL |
| `DATABASE_URL` | No | PostgreSQL for metadata |

*At least one AI provider required

## 📈 Monitoring

- **Health Checks** — `/api/health` endpoint
- **Agent Metrics** — Completion time, success rate, revisions
- **Business Metrics** — Leads, conversions, revenue, client satisfaction
- **Telegram Alerts** — Real-time notifications for new leads, completions, errors

## 🧪 Testing

```bash
# Type checking
npx tsc --noEmit

# Linting
npm run lint

# Build test
npm run build
```

## 📝 License

MIT License — Feel free to use for your own projects.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Add agent or improve existing
4. Submit PR

## 📞 Support

- Email: hello@lumineerco.com
- Telegram: @lumineerco_support
- GitHub Issues: For bugs and feature requests