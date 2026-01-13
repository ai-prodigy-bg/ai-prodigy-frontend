import { cookies, headers } from 'next/headers'
import { getTranslation, type Locale, type TranslationKey } from './index'

export async function getServerLocale(): Promise<Locale> {
  const headersList = await headers()
  const cookieStore = await cookies()
  
  // Check pathname from headers
  const pathname = headersList.get('x-pathname') || headersList.get('referer') || ''
  
  if (pathname.includes('/bg')) {
    return 'bg'
  }
  
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

function getTranslationRaw(locale: Locale, key: TranslationKey): any {
  const { translations } = require('./index')
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
