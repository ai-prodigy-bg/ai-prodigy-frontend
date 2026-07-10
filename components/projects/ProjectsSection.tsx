"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { useTranslation } from "../../lib/translations"
import ProjectCard from "./ProjectCard"

export default function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })
  const { t } = useTranslation()

  const digitalAssets = [
    {
      title: t("projects.portfolio.mrimot.name"),
      description: t("projects.portfolio.mrimot.description"),
      category: t("projects.portfolio.mrimot.category"),
      image: "/images/projects/mrimot-mobile-app.png",
      status: t("projects.noLinkYet"),
      alt: "Mister Imot mobile application preview",
    },
    {
      title: t("projects.portfolio.batvesko.name"),
      description: t("projects.portfolio.batvesko.description"),
      category: t("projects.portfolio.batvesko.category"),
      image: "/images/projects/bat-vesko-mobile.png",
      status: t("projects.comingSoon"),
      alt: "Bat Vesko mobile application preview",
    },
  ]

  const clientSuccessStories = [
    {
      title: t("projects.portfolio.born2dance.name"),
      description: t("projects.portfolio.born2dance.description"),
      category: t("projects.portfolio.born2dance.category"),
      image: "/images/projects/born2dance-website.png",
      status: t("projects.noLinkYet"),
      alt: "Born2Dance Studio website preview",
    },
    {
      title: t("projects.portfolio.teramedbio.name"),
      description: t("projects.portfolio.teramedbio.description"),
      category: t("projects.portfolio.teramedbio.category"),
      image: "/prodigy corp/88shots_so.png",
      url: "https://teramedbio.com/",
      alt: "teramedbio.com showcase on prodigy corp website",
    },
    {
      title: t("projects.portfolio.elichobanova.name"),
      description: t("projects.portfolio.elichobanova.description"),
      category: t("projects.portfolio.elichobanova.category"),
      image: "/prodigy%20corp/projects/elichobanova.com-showcase.png",
      url: "https://elichobanova.com/",
      alt: "elichobanova.com showcase on prodigy corp website",
    },
  ]

  return (
    <section ref={sectionRef} id="projects" className="relative min-h-screen bg-black px-6 py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-[length:24px_24px] opacity-[0.035]" />

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
          className="mx-auto mb-20 max-w-3xl text-center"
        >
          <h2 className="mb-8 text-[clamp(34px,7vw,72px)] font-normal leading-[1.08] tracking-[-0.03em] text-white">
            {t("projects.title")}
          </h2>
          <p className="mx-auto max-w-xl text-[15px] leading-relaxed text-white/45 sm:text-[17px]">
            {t("projects.subtitle")}
          </p>
        </motion.div>

        <div className="mb-20">
          <h3 className="mb-6 border-t border-white/10 pt-5 text-[14px] uppercase tracking-[0.2em] text-white/40">
            {t("projects.digitalAssets")}
          </h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {digitalAssets.map((project, index) => (
              <ProjectCard key={project.title} {...project} index={index} />
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-6 border-t border-white/10 pt-5 text-[14px] uppercase tracking-[0.2em] text-white/40">
            {t("projects.clientSuccessStories")}
          </h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {clientSuccessStories.map((project, index) => (
              <ProjectCard key={project.title} {...project} index={index + digitalAssets.length} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
