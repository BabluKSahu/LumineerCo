'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Bot,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  RefreshCw,
  Download,
  FileText,
  BarChart3,
  Settings,
  LogOut,
} from 'lucide-react'

interface DashboardStats {
  totalLeads: number
  activeProjects: number
  completedProjects: number
  totalRevenue: number
  conversionRate: number
  avgProjectValue: number
}

interface Project {
  id: string
  clientName: string
  service: string
  status: 'new' | 'planning' | 'in_progress' | 'review' | 'completed' | 'delivered'
  value: number
  createdAt: string
  agentStatus: 'idle' | 'working' | 'completed' | 'error'
}

interface AgentStatus {
  name: string
  status: 'idle' | 'working' | 'error'
  tasksCompleted: number
  avgTime: string
  successRate: number
}

const mockStats: DashboardStats = {
  totalLeads: 127,
  activeProjects: 23,
  completedProjects: 89,
  totalRevenue: 245000,
  conversionRate: 68,
  avgProjectValue: 2750,
}

const mockProjects: Project[] = [
  { id: 'PRJ-001', clientName: 'Acme Corp', service: 'Website Development', status: 'in_progress', value: 15000, createdAt: '2024-01-15', agentStatus: 'working' },
  { id: 'PRJ-002', clientName: 'TechStart', service: 'Content Creation', status: 'review', value: 5000, createdAt: '2024-01-14', agentStatus: 'completed' },
  { id: 'PRJ-003', clientName: 'DesignHub', service: 'UI/UX Design', status: 'planning', value: 8000, createdAt: '2024-01-13', agentStatus: 'idle' },
  { id: 'PRJ-004', clientName: 'DataFlow', service: 'SEO Audit', status: 'completed', value: 3000, createdAt: '2024-01-12', agentStatus: 'completed' },
  { id: 'PRJ-005', clientName: 'CloudNine', service: 'Social Media', status: 'new', value: 12000, createdAt: '2024-01-16', agentStatus: 'idle' },
  { id: 'PRJ-006', clientName: 'LegalEase', service: 'Legal Documents', status: 'in_progress', value: 4500, createdAt: '2024-01-11', agentStatus: 'working' },
]

const mockAgents: AgentStatus[] = [
  { name: 'Website Dev', status: 'working', tasksCompleted: 45, avgTime: '2.3h', successRate: 96 },
  { name: 'Content', status: 'idle', tasksCompleted: 67, avgTime: '1.1h', successRate: 94 },
  { name: 'Design', status: 'idle', tasksCompleted: 34, avgTime: '3.2h', successRate: 91 },
  { name: 'Scripts', status: 'working', tasksCompleted: 28, avgTime: '1.8h', successRate: 89 },
  { name: 'SEO', status: 'idle', tasksCompleted: 52, avgTime: '4.5h', successRate: 93 },
  { name: 'E-Books', status: 'idle', tasksCompleted: 19, avgTime: '6.2h', successRate: 88 },
  { name: 'Social Media', status: 'working', tasksCompleted: 78, avgTime: '0.9h', successRate: 95 },
  { name: 'Legal', status: 'error', tasksCompleted: 31, avgTime: '2.1h', successRate: 87 },
  { name: 'Security', status: 'idle', tasksCompleted: 12, avgTime: '5.4h', successRate: 90 },
  { name: 'Sales', status: 'idle', tasksCompleted: 56, avgTime: '1.4h', successRate: 92 },
]

const statusColors = {
  new: 'bg-blue-100 text-blue-700 border-blue-200',
  planning: 'bg-amber-100 text-amber-700 border-amber-200',
  in_progress: 'bg-purple-100 text-purple-700 border-purple-200',
  review: 'bg-cyan-100 text-cyan-700 border-cyan-200',
  completed: 'bg-green-100 text-green-700 border-green-200',
  delivered: 'bg-gray-100 text-gray-700 border-gray-200',
}

const agentStatusColors = {
  idle: 'bg-gray-100 text-gray-600',
  working: 'bg-amber-100 text-amber-700 animate-pulse',
  completed: 'bg-green-100 text-green-700',
  error: 'bg-red-100 text-red-700',
}

const agentDotColors = {
  idle: 'bg-gray-400',
  working: 'bg-amber-500 animate-pulse',
  completed: 'bg-green-500',
  error: 'bg-red-500',
}

