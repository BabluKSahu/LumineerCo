import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency = 'INR') {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(date))
}

export function generateId() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

export const services = [
  {
    id: 'website-development',
    title: 'Website Development',
    description: 'Full-stack websites, landing pages, e-commerce stores, and SaaS dashboards built with modern frameworks.',
    icon: 'Code',
    price: '₹15,000+',
    features: ['Next.js/React', 'TypeScript', 'Tailwind CSS', 'Database & Auth', 'Deployment'],
  },
  {
    id: 'content-creation',
    title: 'Content Creation',
    description: 'SEO-optimized blogs, articles, marketing copy, and social media content packages.',
    icon: 'FileText',
    price: '₹2,000+',
    features: ['Keyword Research', 'SEO Optimization', 'Multiple Formats', 'Revision Rounds'],
  },
  {
    id: 'design-services',
    title: 'Design Services',
    description: 'Professional resume design, brand identities, UI mockups, and creative visual assets.',
    icon: 'Palette',
    price: '₹3,000+',
    features: ['Figma Delivery', 'Brand Guidelines', 'Multiple Revisions', 'Source Files'],
  },
  {
    id: 'scripts-automation',
    title: 'Scripts & Automation',
    description: 'Python data analysis scripts, automation workflows, APIs, and custom tooling.',
    icon: 'Terminal',
    price: '₹5,000+',
    features: ['Python/Node.js', 'API Integration', 'Scheduling', 'Documentation'],
  },
  {
    id: 'seo-traffic',
    title: 'SEO & Traffic Growth',
    description: 'Drive 100% free organic traffic using advanced SEO, backlinking, and content strategy.',
    icon: 'Search',
    price: '₹10,000+',
    features: ['Technical Audit', 'Content Strategy', 'Link Building', 'Monthly Reports'],
  },
  {
    id: 'ebooks-digital',
    title: 'E-Books & Digital Products',
    description: 'Kindle/Gumroad-ready e-books, templates, courses, and downloadable digital products.',
    icon: 'BookOpen',
    price: '₹8,000+',
    features: ['Research & Outline', 'Professional Writing', 'Formatting (PDF/EPUB)', 'Cover Design'],
  },
  {
    id: 'social-media',
    title: 'Social Media Marketing',
    description: 'Platform-specific social media posts, viral hooks, and growth strategies for Twitter, LinkedIn, Instagram.',
    icon: 'Share2',
    price: '₹5,000+',
    features: ['Content Calendar', 'Platform Optimization', 'Engagement Strategy', 'Analytics'],
  },
  {
    id: 'legal-documents',
    title: 'Legal Document Drafting',
    description: 'NDAs, Terms of Service, Privacy Policies, Freelancer Contracts, and compliance documents.',
    icon: 'Shield',
    price: '₹4,000+',
    features: ['Jurisdiction Aware', 'Plain Language', 'Customizable', 'Review Included'],
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity Audit',
    description: 'Code vulnerability scanning, security auditing, penetration testing reports, and hardening.',
    icon: 'Lock',
    price: '₹20,000+',
    features: ['SAST/DAST', 'OWASP Top 10', 'Remediation Guide', 'Retest Included'],
  },
  {
    id: 'sales-copy',
    title: 'Sales Copy & Proposals',
    description: 'High-converting sales emails, Upwork/Fiverr proposals, cold outreach, and pitch decks.',
    icon: 'MessageSquare',
    price: '₹3,000+',
    features: ['AIDA/PAS Frameworks', 'Platform Optimized', 'A/B Test Variants', 'Follow-up Sequences'],
  },
]

export const processSteps = [
  {
    step: 1,
    title: 'Share Your Idea',
    description: 'Tell us what you need — a website, content, design, or script. Share your requirements, preferences, and deadline.',
    icon: 'MessageSquare',
  },
  {
    step: 2,
    title: 'We Get to Work',
    description: 'Our AI-powered team collaborates to plan, build, review, and polish your project — all autonomously.',
    icon: 'Cpu',
  },
  {
    step: 3,
    title: 'Review & Iterate',
    description: 'Review the deliverable, request revisions if needed. We ensure everything meets quality standards before delivery.',
    icon: 'RefreshCw',
  },
  {
    step: 4,
    title: 'Delivery & Payment',
    description: 'Receive your finished project. Pay only when satisfied via bank transfer.',
    icon: 'CheckCircle',
  },
]

export const stats = [
  { value: '6+', label: 'Projects Delivered' },
  { value: '5', label: 'Happy Clients' },
  { value: '24/7', label: 'Always Available' },
  { value: '₹500', label: 'Starting Price' },
]

export const testimonials = [
  {
    quote: 'LumineerCo built our entire e-commerce platform — product catalog, cart, UPI payments — in just 4 days. The quality exceeded our expectations.',
    author: 'FreshBite Foods',
    role: 'E-Commerce Client',
  },
  {
    quote: 'Got a professional ATS-friendly resume designed in under 24 hours. Clean, modern, and it actually got me interview calls.',
    author: 'Rahul Kumar',
    role: 'Software Engineer',
  },
  {
    quote: 'The blog content is well-researched, SEO-optimized, and ready to publish. Great value for money.',
    author: 'TechStartup Media',
    role: 'Content Marketing Client',
  },
]

export const navLinks = [
  { href: '#services', label: 'Services' },
  { href: '#process', label: 'Process' },
  { href: '#testimonials', label: 'Reviews' },
  { href: '#contact', label: 'Contact' },
]