'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input, Textarea, Select } from '@/components/ui/Forms'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { cn } from '@/lib/utils'
import { services } from '@/lib/utils'
import { Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: '',
    budget: '',
    timeline: '',
    message: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format'
    if (!formData.service) newErrors.service = 'Please select a service'
    if (!formData.message.trim()) newErrors.message = 'Message is required'
    else if (formData.message.trim().length < 20) newErrors.message = 'Message must be at least 20 characters'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setStatus('submitting')
    setErrorMessage('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error('Submission failed')

      setStatus('success')
      setFormData({ name: '', email: '', service: '', budget: '', timeline: '', message: '' })
    } catch (err) {
      setStatus('error')
      setErrorMessage('Failed to submit. Please try again or email us directly.')
    }
  }

  const budgetOptions = [
    { value: '', label: 'Select budget range' },
    { value: '500-2000', label: '₹500 - ₹2,000' },
    { value: '2000-5000', label: '₹2,000 - ₹5,000' },
    { value: '5000-15000', label: '₹5,000 - ₹15,000' },
    { value: '15000-50000', label: '₹15,000 - ₹50,000' },
    { value: '50000+', label: '₹50,000+' },
  ]

  const timelineOptions = [
    { value: '', label: 'When do you need this?' },
    { value: 'asap', label: 'ASAP' },
    { value: '1-week', label: 'Within 1 week' },
    { value: '2-weeks', label: '2-3 weeks' },
    { value: '1-month', label: '1 month' },
    { value: 'flexible', label: 'Flexible' },
  ]

  return (
    <section id="contact-form" className="py-24 md:py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Info Side */}
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium mb-4">
              Contact Us
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6">
              Tell Us About Your Project
            </h2>
            <p className="text-gray-400 text-lg mb-10">
              Fill out the form and our AI-powered team will review your requirements and get back within 4 hours.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-900/50 border border-gray-800">
                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <CheckCircle className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <p className="font-medium text-white">Response within 4 hours</p>
                  <p className="text-sm text-gray-400">No bots, real human review</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-900/50 border border-gray-800">
                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <CheckCircle className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <p className="font-medium text-white">No upfront payment</p>
                  <p className="text-sm text-gray-400">Pay only when satisfied</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-900/50 border border-gray-800">
                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <CheckCircle className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <p className="font-medium text-white">Unlimited revisions</p>
                  <p className="text-sm text-gray-400">Until it's perfect</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <Card variant="bordered" className="p-6 md:p-8">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl">Project Details</CardTitle>
            </CardHeader>
            <CardContent>
              {status === 'success' && (
                <div className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/30 flex items-center gap-3 text-green-400 animate-fade-in">
                  <CheckCircle className="w-6 h-6 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Message sent successfully!</p>
                    <p className="text-sm">We'll get back to you within 4 hours.</p>
                  </div>
                </div>
              )}

              {status === 'error' && (
                <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center gap-3 text-red-400 animate-fade-in">
                  <AlertCircle className="w-6 h-6 flex-shrink-0" />
                  <p>{errorMessage}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div className="grid md:grid-cols-2 gap-5">
                  <Input
                    label="Full Name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    error={errors.name}
                    disabled={status === 'submitting'}
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="john@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    error={errors.email}
                    disabled={status === 'submitting'}
                  />
                </div>

                <Select
                  label="Service Needed"
                  options={services.map((s) => ({ value: s.id, label: s.title }))}
                  placeholder="Select a service"
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  error={errors.service}
                  disabled={status === 'submitting'}
                />

                <div className="grid md:grid-cols-2 gap-5">
                  <Select
                    label="Budget Range"
                    options={budgetOptions}
                    placeholder="Select budget"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    disabled={status === 'submitting'}
                  />
                  <Select
                    label="Timeline"
                    options={timelineOptions}
                    placeholder="Select timeline"
                    value={formData.timeline}
                    onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                    disabled={status === 'submitting'}
                  />
                </div>

                <Textarea
                  label="Project Description"
                  placeholder="Describe your project, goals, requirements, and any specific details..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  error={errors.message}
                  rows={5}
                  disabled={status === 'submitting'}
                />

                <Button
                  type="submit"
                  size="lg"
                  className="w-full group"
                  loading={status === 'submitting'}
                  disabled={status === 'submitting'}
                >
                  <span>{status === 'submitting' ? 'Submitting...' : 'Submit Project'}</span>
                  {status !== 'submitting' && <Send className="transition-transform group-hover:translate-x-1" size={20} />}
                  {status === 'submitting' && <Loader2 className="animate-spin" size={20} />}
                </Button>

                <p className="text-center text-sm text-gray-500">
                  By submitting, you agree to our{' '}
                  <a href="/terms" className="text-amber-400 hover:underline">Terms</a>{' '}
                  and{' '}
                  <a href="/privacy" className="text-amber-400 hover:underline">Privacy Policy</a>
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}