"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const languages = [
  {
    code: 'en',
    name: 'English',
    flag: '🇺🇸',
    shortName: 'EN'
  },
  {
    code: 'bg', 
    name: 'Български',
    flag: '🇧🇬',
    shortName: 'BG'
  }
]

function getCurrentLocale(): string {
  if (typeof window === 'undefined') return 'en'
  const pathname = window.location.pathname
  return pathname.startsWith('/bg') ? 'bg' : 'en'
}

export default function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentLocale, setCurrentLocale] = useState('en')

  useEffect(() => {
    setCurrentLocale(getCurrentLocale())
  }, [])

  const currentLanguage = languages.find(lang => lang.code === currentLocale) || languages[0]

  const switchLanguage = (locale: string) => {
    // Set language preference cookie
    document.cookie = `preferred-language=${locale}; path=/; max-age=31536000; SameSite=Lax`
    
    const currentPath = window.location.pathname
    const currentSearch = window.location.search
    
    let newPath = currentPath
    
    // Remove existing locale prefix
    if (currentPath.startsWith('/bg')) {
      newPath = currentPath.substring(3) || '/'
    }
    
    // Add new locale prefix if not English
    if (locale === 'bg') {
      newPath = '/bg' + newPath
    }
    
    // Navigate to new path
    window.location.href = newPath + currentSearch
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50 hover:bg-card/80 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        data-magnetic
      >
        <span className="text-lg">{currentLanguage.flag}</span>
        <span className="font-medium text-sm">{currentLanguage.shortName}</span>
        <motion.svg
          className="w-4 h-4 text-muted-foreground"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </motion.svg>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute top-full right-0 mt-2 min-w-[140px] bg-card/95 backdrop-blur-md border border-border/50 rounded-xl shadow-lg z-50 overflow-hidden"
            >
              {languages.map((language) => (
                <motion.button
                  key={language.code}
                  onClick={() => switchLanguage(language.code)}
                  className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-primary/10 transition-colors ${
                    currentLocale === language.code ? 'bg-primary/5 text-primary' : 'text-foreground'
                  }`}
                  whileHover={{ x: 4 }}
                  disabled={currentLocale === language.code}
                >
                  <span className="text-lg">{language.flag}</span>
                  <div className="text-left">
                    <div className="font-medium text-sm">{language.name}</div>
                  </div>
                  {currentLocale === language.code && (
                    <motion.div
                      className="ml-auto w-2 h-2 bg-primary rounded-full"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1 }}
                    />
                  )}
                </motion.button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}