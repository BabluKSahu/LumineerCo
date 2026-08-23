'use client'

import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { ArrowRight, Sparkles, Zap, Shield, Clock } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-gray-900 to-black" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium mb-8 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
            </span>
            AI-Powered Creative Studio
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight leading-[1.1] mb-6 animate-slide-up">
            We Build. We Design.{' '}
            <span className="relative">
              <span className="relative z-10">We Deliver.</span>
              <span className="absolute bottom-0 left-0 right-0 h-2 bg-amber-500/30 -z-10" />
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-12 animate-slide-up" style={{ animationDelay: '100ms' }}>
            LumineerCo delivers websites, content, designs, and scripts — fast, affordable, and always on.
            <br />
            <span className="text-amber-400 font-medium">Professional results at a fraction of traditional cost and time.</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
            <Button size="lg" className="group w-full sm:w-auto" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
              <span>Start Your Project</span>
              <ArrowRight className="transition-transform group-hover:translate-x-1" size={20} />
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              View Our Work
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-gray-500 animate-slide-up" style={{ animationDelay: '300ms' }}>
            <div className="flex items-center gap-2">
              <Shield className="text-amber-500" size={18} />
              <span className="text-sm">Secure & Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="text-amber-500" size={18} />
              <span className="text-sm">48hr Average Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="text-amber-500" size={18} />
              <span className="text-sm">24/7 AI Operations</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="text-amber-500" size={18} />
              <span className="text-sm">10 Specialized Agents</span>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  )
}