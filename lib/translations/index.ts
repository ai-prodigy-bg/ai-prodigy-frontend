'use client'

import { useEffect, useState } from 'react'
import en from './en.json'
import bg from './bg.json'

type TranslationKey = string
type Locale = 'en' | 'bg'

const translations = {
  en,
  bg,
} as const

export function getTranslation(locale: Locale, key: TranslationKey): string {
  const keys = key.split('.')
  let current: any = translations[locale]

  for (const k of keys) {
    if (current && typeof current === 'object' && k in current) {
      current = current[k]
    } else {
      console.warn(`Translation key "${key}" not found for locale "${locale}"`)
      // Fallback to English
      current = translations.en
      for (const fallbackKey of keys) {
        if (current && typeof current === 'object' && fallbackKey in current) {
          current = current[fallbackKey]
        } else {
          return key // Return the key itself if no translation is found
        }
      }
    }
  }

  return typeof current === 'string' ? current : key
}

function getLocaleFromPath(): Locale {
  if (typeof window === 'undefined') return 'en'
  
  const pathname = window.location.pathname
  if (pathname.startsWith('/bg')) {
    return 'bg'
  }
  return 'en'
}

export function useTranslation() {
  const [locale, setLocale] = useState<Locale>('en')

  useEffect(() => {
    setLocale(getLocaleFromPath())
    
    // Listen for route changes
    const handleLocationChange = () => {
      setLocale(getLocaleFromPath())
    }
    
    window.addEventListener('popstate', handleLocationChange)
    return () => window.removeEventListener('popstate', handleLocationChange)
  }, [])

  const t = (key: TranslationKey): string => {
    return getTranslation(locale, key)
  }

  const tArray = (key: TranslationKey): string[] => {
    const result = getTranslationRaw(locale, key)
    return Array.isArray(result) ? result : []
  }

  return { t, tArray, locale }
}

function getTranslationRaw(locale: Locale, key: TranslationKey): any {
  const keys = key.split('.')
  let current: any = translations[locale]

  for (const k of keys) {
    if (current && typeof current === 'object' && k in current) {
      current = current[k]
    } else {
      // Fallback to English
      current = translations.en
      for (const fallbackKey of keys) {
        if (current && typeof current === 'object' && fallbackKey in current) {
          current = current[fallbackKey]
        } else {
          return null
        }
      }
    }
  }

  return current
}

export { translations }
export type { Locale, TranslationKey }