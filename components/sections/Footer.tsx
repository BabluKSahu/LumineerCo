'use client'

import { cn } from '@/lib/utils'
import { services, navLinks } from '@/lib/utils'
import { Facebook, Twitter, Linkedin, Instagram, Github, Mail, ArrowRight } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    Services: services.map((s) => ({ label: s.title, href: `#${s.id}` })),
    Company: [
      { label: 'About Us', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Blog', href: '/blog' },
      { label: 'Press', href: '/press' },
    ],
    Legal: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Cookie Policy', href: '/cookies' },
    ],
    Contact: [
      { label: 'Email Us', href: 'mailto:hello@lumineerco.com' },
      { label: 'Book a Call', href: '/contact' },
      { label: 'Support', href: '/support' },
    ],
  }

  const socialLinks = [
    { icon: Twitter, href: 'https://twitter.com/lumineerco', label: 'Twitter' },
    { icon: Linkedin, href: 'https://linkedin.com/company/lumineerco', label: 'LinkedIn' },
    { icon: Github, href: 'https://github.com/lumineerco', label: 'GitHub' },
    { icon: Instagram, href: 'https://instagram.com/lumineerco', label: 'Instagram' },
    { icon: Mail, href: 'mailto:hello@lumineerco.com', label: 'Email' },
  ]

  return (
    <footer className="border-t border-gray-800 bg-gray-950/50">
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 md:gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <span className="text-xl font-bold text-amber-400">L</span>
              </div>
              <span className="text-xl font-bold text-white">LumineerCo</span>
            </div>
            <p className="text-gray-400 text-sm mb-6 max-w-xs">
              AI-powered creative studio delivering websites, content, designs, and scripts — fast, affordable, and always on.
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="p-2 rounded-lg bg-gray-900 border border-gray-800 text-gray-400 hover:text-amber-400 hover:border-amber-500/50 transition-all duration-200"
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-white mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-amber-400 text-sm transition-colors flex items-center gap-1"
                    >
                      {link.label}
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © {currentYear} LumineerCo. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <a href="/privacy" className="hover:text-amber-400 transition-colors">Privacy</a>
            <a href="/terms" className="hover:text-amber-400 transition-colors">Terms</a>
            <a href="/cookies" className="hover:text-amber-400 transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  )
}