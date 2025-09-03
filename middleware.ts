import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // Get pathname and search params
  const pathname = request.nextUrl.pathname
  const search = request.nextUrl.search

  // Skip middleware for API routes, static files, and Next.js internals
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next()
  }

  // Check if pathname already has a locale
  const locales = ['bg']
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) {
    return NextResponse.next()
  }

  // Get the preferred locale from Accept-Language header
  const acceptLanguage = request.headers.get('accept-language')
  let shouldUseBulgarian = false

  if (acceptLanguage) {
    // Simple language detection - check if Bulgarian is preferred
    shouldUseBulgarian = acceptLanguage.includes('bg')
  }

  // Check if user has a language preference cookie
  const languageCookie = request.cookies.get('preferred-language')
  if (languageCookie && languageCookie.value === 'bg') {
    shouldUseBulgarian = true
  } else if (languageCookie && languageCookie.value === 'en') {
    shouldUseBulgarian = false
  }

  // Only redirect to /bg if Bulgarian is preferred, otherwise serve English at root
  if (pathname === '/' && shouldUseBulgarian) {
    return NextResponse.redirect(new URL(`/bg${search}`, request.url))
  }

  // For English (default), continue to serve from root
  return NextResponse.next()
}

export const config = {
  matcher: [
    // Skip all internal paths (_next, api)
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}