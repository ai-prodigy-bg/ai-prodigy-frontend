import type React from "react"
import type { Metadata } from "next"
import { Space_Grotesk } from "next/font/google"
import { DM_Sans } from "next/font/google"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Suspense } from "react"
import LanguageDetector from "../components/LanguageDetector"
import { getBaseUrl, getAlternateUrls } from "../lib/utils/seo"
import { headers } from "next/headers"
import { getLCPImageUrl } from "../lib/utils/imagekit"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
  weight: ["400", "500", "600", "700"],
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
  weight: ["400", "500", "600"],
})

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

const baseUrl = getBaseUrl()
const alternateUrls = getAlternateUrls()

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Prodigy Corp - Premium Digital Solutions | AI-Powered Development",
    template: "%s | Prodigy Corp"
  },
  description:
    "Premium digital products powered by AI. We build faster, smarter, and more cost-effectively. Mobile apps, web applications, websites, and digital services. Based in Plovdiv, Bulgaria.",
  keywords: [
    "web development",
    "app development", 
    "digital services",
    "AI development",
    "mobile apps",
    "web applications",
    "e-commerce",
    "digital transformation",
    "Prodigy Corp",
    "Bulgaria",
    "Plovdiv"
  ],
  authors: [{ name: "Prodigy Corp" }],
  creator: "Prodigy Corp",
  publisher: "Prodigy Corp",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/favicon_io/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon_io/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon_io/favicon.ico", sizes: "any" },
    ],
    apple: [
      { url: "/favicon_io/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "android-chrome", url: "/favicon_io/android-chrome-192x192.png", sizes: "192x192" },
      { rel: "android-chrome", url: "/favicon_io/android-chrome-512x512.png", sizes: "512x512" },
    ],
  },
  manifest: "/favicon_io/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: alternateUrls.en,
    siteName: "Prodigy Corp",
    title: "Prodigy Corp - Premium Digital Solutions | AI-Powered Development",
    description: "Premium digital products powered by AI. We build faster, smarter, and more cost-effectively. Mobile apps, web applications, websites, and digital services.",
    images: [
      {
        url: `${baseUrl}/prodigy-corp-logo-nobg.png`,
        width: 1200,
        height: 630,
        alt: "Prodigy Corp - Premium Digital Solutions",
      },
    ],
    alternateLocale: ["bg_BG"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Prodigy Corp - Premium Digital Solutions | AI-Powered Development",
    description: "Premium digital products powered by AI. We build faster, smarter, and more cost-effectively.",
    images: [`${baseUrl}/prodigy-corp-logo-nobg.png`],
    creator: "@prodigycorp", // Update with actual Twitter handle if available
  },
  alternates: {
    canonical: alternateUrls.en,
    languages: {
      "en": alternateUrls.en,
      "bg": alternateUrls.bg,
      "x-default": alternateUrls.xDefault,
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add your verification codes here when available
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
    // bing: "your-bing-verification-code",
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Determine locale from pathname
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || headersList.get('referer') || ''
  const locale = pathname.includes('/bg') ? 'bg' : 'en'
  
  return (
    <html lang={locale} className="dark">
      <head>
        <meta charSet="UTF-8" />
        {/* Preconnect to ImageKit for faster image loading */}
        <link rel="preconnect" href="https://ik.imagekit.io" />
        <link rel="dns-prefetch" href="https://ik.imagekit.io" />
        {/* Preload LCP image for mobile (308px) */}
        <link
          rel="preload"
          as="image"
          href={getLCPImageUrl("/prodigy%20corp/Logo/prodigy-corp-logo-nobg-cut.png", "mobile", 80)}
          fetchPriority="high"
          media="(max-width: 640px)"
        />
        {/* Preload LCP image for desktop (176px) */}
        <link
          rel="preload"
          as="image"
          href={getLCPImageUrl("/prodigy%20corp/Logo/prodigy-corp-logo-nobg-cut.png", "desktop", 80)}
          fetchPriority="high"
          media="(min-width: 641px)"
        />
        {/* Structured Data - Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Prodigy Corp",
              "url": baseUrl,
              "logo": `${baseUrl}/prodigy-corp-logo-nobg.png`,
              "description": "Premium digital products powered by AI. We build faster, smarter, and more cost-effectively.",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Plovdiv",
                "addressCountry": "BG"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+359-899-520-856",
                "contactType": "Customer Service",
                "email": "support@prodigycorp.io",
                "availableLanguage": ["en", "bg"]
              },
              "sameAs": [
                // Add social media URLs when available
                // "https://twitter.com/prodigycorp",
                // "https://www.facebook.com/prodigycorp",
                // "https://www.instagram.com/prodigycorp"
              ]
            })
          }}
        />
        {/* Structured Data - WebSite Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Prodigy Corp",
              "url": baseUrl,
              "alternateName": "Prodigy Corp - Premium Digital Solutions",
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": `${baseUrl}/search?q={search_term_string}`
                },
                "query-input": "required name=search_term_string"
              },
              "inLanguage": ["en", "bg"]
            })
          }}
        />
      </head>
      <body className={`font-sans antialiased ${spaceGrotesk.variable} ${dmSans.variable} ${GeistMono.variable}`}>
        {/* Server-rendered static background fallback - zero JS, instant display */}
        <div className="fixed inset-0 -z-10 bg-[linear-gradient(180deg,#0a0f1e_0%,#1a2a47_100%)]" />
        <LanguageDetector />
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