export function AdminDashboard() {
  const [stats] = useState<DashboardStats>(mockStats)
  const [projects] = useState<Project[]>(mockProjects)
  const [agents] = useState<AgentStatus[]>(mockAgents)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  useEffect(() => {
    const interval = setInterval(() => setLastUpdated(new Date()), 30000)
    return () => clearInterval(interval)
  }, [])

  const statCards = [
    { label: 'Total Leads', value: stats.totalLeads, icon: Users, color: 'text-blue-500', change: '+12%' },
    { label: 'Active Projects', value: stats.activeProjects, icon: Briefcase, color: 'text-purple-500', change: '+3' },
    { label: 'Completed', value: stats.completedProjects, icon: CheckCircle, color: 'text-green-500', change: '+8' },
    { label: 'Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-amber-500', change: '+18%' },
    { label: 'Conversion', value: `${stats.conversionRate}%`, icon: TrendingUp, color: 'text-cyan-500', change: '+5%' },
    { label: 'Avg Project', value: `₹${stats.avgProjectValue.toLocaleString()}`, icon: BarChart3, color: 'text-pink-500', change: '+7%' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 z-40 hidden lg:block">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5 text-amber-500" />
              </div>
              <span className="text-xl font-bold text-gray-900">Admin Panel</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">LumineerCo Internal</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            <a href="#overview" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors">
              <LayoutDashboard className="w-5 h-5" />
              Overview
            </a>
            <a href="#projects" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors">
              <Briefcase className="w-5 h-5" />
              Projects
            </a>
            <a href="#agents" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors">
              <Bot className="w-5 h-5" />
              Agents
            </a>
            <a href="#analytics" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors">
              <BarChart3 className="w-5 h-5" />
              Analytics
            </a>
            <a href="#settings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors">
              <Settings className="w-5 h-5" />
              Settings
            </a>
          </nav>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-gray-200 space-y-2">
            <Button variant="outline" className="w-full justify-start gap-3" onClick={() => window.open('/api/telegram/webhook?backup=true', '_blank')}>
              <Download className="w-4 h-4" />
              Create Backup
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3 text-red-600 hover:bg-red-50">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 pt-16">
        <div className="p-6 md:p-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">Real-time overview of your AI-powered studio</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={() => setLastUpdated(new Date())}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <span className="text-sm text-gray-500 hidden sm:block">
                Updated: {lastUpdated.toLocaleTimeString()}
              </span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
            {statCards.map((stat) => (
              <Card key={stat.label} variant="bordered" className="relative overflow-hidden">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                      <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                      <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" /> {stat.change} vs last week
                      </p>
                    </div>
                    <div className={cn('p-3 rounded-xl', `${stat.color}/10 border border-current/20`)}>
                      <stat.icon className={cn('w-6 h-6', stat.color)} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Projects Table */}
            <Card variant="bordered" className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Active Projects</CardTitle>
                <Button variant="ghost" size="sm">View All</Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left p-4 font-medium text-gray-600 text-sm">Project</th>
                        <th className="text-left p-4 font-medium text-gray-600 text-sm hidden md:table-cell">Client</th>
                        <th className="text-left p-4 font-medium text-gray-600 text-sm hidden lg:table-cell">Service</th>
                        <th className="text-left p-4 font-medium text-gray-600 text-sm">Status</th>
                        <th className="text-left p-4 font-medium text-gray-600 text-sm hidden sm:table-cell">Agent</th>
                        <th className="text-right p-4 font-medium text-gray-600 text-sm">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projects.map((project) => (
                        <tr key={project.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="p-4">
                            <div className="font-medium text-gray-900">{project.id}</div>
                            <div className="text-xs text-gray-500">{new Date(project.createdAt).toLocaleDateString()}</div>
                          </td>
                          <td className="p-4 hidden md:table-cell text-gray-700">{project.clientName}</td>
                          <td className="p-4 hidden lg:table-cell text-gray-600 text-sm">{project.service}</td>
                          <td className="p-4">
                            <span className={cn('px-2.5 py-1 rounded-full text-xs font-medium border', statusColors[project.status])}>
                              {project.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="p-4 hidden sm:table-cell">
                            <span className={cn('px-2 py-0.5 rounded text-xs font-medium', agentStatusColors[project.agentStatus])}>
                              {project.agentStatus.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="p-4 text-right font-medium text-gray-900">₹{project.value.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Agent Status */}
            <Card variant="bordered">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>AI Agents</CardTitle>
                <Button variant="ghost" size="sm">Restart All</Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-100">
                  {agents.map((agent) => (
                    <div key={agent.name} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={cn('w-2.5 h-2.5 rounded-full', agentDotColors[agent.status])} />
                        <div>
                          <p className="font-medium text-gray-900 truncate">{agent.name}</p>
                          <p className="text-xs text-gray-500">{agent.tasksCompleted} tasks &bull; {agent.avgTime} avg</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{agent.successRate}%</p>
                        <p className="text-xs text-gray-500">Success Rate</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card variant="bordered" className="p-6 text-center hover:border-amber-500/50 transition-colors cursor-pointer">
              <FileText className="w-8 h-8 text-amber-500 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">Generate Report</h3>
              <p className="text-sm text-gray-600">Weekly PDF report</p>
            </Card>
            <Card variant="bordered" className="p-6 text-center hover:border-amber-500/50 transition-colors cursor-pointer">
              <Users className="w-8 h-8 text-amber-500 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">New Client</h3>
              <p className="text-sm text-gray-600">Onboard client</p>
            </Card>
            <Card variant="bordered" className="p-6 text-center hover:border-amber-500/50 transition-colors cursor-pointer">
              <Bot className="w-8 h-8 text-amber-500 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">Deploy Agent</h3>
              <p className="text-sm text-gray-600">Start new task</p>
            </Card>
            <Card variant="bordered" className="p-6 text-center hover:border-amber-500/50 transition-colors cursor-pointer">
              <Settings className="w-8 h-8 text-amber-500 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">Settings</h3>
              <p className="text-sm text-gray-600">Configure system</p>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}