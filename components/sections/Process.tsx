'use client'

import { Card, CardContent } from '@/components/ui/Card'
import { cn } from '@/lib/utils'
import { processSteps } from '@/lib/utils'
import { MessageSquare, Cpu, RefreshCw, CheckCircle } from 'lucide-react'

const stepIcons = {
  MessageSquare,
  Cpu,
  RefreshCw,
  CheckCircle,
}

export function Process() {
  return (
    <section id="process" className="py-24 md:py-32 px-6 bg-gray-950/30">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium mb-4">
            Simple Process
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
            How It Works
          </h2>
          <p className="text-gray-400 text-lg">
            Four simple steps from idea to delivery. No meetings, no back-and-forth — just results.
          </p>
        </div>

        {/* Process Steps */}
        <div className="relative">
          {/* Connecting Line */}
          <div className="hidden lg:block absolute left-1/2 top-16 bottom-16 w-0.5 bg-gradient-to-b from-amber-500/50 to-transparent" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {processSteps.map((step, index) => (
              <div key={step.step} className="relative">
                {/* Step Number */}
                <div className="absolute left-1/2 -translate-x-1/2 top-0 z-20">
                  <div className="w-12 h-12 rounded-full bg-amber-500/10 border-2 border-amber-500 flex items-center justify-center text-xl font-bold text-amber-400">
                    {step.step}
                  </div>
                </div>

                <Card variant="bordered" className="h-full pt-16">
                  <CardContent className="text-center">
                    <div className="mb-4">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                        <stepIcons[step.icon as keyof typeof stepIcons] className="w-8 h-8 text-amber-400" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                    <p className="text-gray-400">{step.description}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}