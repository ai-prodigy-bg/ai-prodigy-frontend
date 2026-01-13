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
      title: t('projects.portfolio.mrimot.name'),
      description: t('projects.portfolio.mrimot.description'),
      category: t('projects.portfolio.mrimot.category'),
      image: "/prodigy%20corp/projects/mrimot.com-showcase.png",
      url: "https://www.mrimot.com/",
      alt: "mrimot.com showcase on prodigy corp website",
    },
  ]

  const clientSuccessStories = [
    {
      title: t('projects.portfolio.teramedbio.name'),
      description: t('projects.portfolio.teramedbio.description'),
      category: t('projects.portfolio.teramedbio.category'),
      image: "/prodigy corp/88shots_so.png",
      url: "https://teramedbio.com/",
      alt: "teramedbio.com showcase on prodigy corp website",
    },
    {
      title: t('projects.portfolio.elichobanova.name'),
      description: t('projects.portfolio.elichobanova.description'),
      category: t('projects.portfolio.elichobanova.category'),
      image: "/prodigy%20corp/projects/elichobanova.com-showcase.png",
      url: "https://elichobanova.com/",
      alt: "elichobanova.com showcase on prodigy corp website",
    },
  ]

  return (
    <section ref={sectionRef} id="projects" className="min-h-screen py-16 md:py-20 px-4 md:px-6 relative">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-16"
        >
          <motion.h2
            className="font-heading font-bold text-4xl md:text-5xl lg:text-7xl mb-4 md:mb-6 text-balance"
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
            {t('projects.title')}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty px-4"
          >
            {t('projects.subtitle')}
          </motion.p>
        </motion.div>

        {/* Our Digital Assets Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-20"
        >
          <h3 className="font-heading font-bold text-2xl md:text-3xl mb-8 text-center">
            {t('projects.digitalAssets')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
            {digitalAssets.map((project, index) => (
              <ProjectCard
                key={project.title}
                title={project.title}
                description={project.description}
                category={project.category}
                image={project.image}
                index={index}
                url={project.url}
                alt={project.alt}
              />
            ))}
          </div>
        </motion.div>

        {/* Client Success Stories Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <h3 className="font-heading font-bold text-2xl md:text-3xl mb-8 text-center">
            {t('projects.clientSuccessStories')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
            {clientSuccessStories.map((project, index) => (
              <ProjectCard
                key={project.title}
                title={project.title}
                description={project.description}
                category={project.category}
                image={project.image}
                index={index + digitalAssets.length}
                url={project.url}
                alt={project.alt}
              />
            ))}
          </div>
        </motion.div>

      </div>

      {/* Floating elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/20 rounded-full"
            style={{
              left: `${10 + i * 12}%`,
              top: `${20 + (i % 3) * 30}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 4 + i * 0.3,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.4,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </section>
  )
}
