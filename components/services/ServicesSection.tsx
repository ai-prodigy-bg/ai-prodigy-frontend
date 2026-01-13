"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslation } from "../../lib/translations"
import ServiceCard from "./ServiceCard"

export default function ServicesSection() {
  const [activeService, setActiveService] = useState("Apps")
  const [isInView, setIsInView] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  const { t, tArray } = useTranslation()

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setIsInView(entry.isIntersecting), { threshold: 0.3 })
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const services = {
    Apps: [
      {
        title: t('services.apps.mobile.title'),
        description: t('services.apps.mobile.description'),
        features: tArray('services.apps.mobile.features'),
        icon: (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
        ),
      },
      {
        title: t('services.apps.web.title'),
        description: t('services.apps.web.description'),
        features: tArray('services.apps.web.features'),
        icon: (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
            />
          </svg>
        ),
      },
      {
        title: t('services.apps.desktop.title'),
        description: t('services.apps.desktop.description'),
        features: tArray('services.apps.desktop.features'),
        icon: (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        ),
      },
    ],
    Websites: [
      {
        title: t('services.websites.corporate.title'),
        description: t('services.websites.corporate.description'),
        features: tArray('services.websites.corporate.features'),
        icon: (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
        ),
      },
      {
        title: t('services.websites.ecommerce.title'),
        description: t('services.websites.ecommerce.description'),
        features: tArray('services.websites.ecommerce.features'),
        icon: (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
        ),
      },
      {
        title: t('services.websites.portfolio.title'),
        description: t('services.websites.portfolio.description'),
        features: tArray('services.websites.portfolio.features'),
        icon: (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        ),
      },
    ],
    Services: [
      {
        title: t('services.consulting.strategy.title'),
        description: t('services.consulting.strategy.description'),
        features: tArray('services.consulting.strategy.features'),
        icon: (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        ),
      },
      {
        title: t('services.consulting.design.title'),
        description: t('services.consulting.design.description'),
        features: tArray('services.consulting.design.features'),
        icon: (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h4a2 2 0 002-2V9a2 2 0 00-2-2H7a2 2 0 00-2 2v6a2 2 0 002 2z"
            />
          </svg>
        ),
      },
      {
        title: t('services.consulting.technical.title'),
        description: t('services.consulting.technical.description'),
        features: tArray('services.consulting.technical.features'),
        icon: (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        ),
      },
    ],
  }

  return (
    <section ref={sectionRef} id="services" className="min-h-screen py-20 px-6 relative">
      {/* SVG Filter Definition */}
      <svg className="absolute inset-0 pointer-events-none opacity-0">
        <defs>
          <filter id="gooey">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
              result="gooey"
            />
            <feBlend in="SourceGraphic" in2="gooey" />
          </filter>
        </defs>
      </svg>

      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.h2
            className="font-heading font-bold text-4xl md:text-5xl lg:text-7xl mb-6 text-balance"
            animate={
              isInView
                ? {
                    backgroundImage: [
                      "linear-gradient(45deg, oklch(0.98 0 0), oklch(0.65 0.25 285))",
                      "linear-gradient(45deg, oklch(0.65 0.25 285), oklch(0.7 0.25 340))",
                      "linear-gradient(45deg, oklch(0.7 0.25 340), oklch(0.6 0.2 160))",
                      "linear-gradient(45deg, oklch(0.6 0.2 160), oklch(0.65 0.25 285))",
                    ],
                  }
                : {}
            }
            transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
            style={{
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            {t('services.title')}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty"
          >
            {t('services.subtitle')}
          </motion.p>
        </motion.div>

        {/* Morphing Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex justify-center mb-16"
        >
          <div className="relative bg-card/30 backdrop-blur-sm border border-border/50 rounded-2xl p-2">
            <motion.div
              className="absolute top-2 bottom-2 bg-primary/20 rounded-xl"
              animate={{
                left: activeService === "Apps" ? "8px" : activeService === "Websites" ? "33.33%" : "66.66%",
                width: "calc(33.33% - 8px)",
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                duration: 0.4,
              }}
              style={{ filter: "url(#gooey)" }}
            />

            <div className="relative z-10 flex">
              {Object.keys(services).map((service) => (
                <motion.button
                  key={service}
                  onClick={() => setActiveService(service)}
                  className={`px-6 md:px-8 py-3 md:py-4 rounded-xl font-semibold text-sm md:text-base transition-colors relative min-w-[100px] md:min-w-[120px] ${
                    activeService === service ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  data-magnetic
                >
                  {service}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Services Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeService}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          >
            {services[activeService as keyof typeof services].map((service, index) => (
              <ServiceCard key={`${activeService}-${index}`} {...service} index={index} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Floating elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => {
            const positions = [
              { left: 25, top: 20 },
              { left: 75, top: 30 },
              { left: 45, top: 60 },
              { left: 85, top: 80 },
              { left: 15, top: 70 },
              { left: 65, top: 15 }
            ];
            const pos = positions[i] || { left: 50, top: 50 };
            
            return (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-primary/20 rounded-full"
                style={{
                  left: `${pos.left}%`,
                  top: `${pos.top}%`,
                  filter: "url(#gooey)",
                }}
                animate={{
                  y: [0, -20, 0],
                  x: [0, (i % 2 === 0 ? 10 : -10), 0],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 3 + (i * 0.3),
                  repeat: Number.POSITIVE_INFINITY,
                  delay: i * 0.4,
                }}
              />
            );
          })}
        </div>
      </div>
    </section>
  )
}
