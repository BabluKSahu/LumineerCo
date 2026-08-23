'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { services } from '@/lib/utils'
import { Code, FileText, Palette, Terminal, Search, BookOpen, Share2, Shield, Lock, MessageSquare } from 'lucide-react'

const serviceIcons = {
  Code,
  FileText,
  Palette,
  Terminal,
  Search,
  BookOpen,
  Share2,
  Shield,
  Lock,
  MessageSquare,
}

export function Services() {
  return (
    <section id="services" className="py-24 md:py-32 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium mb-4">
            What We Offer
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
            Services Built for the Modern Era
          </h2>
          <p className="text-gray-400 text-lg">
            From concept to delivery, our AI-powered team handles every step — so you get professional results at a fraction of traditional cost and time.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = serviceIcons[service.icon as keyof typeof serviceIcons]
            return (
              <Card
                key={service.id}
                variant="bordered"
                hover
                className="group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 group-hover:bg-amber-500/20 group-hover:border-amber-500/30 transition-all duration-300">
                      <Icon className="w-6 h-6 text-amber-400" />
                    </div>
                    <span className="text-xs font-medium text-amber-400 uppercase tracking-wider">
                      From {service.price}
                    </span>
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-gray-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" className="w-full group">
                    Get Started
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}