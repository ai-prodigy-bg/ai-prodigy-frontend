"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import USFlag from "./flags/USFlag"
import BulgarianFlag from "./flags/BulgarianFlag"

const languages = [
  { code: "en", name: "English", shortName: "EN" },
  { code: "bg", name: "Български", shortName: "BG" },
]

function getCurrentLocale(): string {
  if (typeof window === "undefined") return "en"
  return window.location.pathname.startsWith("/bg") ? "bg" : "en"
}

interface LanguageSwitcherProps {
  isMobile?: boolean
}

export default function LanguageSwitcher({ isMobile = false }: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentLocale, setCurrentLocale] = useState("en")

  useEffect(() => {
    setCurrentLocale(getCurrentLocale())
  }, [])

  const currentLanguage = languages.find((language) => language.code === currentLocale) || languages[0]

  const switchLanguage = (locale: string) => {
    document.cookie = `preferred-language=${locale}; path=/; max-age=31536000; SameSite=Lax`

    const currentPath = window.location.pathname
    const currentSearch = window.location.search
    let newPath = currentPath.startsWith("/bg") ? currentPath.substring(3) || "/" : currentPath

    if (locale === "bg") {
      newPath = `/bg${newPath}`
    }

    window.location.href = newPath + currentSearch
    setIsOpen(false)
  }

  const renderFlag = (language: (typeof languages)[0]) => {
    const FlagComponent = language.code === "en" ? USFlag : BulgarianFlag
    return (
      <span className="flex min-w-5 items-center justify-center">
        <FlagComponent size={20} className="rounded-sm" />
      </span>
    )
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        className={`flex h-10 cursor-pointer items-center gap-0.5 rounded-[12px] border border-white/10 bg-white/15 px-1 text-white backdrop-blur-md min-[360px]:gap-1 min-[360px]:px-2 sm:h-12 sm:gap-2 sm:rounded-[14px] sm:px-3 ${
          isMobile ? "w-full justify-between" : ""
        }`}
      >
        <span className="flex items-center gap-0.5 min-[360px]:gap-1 sm:gap-2">
          {renderFlag(currentLanguage)}
          <span className="text-[10px] font-bold min-[360px]:text-[11px] sm:text-[13px]">{currentLanguage.shortName}</span>
          {isMobile && <span className="text-xs text-white/45">{currentLanguage.name}</span>}
        </span>
        <motion.svg
          className="h-2.5 w-2.5 text-white/50 min-[360px]:h-3 min-[360px]:w-3 sm:h-4 sm:w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </motion.svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <button className="fixed inset-0 z-40 cursor-default" onClick={() => setIsOpen(false)} aria-label="Close language menu" />
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className={`absolute top-full z-50 mt-2 overflow-hidden rounded-[14px] border border-white/10 bg-black/95 backdrop-blur-md ${
                isMobile ? "left-0 right-0" : "right-0 min-w-[168px]"
              }`}
            >
              {languages.map((language) => (
                <button
                  key={language.code}
                  type="button"
                  onClick={() => switchLanguage(language.code)}
                  disabled={currentLocale === language.code}
                  className={`flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left text-sm disabled:cursor-default ${
                    currentLocale === language.code ? "bg-white/10 text-white" : "text-white/65 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {renderFlag(language)}
                  <span>{language.name}</span>
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
