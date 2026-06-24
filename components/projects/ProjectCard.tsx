"use client"

import { motion } from "framer-motion"
import { buildImageKitUrl, getProjectImageSrcSet, getProjectImageTransformations } from "../../lib/utils/imagekit"
import { useTranslation } from "../../lib/translations"

interface ProjectCardProps {
  title: string
  description: string
  category: string
  image: string
  index: number
  url?: string
  alt: string
}

export default function ProjectCard({
  title,
  description,
  category,
  image,
  index,
  url,
  alt,
}: ProjectCardProps) {
  const { t } = useTranslation()

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.75, delay: index * 0.08 }}
      className="flex min-h-[430px] flex-col overflow-hidden rounded-lg border border-white/10 bg-black"
    >
      <div className="relative aspect-[4/3] overflow-hidden border-b border-white/10 bg-white/[0.03]">
        <img
          src={buildImageKitUrl(image || "/placeholder.svg", getProjectImageTransformations(640, 82))}
          srcSet={
            image && !image.startsWith("/placeholder")
              ? getProjectImageSrcSet(image, 82)
                  .map((item) => `${item.src} ${item.descriptor}`)
                  .join(", ")
              : undefined
          }
          alt={alt}
          className="h-full w-full object-cover opacity-85"
          width={640}
          height={480}
          sizes="(max-width: 768px) 100vw, 33vw"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(0,0,0,0.65)_100%)]" />
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="mb-5 text-[11px] uppercase tracking-[0.2em] text-white/35">{category}</div>
        <h3 className="mb-4 text-[24px] font-normal leading-[1.05] tracking-[-0.02em] text-white md:text-[30px]">
          {title}
        </h3>
        <p className="text-[13px] leading-relaxed text-white/50 sm:text-[14px]">{description}</p>
        <div className="mt-auto flex items-center justify-between border-t border-white/10 pt-5 text-[12px] uppercase tracking-[0.14em] text-white/40">
          <span>{t("projects.visitLink")}</span>
          <span aria-hidden="true">-&gt;</span>
        </div>
      </div>
    </motion.a>
  )
}
