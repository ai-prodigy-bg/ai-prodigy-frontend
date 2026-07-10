"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { useTranslation } from "../../lib/translations"
import StatCounter from "./StatCounter"

const BRAND_VIDEO = "/videos/prodigy-cat-back-metrics-loop-v1.mp4"
const BRAND_POSTER = "/images/prodigy/prodigy-cat-back-metrics-v1.webp"

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })
  const { t, tArray } = useTranslation()

  const storyParagraphs = tArray("about.story.paragraphs")
  const stats = [
    { value: 15, label: t("about.stats.projects"), suffix: "+" },
    { value: 12, label: t("about.stats.clients"), suffix: "+" },
    { value: 2, label: t("about.stats.experience"), suffix: "+" },
    { value: 100, label: t("about.stats.successRate"), suffix: "%" },
  ]

  return (
    <section ref={sectionRef} id="about" className="relative min-h-screen overflow-hidden bg-black px-6 py-32">
      <video
        src={BRAND_VIDEO}
        poster={BRAND_POSTER}
        className="absolute inset-0 h-full w-full object-cover opacity-35"
        style={{ objectPosition: "62% center" }}
        muted
        loop
        autoPlay
        playsInline
        preload="metadata"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.86)_0%,rgba(0,0,0,0.68)_52%,rgba(0,0,0,0.28)_100%)]" />
      <div className="absolute inset-x-0 top-0 h-[180px] bg-[linear-gradient(180deg,#000_0%,transparent_100%)]" />

      <div className="relative mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
          className="mb-20 grid gap-8 md:grid-cols-[0.9fr_1fr] md:items-start"
        >
          <div>
            <h2 className="text-[clamp(34px,7vw,72px)] font-normal leading-[1.05] tracking-[-0.03em] text-white">
              {t("about.title")}
            </h2>
          </div>
          <p className="max-w-2xl border-l border-white/10 pl-5 text-[15px] leading-relaxed text-white/50">
            {t("about.subtitle")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.15 }}
          className="mb-24 grid grid-cols-1 gap-12 lg:grid-cols-[0.95fr_1.05fr]"
        >
          <div>
            <h3 className="mb-8 text-[clamp(28px,5vw,56px)] font-normal leading-[1.15] tracking-[-0.02em] text-white">
              {t("about.story.title")}
            </h3>
            <div className="space-y-6 text-[15px] leading-relaxed text-white/48 sm:text-[17px]">
              {storyParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-16 md:grid-cols-4 md:gap-8">
          {stats.map((stat, index) => (
            <StatCounter key={stat.label} value={stat.value} label={stat.label} suffix={stat.suffix} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
