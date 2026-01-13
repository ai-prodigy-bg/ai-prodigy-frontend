/**
 * SEO utility functions
 */

export function getBaseUrl(): string {
  // In production, use the actual domain
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL
  }
  
  // For Vercel deployments
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  
  // Fallback for local development
  return process.env.NODE_ENV === 'production' 
    ? 'https://prodigycorp.io' // Replace with your actual domain
    : 'http://localhost:3000'
}

export function getCanonicalUrl(path: string = '/'): string {
  const baseUrl = getBaseUrl()
  const cleanPath = path === '/' ? '' : path
  return `${baseUrl}${cleanPath}`
}

export function getAlternateUrls() {
  const baseUrl = getBaseUrl()
  return {
    en: `${baseUrl}/`,
    bg: `${baseUrl}/bg`,
    xDefault: `${baseUrl}/`,
  }
}
