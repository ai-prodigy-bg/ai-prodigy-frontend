'use client'

import { useEffect } from 'react'

export default function LanguageDetector() {
  useEffect(() => {
    // Update the html lang attribute on client side to match current locale
    const pathname = window.location.pathname
    const isbulgarian = pathname.startsWith('/bg')
    document.documentElement.lang = isbulgarian ? 'bg' : 'en'
  }, [])

  return null
}