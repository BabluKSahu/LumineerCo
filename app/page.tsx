'use client'

import { Hero } from '@/components/sections/Hero'
import { Services } from '@/components/sections/Services'
import { Process } from '@/components/sections/Process'
import { Stats } from '@/components/sections/Stats'
import { Testimonials } from '@/components/sections/Testimonials'
import { CTA } from '@/components/sections/CTA'
import { ContactForm } from '@/components/sections/ContactForm'
import { Footer } from '@/components/sections/Footer'
import { Navbar } from '@/components/sections/Navbar'

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-black">
      <Navbar />
      <main className="pt-0">
        <Hero />
        <Services />
        <Process />
        <Stats />
        <Testimonials />
        <CTA />
        <ContactForm />
      </main>
      <Footer />
    </div>
  )
}