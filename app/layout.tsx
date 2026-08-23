import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: {
    default: 'LumineerCo — AI-Powered Creative Studio',
    template: '%s | LumineerCo',
  },
  description: 'LumineerCo delivers websites, content, designs, and scripts — fast, affordable, and always on. AI-powered creative studio with 10 specialized agents.',
  keywords: ['AI development', 'website development', 'content creation', 'design services', 'automation', 'SEO', 'digital products', 'social media marketing', 'legal documents', 'cybersecurity', 'sales copy'],
  authors: [{ name: 'LumineerCo' }],
  creator: 'LumineerCo',
  publisher: 'LumineerCo',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://lumineerco.com',
    siteName: 'LumineerCo',
    title: 'LumineerCo — AI-Powered Creative Studio',
    description: 'LumineerCo delivers websites, content, designs, and scripts — fast, affordable, and always on.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'LumineerCo - AI-Powered Creative Studio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LumineerCo — AI-Powered Creative Studio',
    description: 'LumineerCo delivers websites, content, designs, and scripts — fast, affordable, and always on.',
    images: ['/og-image.png'],
    creator: '@lumineerco',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#09090b' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} scroll-smooth`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-black text-white antialiased min-h-screen">
        {children}
      </body>
    </html>
  )
}