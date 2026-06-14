import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_PATHS = ['/auth/login', '/auth/register']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('access_token')?.value

  // Allow public paths
  if (PUBLIC_PATHS.some(p => pathname.startsWith(p))) {
    // If already logged in, redirect to dashboard
    if (token) return NextResponse.redirect(new URL('/dashboard', request.url))
    return NextResponse.next()
  }

  // Protect all /dashboard routes
  if (pathname.startsWith('/dashboard')) {
    if (!token) return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*'],
}
