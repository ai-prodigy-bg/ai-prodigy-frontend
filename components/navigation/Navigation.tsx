"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslation } from "../../lib/translations"
import LanguageSwitcher from "../LanguageSwitcher"
import { buildImageKitUrl } from "../../lib/utils/imagekit"

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { t } = useTranslation()

  const menuItems = [
    { key: 'projects', label: t('navigation.projects') },
    { key: 'services', label: t('navigation.services') },
    { key: 'about', label: t('navigation.about') },
    { key: 'contact', label: t('navigation.contact') }
  ]

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 p-4 md:p-6"
    >
      <div className="flex justify-between items-center max-w-7xl mx-auto px-6 py-4">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center"
          data-magnetic
        >
          <img
            src={buildImageKitUrl("/prodigy%20corp/Logo/prodigy-corp-text-logo-nobg-cut.png", [
              "w-326",
              "q-90",
              "f-auto",
              "dpr-2",
              "cm-maintain_ratio",
              "bo-2_FFFFFF",
            ])}
            alt="Prodigy Corp"
            className="h-8 md:h-10 w-auto"
            style={{
              filter:
                // White edge, then brand-purple outer glow layers
                "drop-shadow(0 0 2px rgba(255,255,255,0.5)) " +
                "drop-shadow(0 0 8px rgba(139,92,246,0.45)) " +
                "drop-shadow(0 0 18px rgba(139,92,246,0.25))",
            }}
          />
        </motion.div>

        <div className="hidden md:flex items-center gap-4 lg:gap-8">
          {menuItems.map((item, index) => (
            <motion.a
              key={item.key}
              href={`#${item.key}`}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 + 0.5 }}
              whileHover={{
                scale: 1.1,
                color: "oklch(0.65 0.25 285)",
                transition: { type: "spring", stiffness: 400, damping: 10 },
              }}
              className="text-sm lg:text-base text-foreground hover:text-primary transition-colors cursor-pointer relative font-medium drop-shadow-sm"
              data-magnetic
            >
              {item.label}
              <motion.div
                className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary origin-left"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.a>
          ))}
          
          <LanguageSwitcher />
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-foreground p-2 drop-shadow-sm"
          data-magnetic
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </motion.button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden border-t border-border/20 bg-background/95 backdrop-blur-md rounded-b-2xl"
          >
            <div className="px-6 py-4 space-y-4">
              {menuItems.map((item, index) => (
                <motion.a
                  key={item.key}
                  href={`#${item.key}`}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={(e) => {
                    setIsMobileMenuOpen(false)
                    // Small delay to ensure menu closes before scrolling
                    setTimeout(() => {
                      const element = document.querySelector(`#${item.key}`)
                      if (element) {
                        element.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        })
                      }
                    }, 300)
                  }}
                  className="block text-foreground hover:text-primary transition-colors py-2 font-medium"
                >
                  {item.label}
                </motion.a>
              ))}
              <div className="pt-4 border-t border-border/20">
                <LanguageSwitcher isMobile={true} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
