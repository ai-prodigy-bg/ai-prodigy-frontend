"use client"

import { useRef, useState } from "react"
import { AnimatePresence, motion, useInView } from "framer-motion"
import { useTranslation } from "../../lib/translations"
import ServiceCard from "./ServiceCard"

const SECTION_VIDEO = "/videos/prodigy-neural-atmosphere-loop-v1.mp4"
const SECTION_POSTER = "/images/prodigy/prodigy-neural-atmosphere-v1.webp"

export default function ServicesSection() {
  const [activeService, setActiveService] = useState("Apps")
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })
  const { t, tArray } = useTranslation()

  const services = {
    Apps: [
      {
        title: t("services.apps.mobile.title"),
        description: t("services.apps.mobile.description"),
        features: tArray("services.apps.mobile.features"),
        icon: (
          <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2z" />
          </svg>
        ),
      },
      {
        title: t("services.apps.web.title"),
        description: t("services.apps.web.description"),
        features: tArray("services.apps.web.features"),
        icon: (
          <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H3m9 9a9 9 0 0 1-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 0 1 9-9" />
          </svg>
        ),
      },
      {
        title: t("services.apps.desktop.title"),
        description: t("services.apps.desktop.description"),
        features: tArray("services.apps.desktop.features"),
        icon: (
          <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17 9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z" />
          </svg>
        ),
      },
    ],
    Websites: [
      {
        title: t("services.websites.corporate.title"),
        description: t("services.websites.corporate.description"),
        features: tArray("services.websites.corporate.features"),
        icon: (
          <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />
          </svg>
        ),
      },
      {
        title: t("services.websites.ecommerce.title"),
        description: t("services.websites.ecommerce.description"),
        features: tArray("services.websites.ecommerce.features"),
        icon: (
          <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 0 0-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        ),
      },
      {
        title: t("services.websites.portfolio.title"),
        description: t("services.websites.portfolio.description"),
        features: tArray("services.websites.portfolio.features"),
        icon: (
          <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 0 1 2.828 0L16 16m-2-2 1.586-1.586a2 2 0 0 1 2.828 0L20 14m-6-6h.01" />
          </svg>
        ),
      },
    ],
    Services: [
      {
        title: t("services.consulting.strategy.title"),
        description: t("services.consulting.strategy.description"),
        features: tArray("services.consulting.strategy.features"),
        icon: (
          <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2Zm0 0V9a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v10m-6 0a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2" />
          </svg>
        ),
      },
      {
        title: t("services.consulting.design.title"),
        description: t("services.consulting.design.description"),
        features: tArray("services.consulting.design.features"),
        icon: (
          <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 0 1-4-4V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v12a4 4 0 0 1-4 4Zm0 0h12a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-2.343" />
          </svg>
        ),
      },
      {
        title: t("services.consulting.technical.title"),
        description: t("services.consulting.technical.description"),
        features: tArray("services.consulting.technical.features"),
        icon: (
          <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065Z" />
          </svg>
        ),
      },
    ],
  }

  const categoryLabels: Record<keyof typeof services, string> = {
    Apps: t("services.categories.apps"),
    Websites: t("services.categories.websites"),
    Services: t("services.categories.consulting"),
  }

  return (
    <section ref={sectionRef} id="services" className="relative min-h-screen overflow-hidden bg-black px-6 py-32">
      <video
        src={SECTION_VIDEO}
        poster={SECTION_POSTER}
        className="absolute inset-0 h-full w-full object-cover opacity-45"
        muted
        loop
        autoPlay
        playsInline
        preload="metadata"
        aria-hidden="true"
      />
      <div className="absolute inset-x-0 top-0 z-10 h-[180px] bg-[linear-gradient(180deg,#010103_0%,transparent_100%)]" />
      <div className="absolute inset-0 bg-black/55" />

      <div className="relative mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
          className="mb-16 grid gap-8 md:grid-cols-[0.9fr_1fr] md:items-end"
        >
          <div>
            <h2 className="text-[clamp(34px,7vw,72px)] font-normal leading-[1.05] tracking-[-0.03em] text-white">
              {t("services.title")}
            </h2>
          </div>
          <p className="max-w-2xl border-l border-white/10 pl-5 text-[15px] leading-relaxed text-white/50">
            {t("services.subtitle")}
          </p>
        </motion.div>

        <div className="mb-14 flex flex-wrap gap-2">
          {(Object.keys(services) as Array<keyof typeof services>).map((service) => (
            <button
              key={service}
              type="button"
              onClick={() => setActiveService(service)}
              className={`h-11 rounded-full px-5 text-[13px] font-bold ${
                activeService === service ? "bg-white text-black" : "border border-white/10 bg-white/10 text-white/65 hover:bg-white/15 hover:text-white"
              }`}
            >
              {categoryLabels[service]}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeService}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3"
          >
            {services[activeService as keyof typeof services].map((service, index) => (
              <ServiceCard key={`${activeService}-${service.title}`} {...service} index={index} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
