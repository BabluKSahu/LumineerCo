'use client'

import { cn } from '@/lib/utils'
import { stats } from '@/lib/utils'
import { useEffect, useState } from 'react'

export function Stats() {
  const [counters, setCounters] = useState<Record<string, number>>({})

  useEffect(() => {
    stats.forEach((stat) => {
      const target = parseInt(stat.value.replace(/\D/g, ''))
      const suffix = stat.value.replace(/\d/g, '')
      let current = 0
      const increment = target / 50
      const timer = setInterval(() => {
        current += increment
        if (current >= target) {
          current = target
          clearInterval(timer)
        }
        setCounters((prev) => ({ ...prev, [stat.label]: Math.floor(current) }))
      }, 30)
      return () => clearInterval(timer)
    })
  }, [])

  return (
    <section className="py-24 px-6 border-y border-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={stat.label} className="text-center">
              <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2">
                {counters[stat.label] ? `${counters[stat.label]}${stat.value.replace(/\d/g, '')}` : stat.value}
              </div>
              <div className="text-gray-400 text-lg">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}