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
  status?: string
}

export default function ProjectCard({
  title,
  description,
  category,
  image,
  index,
  url,
  alt,
  status,
}: ProjectCardProps) {
  const { t } = useTranslation()
  const isLocalImage = image.startsWith("/images/")

  const cardContent = (
    <>
      <div className="relative aspect-[16/10] overflow-hidden border-b border-white/10 bg-white/[0.03]">
        <img
          src={isLocalImage ? image : buildImageKitUrl(image || "/placeholder.svg", getProjectImageTransformations(960, 86))}
          srcSet={
            !isLocalImage && image && !image.startsWith("/placeholder")
              ? getProjectImageSrcSet(image, 86)
                  .map((item) => `${item.src} ${item.descriptor}`)
                  .join(", ")
              : undefined
          }
          alt={alt}
          className="h-full w-full object-cover opacity-90 transition duration-700 group-hover:scale-[1.025] group-hover:opacity-100"
          width={960}
          height={600}
          sizes="(max-width: 768px) 100vw, 50vw"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(0,0,0,0.65)_100%)]" />
      </div>

      <div className="flex flex-1 flex-col p-6 sm:p-8">
        <div className="mb-5 text-[11px] uppercase tracking-[0.2em] text-white/35">{category}</div>
        <h3 className="mb-4 text-[28px] font-normal leading-[1.05] tracking-[-0.02em] text-white md:text-[34px]">
          {title}
        </h3>
        <p className="max-w-xl text-[14px] leading-relaxed text-white/50 sm:text-[15px]">{description}</p>
        <div className="mt-auto flex items-center justify-between border-t border-white/10 pt-5 text-[12px] uppercase tracking-[0.14em] text-white/40">
          <span>{status || t("projects.visitLink")}</span>
          {url && <span aria-hidden="true">-&gt;</span>}
        </div>
      </div>
    </>
  )

  const motionProps = {
    initial: { opacity: 0, y: 28 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.25 },
    transition: { duration: 0.75, delay: index * 0.08 },
    className:
      "group flex min-h-[500px] flex-col overflow-hidden rounded-lg border border-white/10 bg-black transition-colors duration-300 hover:border-white/20",
  }

  if (url) {
    return (
      <motion.a href={url} target="_blank" rel="noopener noreferrer" {...motionProps}>
        {cardContent}
      </motion.a>
    )
  }

  return <motion.article {...motionProps}>{cardContent}</motion.article>
}
