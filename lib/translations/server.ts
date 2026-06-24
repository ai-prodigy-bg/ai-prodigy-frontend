import { cookies, headers } from 'next/headers'
import en from './en.json'
import bg from './bg.json'

type Locale = 'en' | 'bg'
type TranslationKey = string
type TranslationValue = string | readonly TranslationValue[] | { readonly [key: string]: TranslationValue }

const translations = {
  en,
  bg,
} as const

function isTranslationRecord(value: unknown): value is Record<string, TranslationValue> {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value))
}

function getTranslation(locale: Locale, key: TranslationKey): string {
  const keys = key.split('.')
  let current: unknown = translations[locale]

  for (const k of keys) {
    if (isTranslationRecord(current) && k in current) {
      current = current[k]
    } else {
      // Fallback to English
      current = translations.en
      for (const fallbackKey of keys) {
        if (isTranslationRecord(current) && fallbackKey in current) {
          current = current[fallbackKey]
        } else {
          return key // Return the key itself if no translation is found
        }
      }
    }
  }

  return typeof current === 'string' ? current : key
}

function getTranslationRaw(locale: Locale, key: TranslationKey): unknown {
  const keys = key.split('.')
  let current: unknown = translations[locale]

  for (const k of keys) {
    if (isTranslationRecord(current) && k in current) {
      current = current[k]
    } else {
      // Fallback to English
      current = translations.en
      for (const fallbackKey of keys) {
        if (isTranslationRecord(current) && fallbackKey in current) {
          current = current[fallbackKey]
        } else {
          return null
        }
      }
    }
  }

  return current
}

export async function getServerLocale(): Promise<Locale> {
  const headersList = await headers()

  const pathnameHeader = headersList.get('x-pathname')
  if (pathnameHeader) {
    return pathnameHeader === '/bg' || pathnameHeader.startsWith('/bg/') ? 'bg' : 'en'
  }

  const referer = headersList.get('referer') || ''
  if (referer.includes('/bg')) {
    return 'bg'
  }

  const cookieStore = await cookies()

  // Check language preference cookie
  const languageCookie = cookieStore.get('preferred-language')
  if (languageCookie?.value === 'bg') {
    return 'bg'
  }
  
  // Check Accept-Language header
  const acceptLanguage = headersList.get('accept-language')
  if (acceptLanguage?.includes('bg')) {
    return 'bg'
  }
  
  return 'en'
}

export type TranslationFunction = (key: TranslationKey) => string

export async function getServerTranslations() {
  const locale = await getServerLocale()
  
  return {
    locale,
    t: (key: TranslationKey): string => {
      return getTranslation(locale, key)
    },
    tArray: (key: TranslationKey): string[] => {
      const result = getTranslationRaw(locale, key)
      return Array.isArray(result) ? result : []
    }
  }
}

export type { Locale, TranslationKey }
