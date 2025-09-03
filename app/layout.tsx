import type React from "react"
import type { Metadata } from "next"
import { Space_Grotesk } from "next/font/google"
import { DM_Sans } from "next/font/google"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Suspense } from "react"
import LanguageDetector from "../components/LanguageDetector"

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
}

export const metadata: Metadata = {
  title: "Prodigy Labs - Premium Digital Solutions",
  description:
    "Bold, innovative apps, websites, and digital services. We build cutting-edge solutions that push boundaries.",
  generator: "v0.app",
  keywords: ["web development", "app development", "digital services", "prodigy labs"],
  authors: [{ name: "Prodigy Labs" }],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="alternate" hrefLang="en" href="https://localhost:3000/" />
        <link rel="alternate" hrefLang="bg" href="https://localhost:3000/bg" />
        <link rel="alternate" hrefLang="x-default" href="https://localhost:3000/" />
      </head>
      <body className={`font-sans antialiased ${spaceGrotesk.variable} ${dmSans.variable} ${GeistMono.variable}`}>
        <LanguageDetector />
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
