import { NextResponse } from 'next/server'

export async function GET() {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://lumineerco.com'

  const robots = `User-agent: *
Allow: /

Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /telegram/

Sitemap: ${baseUrl}/sitemap.xml
`

  return new NextResponse(robots, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}