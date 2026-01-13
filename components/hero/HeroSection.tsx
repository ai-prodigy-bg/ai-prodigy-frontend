"use client"

import { motion } from "framer-motion"
import { useTranslation } from "../../lib/translations"
import DrawingSVG from "./DrawingSVG"
import MixedTypographyText from "./MixedTypographyText"

export default function HeroSection() {
  const { t } = useTranslation()

  return (
    <section className="min-h-screen flex items-center justify-center px-4 md:px-6 relative">
      <DrawingSVG />

      <div className="max-w-6xl mx-auto text-center relative">
        <motion.div
          initial={{ clipPath: "inset(0 100% 0 0)" }}
          animate={{ clipPath: "inset(0 0% 0 0)" }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
        >
          <motion.h1
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
            className="font-heading font-bold text-4xl sm:text-5xl md:text-6xl lg:text-8xl xl:text-9xl mb-6 md:mb-8 text-balance"
          >
            {t('hero.title.line1')}<br/>
            <motion.span
              animate={{
                color: ["oklch(0.65 0.25 285)", "oklch(0.7 0.25 340)", "oklch(0.6 0.2 160)", "oklch(0.65 0.25 285)"],
                textShadow: [
                  "0 0 20px oklch(0.65 0.25 285 / 0.5)",
                  "0 0 30px oklch(0.7 0.25 340 / 0.5)",
                  "0 0 25px oklch(0.6 0.2 160 / 0.5)",
                  "0 0 20px oklch(0.65 0.25 285 / 0.5)",
                ],
              }}
              transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              className="text-primary"
            >
              {t('hero.title.line2')}
            </motion.span><br/>
            {t('hero.title.line3')}
          </motion.h1>
        </motion.div>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-lg md:text-xl lg:text-2xl text-muted-foreground mb-8 md:mb-12 max-w-3xl mx-auto text-pretty px-4"
        >
          <MixedTypographyText>
            {t('hero.subtitle')}
          </MixedTypographyText>
        </motion.div>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center px-4"
        >
          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 40px oklch(0.65 0.25 285 / 0.6)",
              y: -5,
            }}
            whileTap={{ scale: 0.95, transition: { type: "spring", stiffness: 400, damping: 10 } }}
            onClick={() => {
              const contactSection = document.getElementById("contact")
              if (contactSection) {
                contactSection.scrollIntoView({ behavior: "smooth" })
              }
            }}
            className="w-full sm:w-auto bg-primary text-primary-foreground px-6 md:px-8 py-3 md:py-4 rounded-xl font-semibold text-base md:text-lg hover:bg-primary/90 transition-all duration-300 animate-glow relative overflow-hidden min-h-[48px]"
            style={{ 
              backgroundColor: 'oklch(0.55 0.25 285)', 
              color: 'oklch(0.98 0 0)' 
            }}
            data-magnetic
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.6 }}
            />
            <span className="relative z-10">{t('hero.ctaStart')}</span>
          </motion.button>

          <motion.button
            whileHover={{
              scale: 1.05,
              borderColor: "oklch(0.65 0.25 285)",
              boxShadow: "0 0 20px oklch(0.65 0.25 285 / 0.3)",
              y: -5,
            }}
            whileTap={{ scale: 0.95, transition: { type: "spring", stiffness: 400, damping: 10 } }}
            onClick={() => {
              const projectsSection = document.getElementById("projects")
              if (projectsSection) {
                projectsSection.scrollIntoView({ behavior: "smooth" })
              }
            }}
            className="w-full sm:w-auto border-2 border-muted text-foreground px-6 md:px-8 py-3 md:py-4 rounded-xl font-semibold text-base md:text-lg hover:border-primary transition-all duration-300 relative overflow-hidden min-h-[48px]"
            data-magnetic
          >
            <motion.div
              className="absolute inset-0 bg-primary/10"
              initial={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
            <span className="relative z-10">{t('hero.ctaPortfolio')}</span>
          </motion.button>
        </motion.div>

        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-primary/30 rounded-full"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + (i % 2) * 40}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 0.8, 0.3],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
