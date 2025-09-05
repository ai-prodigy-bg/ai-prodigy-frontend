"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import USFlag from './flags/USFlag'
import BulgarianFlag from './flags/BulgarianFlag'

const languages = [
  {
    code: 'en',
    name: 'English',
    flag: '🇺🇸',
    shortName: 'EN',
    unicodeFlag: '\u{1F1FA}\u{1F1F8}' // Unicode fallback for US flag
  },
  {
    code: 'bg', 
    name: 'Български',
    flag: '🇧🇬',
    shortName: 'BG',
    unicodeFlag: '\u{1F1E7}\u{1F1EC}' // Unicode fallback for Bulgarian flag
  }
]

function getCurrentLocale(): string {
  if (typeof window === 'undefined') return 'en'
  const pathname = window.location.pathname
  return pathname.startsWith('/bg') ? 'bg' : 'en'
}

interface LanguageSwitcherProps {
  isMobile?: boolean
}

export default function LanguageSwitcher({ isMobile = false }: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentLocale, setCurrentLocale] = useState('en')
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  useEffect(() => {
    setCurrentLocale(getCurrentLocale())
    
    // Detect if device supports touch (mobile/tablet indicator)
    const checkTouchDevice = () => {
      return (
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      )
    }
    
    setIsTouchDevice(checkTouchDevice())
  }, [])

  const currentLanguage = languages.find(lang => lang.code === currentLocale) || languages[0]

  // Hybrid flag rendering: SVG for desktop, emoji for mobile
  const renderFlag = (language: typeof languages[0]) => {
    // Use emoji on touch devices (mobile/tablet) where they render well
    if (isTouchDevice) {
      return (
        <span 
          className="text-lg leading-none flex items-center justify-center min-w-[20px]"
          style={{ 
            fontFamily: 'system-ui, -apple-system, "Segoe UI", "Noto Color Emoji", "Apple Color Emoji"',
            textRendering: 'optimizeQuality'
          }}
        >
          {language.flag}
        </span>
      )
    }
    
    // Use SVG flags on desktop for crisp, consistent rendering
    const FlagComponent = language.code === 'en' ? USFlag : BulgarianFlag
    return (
      <div className="flex items-center justify-center min-w-[20px]">
        <FlagComponent size={20} className="rounded-sm" />
      </div>
    )
  }

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
        className={`flex items-center gap-2 px-3 py-2 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50 hover:bg-card/80 transition-colors ${
          isMobile ? 'w-full justify-between' : ''
        }`}
        whileHover={{ scale: isMobile ? 1.01 : 1.05 }}
        whileTap={{ scale: 0.98 }}
        data-magnetic={!isMobile}
      >
        <div className="flex items-center gap-2">
          {renderFlag(currentLanguage)}
          <span className="font-medium text-sm">{currentLanguage.shortName}</span>
          {isMobile && (
            <span className="text-xs text-muted-foreground ml-1">
              {currentLanguage.name}
            </span>
          )}
        </div>
        <motion.svg
          className="w-4 h-4 text-muted-foreground flex-shrink-0"
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
            
            {/* Connection Line (Visual bridge for mobile) */}
            {isMobile && (
              <motion.div
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                exit={{ scaleY: 0 }}
                className="absolute top-full left-1/2 transform -translate-x-1/2 w-0.5 h-2 bg-border/50 z-45"
              />
            )}
            
            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: isMobile ? -5 : -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: isMobile ? -5 : -10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className={`absolute top-full ${
                isMobile ? 'left-0 right-0 mt-2' : 'right-0 mt-3'
              } ${
                isMobile ? 'min-w-full' : 'min-w-[160px]'
              } bg-card/95 backdrop-blur-md border border-border/50 rounded-xl shadow-xl z-50 overflow-hidden`}
              style={{
                boxShadow: `
                  0 10px 25px -5px rgba(0, 0, 0, 0.1),
                  0 8px 10px -6px rgba(0, 0, 0, 0.1),
                  0 0 0 1px rgba(255, 255, 255, 0.05)
                `
              }}
            >
              {/* Arrow pointer for better connection */}
              <div className={`absolute top-0 ${
                isMobile ? 'left-1/2 transform -translate-x-1/2' : 'right-4'
              } w-3 h-3 bg-card/95 border-l border-t border-border/50 transform rotate-45 -translate-y-1.5 z-10`} />
              
              <div className="relative z-20 bg-card/95 rounded-xl">
                {languages.map((language, index) => (
                  <motion.button
                    key={language.code}
                    onClick={() => switchLanguage(language.code)}
                    className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-primary/10 transition-colors ${
                      currentLocale === language.code ? 'bg-primary/5 text-primary' : 'text-foreground'
                    } ${index === 0 ? 'rounded-t-xl' : ''} ${index === languages.length - 1 ? 'rounded-b-xl' : ''}`}
                    whileHover={{ x: isMobile ? 2 : 4 }}
                    disabled={currentLocale === language.code}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {renderFlag(language)}
                    <div className="text-left flex-1">
                      <div className="font-medium text-sm">{language.name}</div>
                      {isMobile && (
                        <div className="text-xs text-muted-foreground">{language.shortName}</div>
                      )}
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
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}