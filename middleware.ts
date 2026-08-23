import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const adminSecret = request.cookies.get('admin-auth')?.value
  const validSecret = process.env.ADMIN_SECRET

  // Skip auth in development
  if (process.env.NODE_ENV === 'development') {
    return NextResponse.next()
  }

  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!adminSecret || adminSecret !== validSecret) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}