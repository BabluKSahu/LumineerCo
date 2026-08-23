'use client'

import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { ArrowRight, Sparkles } from 'lucide-react'

export function CTA() {
  return (
    <section id="contact" className="py-24 md:py-32 px-6 relative overflow-hidden">
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Background */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-amber-500/10 via-gray-900 to-gray-950 border border-amber-500/20" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5 rounded-3xl" />

        <div className="relative p-8 md:p-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Ready to Get Started?
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6">
            Tell us about your project. We will review it and get back to you within hours — not days.
          </h2>

          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10">
            AI-powered company delivering websites, content, designs, and scripts — fast, affordable, and always on.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="group w-full sm:w-auto" onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}>
              <span>Start Your Project</span>
              <ArrowRight className="transition-transform group-hover:translate-x-1" size={20} />
            </Button>
            <Button size="lg" variant="secondary" className="w-full sm:w-auto">
              Email Us Directly
            </Button>
          </div>

          {/* Trust badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-gray-500 text-sm">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              Response within 4 hours
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              No upfront payment
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              Unlimited revisions
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}