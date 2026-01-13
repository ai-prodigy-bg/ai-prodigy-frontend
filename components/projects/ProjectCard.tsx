"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { buildImageKitUrl, getProjectImageTransformations, getProjectImageSrcSet } from "../../lib/utils/imagekit"

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
  const [isHovering, setIsHovering] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const rafIdRef = useRef<number | null>(null)
  const rectCacheRef = useRef<{ rect: DOMRect; time: number } | null>(null)
  const RECT_CACHE_DURATION = 16 // Cache rect for 16ms (60fps)

  // Cleanup RAF on unmount
  useEffect(() => {
    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current)
        rafIdRef.current = null
      }
    }
  }, [])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // Throttle updates using requestAnimationFrame
    if (rafIdRef.current === null) {
      rafIdRef.current = requestAnimationFrame(() => {
        const now = performance.now()
        const element = e.currentTarget
        
        // Guard against null element (component may have unmounted)
        if (!element) {
          rafIdRef.current = null
          return
        }
        
        // Cache rect to avoid forced reflows
        if (!rectCacheRef.current || now - rectCacheRef.current.time > RECT_CACHE_DURATION) {
          rectCacheRef.current = { rect: element.getBoundingClientRect(), time: now }
        }
        
        const rect = rectCacheRef.current.rect
        const x = e.clientX - rect.left - rect.width / 2
        const y = e.clientY - rect.top - rect.height / 2
        setMousePosition({ x, y })
        rafIdRef.current = null
      })
    }
  }

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className="group relative block"
      data-magnetic
    >
      <motion.div
        animate={
          isHovering
            ? {
                rotateX: mousePosition.y * 0.05,
                rotateY: mousePosition.x * 0.05,
                scale: 1.02,
                y: -10,
              }
            : { rotateX: 0, rotateY: 0, scale: 1, y: 0 }
        }
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        style={{ transformStyle: "preserve-3d" }}
        className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 sm:p-8 md:p-10 relative overflow-hidden min-h-[450px] sm:min-h-[480px] md:min-h-[520px] flex flex-col cursor-pointer"
      >
        {/* Floating animation when idle */}
        <motion.div
          animate={
            !isHovering
              ? {
                  y: [0, -5, 0],
                  rotateZ: [0, 1, -1, 0],
                }
              : {}
          }
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="absolute inset-0"
        />

        {/* Gradient overlay that follows cursor */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          animate={
            isHovering
              ? {
                  background: `radial-gradient(circle at ${mousePosition.x + 200}px ${mousePosition.y + 200}px, oklch(0.65 0.25 285 / 0.15), transparent 50%)`,
                }
              : {}
          }
          transition={{ duration: 0.1 }}
        />

        <div className="relative z-10 flex flex-col h-full">
          {/* Category badge */}
          <motion.span
            className="inline-block w-fit px-2 sm:px-3 py-1 bg-primary/20 text-primary text-xs sm:text-sm font-medium rounded-full mb-3 sm:mb-4"
            animate={isHovering ? { scale: 1.05 } : { scale: 1 }}
          >
            {category}
          </motion.span>

          {/* Project image */}
          <motion.div
            className="relative mb-4 sm:mb-5 md:mb-5 rounded-xl overflow-hidden bg-muted/50 flex-shrink-0"
            animate={
              isHovering
                ? {
                    scale: 1.05,
                    rotateZ: mousePosition.x * 0.02,
                  }
                : { scale: 1, rotateZ: 0 }
            }
            transition={{ duration: 0.3 }}
            style={{ transform: `translateZ(20px)` }}
          >
            <img
              src={buildImageKitUrl(image || "/placeholder.svg", getProjectImageTransformations(323, 80))}
              srcSet={image && !image.startsWith('/placeholder') 
                ? getProjectImageSrcSet(image, 80).map(item => `${item.src} ${item.descriptor}`).join(', ')
                : undefined
              }
              alt={alt}
              className="w-full h-auto object-cover rounded-t-lg"
              width={323}
              height={242}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 323px"
              loading="lazy"
            />
            <motion.div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.div>

          {/* Content - flex-grow to fill remaining space */}
          <div className="flex-grow flex flex-col">
            <motion.h3
              className="font-heading font-bold text-xl sm:text-2xl md:text-3xl mb-3 sm:mb-4 text-foreground"
              animate={isHovering ? { color: "oklch(0.65 0.25 285)" } : {}}
              style={{ transform: `translateZ(30px)` }}
            >
              {title}
            </motion.h3>

            <motion.p
              className="text-muted-foreground text-sm sm:text-base md:text-base leading-normal flex-grow mb-4 sm:mb-5"
              style={{ transform: `translateZ(20px)` }}
            >
              {description}
            </motion.p>

            {/* Hover indicator */}
            <motion.div
              className="mt-auto pt-3 flex items-center justify-between"
              animate={isHovering ? { y: -3 } : { y: 0 }}
              style={{ transform: `translateZ(40px)` }}
            >
              <motion.span
                className="text-sm text-muted-foreground"
                animate={isHovering ? { opacity: 1 } : { opacity: 0.7 }}
              >
                Click to visit
              </motion.span>
              <motion.svg
                className="w-4 h-4 text-primary"
                animate={isHovering ? { x: 3, scale: 1.1 } : { x: 0, scale: 1 }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </motion.svg>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.a>
  )
}
