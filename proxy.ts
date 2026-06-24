import { NextRequest, NextResponse } from "next/server"

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const search = request.nextUrl.search

  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".") ||
    pathname.startsWith("/favicon")
  ) {
    return NextResponse.next()
  }

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("x-pathname", pathname)

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  })
  response.headers.set("x-pathname", pathname)

  const locales = ["bg"]
  const pathnameHasLocale = locales.some((locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`)

  if (pathnameHasLocale) {
    return response
  }

  const acceptLanguage = request.headers.get("accept-language")
  let shouldUseBulgarian = Boolean(acceptLanguage?.includes("bg"))

  const languageCookie = request.cookies.get("preferred-language")
  if (languageCookie?.value === "bg") {
    shouldUseBulgarian = true
  } else if (languageCookie?.value === "en") {
    shouldUseBulgarian = false
  }

  if (pathname === "/" && shouldUseBulgarian) {
    const redirectResponse = NextResponse.redirect(new URL(`/bg${search}`, request.url))
    redirectResponse.headers.set("x-pathname", "/bg")
    return redirectResponse
  }

  return response
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
