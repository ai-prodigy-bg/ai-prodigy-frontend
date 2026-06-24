"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useTranslation } from "../../lib/translations"
import LanguageSwitcher from "../LanguageSwitcher"

function SquashHamburger({ open }: { open: boolean }) {
  return (
    <span className="relative block h-[12px] w-[18px] md:h-[12px] md:w-[18px]" aria-hidden="true">
      <motion.span
        className="absolute left-0 top-0 h-[1.5px] w-full rounded-full bg-white"
        animate={open ? { rotate: 45, y: 5.25 } : { rotate: 0, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      />
      <motion.span
        className="absolute left-0 top-[5.25px] h-[1.5px] w-full rounded-full bg-white"
        animate={open ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      />
      <motion.span
        className="absolute bottom-0 left-0 h-[1.5px] w-full rounded-full bg-white"
        animate={open ? { rotate: -45, y: -5.25 } : { rotate: 0, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      />
    </span>
  )
}

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { t } = useTranslation()
  const isCompactViewport = typeof window !== "undefined" && window.innerWidth < 640

  const menuItems = [
    { key: "projects", label: t("navigation.projects") },
    { key: "services", label: t("navigation.services") },
    { key: "about", label: t("navigation.about") },
  ]

  const handleAnchorClick = () => setIsMenuOpen(false)

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.35 }}
      className="fixed left-0 right-0 top-0 z-50 h-20 px-2 pt-3 sm:px-6 sm:pt-4 md:px-8"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-1 sm:gap-2">
        <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
          <motion.a
            href="#hero"
            className="flex h-10 shrink-0 items-center overflow-hidden rounded-[12px] border border-white/10 bg-white/15 px-3 backdrop-blur-md sm:h-12 sm:rounded-[14px] sm:px-4 md:px-5"
            animate={{ width: isMenuOpen ? 0 : "auto", opacity: isMenuOpen ? 0 : 1 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            aria-label="PRODIGY CORP"
          >
            <span className="whitespace-nowrap text-[11px] font-bold text-white sm:text-[14px]">PRODIGY CORP</span>
          </motion.a>

          <motion.div
            className="flex h-10 items-center overflow-hidden rounded-[12px] border border-white/10 bg-white/15 backdrop-blur-md sm:h-12 sm:rounded-[14px]"
            animate={{
              width: isMenuOpen ? (isCompactViewport ? "calc(100vw - 170px)" : 380) : isCompactViewport ? 40 : 48,
            }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
          >
            <button
              type="button"
              onClick={() => setIsMenuOpen((value) => !value)}
              aria-label={isMenuOpen ? t("navigation.mobileMenuClose") : t("navigation.mobileMenuToggle")}
              aria-expanded={isMenuOpen}
              className={`flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-[12px] text-white sm:h-12 sm:w-12 sm:rounded-[14px] ${
                isMenuOpen ? "bg-white/10" : ""
              }`}
            >
              <SquashHamburger open={isMenuOpen} />
            </button>

            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, x: 14 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 14 }}
                  transition={{ duration: 0.24 }}
                  className="flex min-w-0 flex-1 items-center gap-0.5 pl-2 pr-1 min-[360px]:gap-1 min-[360px]:pl-4 sm:flex-none sm:pl-0 sm:pr-2"
                >
                  {menuItems.map((item) => (
                    <a
                      key={item.key}
                      href={`#${item.key}`}
                      onClick={handleAnchorClick}
                      className="whitespace-nowrap rounded-[9px] px-0.5 py-2 text-[9px] font-normal text-white/80 hover:bg-white/10 hover:text-white min-[390px]:px-1 min-[390px]:text-[10px] sm:rounded-[11px] sm:px-3 sm:text-[13px] md:text-[15px]"
                    >
                      {item.label}
                    </a>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <a
            href="#contact"
            className="flex h-10 items-center rounded-[14px] bg-white px-1 text-[10px] font-bold text-black hover:bg-[#e2e2e6] min-[360px]:px-2 min-[360px]:text-[11px] sm:h-12 sm:rounded-full sm:px-5 sm:text-[13px] md:px-6"
          >
            {t("navigation.contact")}
          </a>
          <LanguageSwitcher />
        </div>
      </div>
    </motion.nav>
  )
}
