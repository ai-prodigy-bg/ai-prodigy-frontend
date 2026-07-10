"use client"

import { motion } from "framer-motion"
import { buildImageKitUrl, getProjectImageSrcSet, getProjectImageTransformations } from "../../lib/utils/imagekit"
import { useTranslation } from "../../lib/translations"

interface ProjectCardProps {
  title: string
  description: string
  category: string
  image?: string
  artwork?: "mister-imot-app"
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
  artwork,
  index,
  url,
  alt,
  status,
}: ProjectCardProps) {
  const { t } = useTranslation()
  const isLocalImage = image?.startsWith("/images/")

  const cardContent = (
    <>
      <div className="relative aspect-[4/3] overflow-hidden border-b border-white/10 bg-white/[0.03]">
        {artwork === "mister-imot-app" ? (
          <div
            className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[#d7d2bd]"
            role="img"
            aria-label={alt}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_0%,rgba(82,166,195,0.8),transparent_48%)]" />
            <div className="absolute inset-x-0 bottom-0 h-[58%] bg-[linear-gradient(145deg,#f6a01c_0%,#d59435_48%,#f4e4c4_100%)]" />
            <div className="relative h-[88%] aspect-[9/19] rounded-[22px] border-[3px] border-[#18202c] bg-[#18202c] p-[3px] shadow-[0_10px_18px_rgba(0,0,0,0.35)]">
              <div className="relative h-full overflow-hidden rounded-[17px] bg-[#f8f8f5]">
                <span className="absolute left-1/2 top-[4px] z-10 h-[8px] w-[32%] -translate-x-1/2 rounded-full bg-[#090b0f]" />
                <img
                  src="/images/projects/mister-imot-logo.svg"
                  alt=""
                  className="absolute left-1/2 top-[15%] w-[56%] -translate-x-1/2"
                  width={400}
                  height={400}
                />
                <div className="absolute inset-x-0 bottom-0 h-[31%] border-t border-[#ced1d2] bg-[#f1f2ef] opacity-75">
                  <span className="absolute bottom-0 left-[8%] h-[58%] w-[18%] border border-[#b8bdbe]" />
                  <span className="absolute bottom-0 left-[31%] h-[82%] w-[24%] border border-[#b8bdbe]" />
                  <span className="absolute bottom-0 right-[9%] h-[68%] w-[28%] border border-[#b8bdbe]" />
                  <span className="absolute inset-x-0 top-[42%] border-t border-[#c5c9ca]" />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <img
            src={isLocalImage ? image : buildImageKitUrl(image || "/placeholder.svg", getProjectImageTransformations(640, 82))}
            srcSet={
              !isLocalImage && image && !image.startsWith("/placeholder")
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
        )}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(0,0,0,0.65)_100%)]" />
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="mb-5 text-[11px] uppercase tracking-[0.2em] text-white/35">{category}</div>
        <h3 className="mb-4 text-[24px] font-normal leading-[1.05] tracking-[-0.02em] text-white md:text-[30px]">
          {title}
        </h3>
        <p className="text-[13px] leading-relaxed text-white/50 sm:text-[14px]">{description}</p>
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
    className: "flex min-h-[430px] flex-col overflow-hidden rounded-lg border border-white/10 bg-black",
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
