"use client"

import type React from "react"

import Image from "next/image"
import dynamic from "next/dynamic"
import { useEffect, useRef, useState } from "react"
import { motion, useInView, useScroll, AnimatePresence } from "framer-motion"
import { useTranslation } from "../lib/translations"
import LanguageSwitcher from "../components/LanguageSwitcher"
import LoadingCat from "../components/LoadingCat"
import { useIsMobile } from "../hooks/use-mobile"
import { XIcon, InstagramIcon, FacebookIcon } from "../components/SocialIcons"

const ShaderBackground = dynamic(() => import("../components/ShaderBackground"), {
  ssr: false,
  loading: () => <ShaderBackgroundFallback />,
})

function ShaderBackgroundFallback() {
  return (
    <div
      style={{
        position: "fixed",
        width: "100%",
        height: "100%",
        backgroundColor: "#0a0f1e",
        backgroundImage:
          "radial-gradient(circle at 1px 1px, rgba(26, 42, 71, 0.7) 1px, transparent 0)",
        backgroundSize: "32px 32px",
        overflow: "hidden",
        zIndex: -10,
      }}
    />
  )
}

// ImageKit transformation utilities
const IMAGEKIT_URL_ENDPOINT = "https://ik.imagekit.io/ts59gf2ul"

function buildImageKitUrl(src: string, transformations: string[]): string {
  if (!src || src.startsWith("/placeholder")) return src
  const transformationString = transformations.join(",")
  return `${IMAGEKIT_URL_ENDPOINT}/tr:${transformationString}${src}`
}

// Responsive image transformations for different screen sizes
function getResponsiveImageTransformations(): string[] {
  return [
    "w-400", // Set width to 400px
    "h-auto", // Let height adjust automatically to maintain aspect ratio
    "q-90", // High quality (90%)
    "f-auto", // Auto format (WebP when supported)
    "cm-maintain_ratio", // Maintain original aspect ratio without padding
  ]
}

function LiquidCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const magneticRectRef = useRef<DOMRect | null>(null)
  const [isHovering, setIsHovering] = useState(false)
  const [magneticTarget, setMagneticTarget] = useState<HTMLElement | null>(null)
  const pointerRef = useRef({ x: 0, y: 0 })
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const cursor = cursorRef.current
    if (!cursor) return

    const updateMagneticRect = () => {
      if (magneticTarget) {
        magneticRectRef.current = magneticTarget.getBoundingClientRect()
      }
    }

    const moveCursor = () => {
      rafRef.current = null
      const { x: mouseX, y: mouseY } = pointerRef.current

      // Magnetic attraction effect
      if (magneticTarget && magneticRectRef.current) {
        const rect = magneticRectRef.current
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        const distance = Math.sqrt(Math.pow(mouseX - centerX, 2) + Math.pow(mouseY - centerY, 2))

        if (distance < 100) {
          const strength = Math.max(0, 1 - distance / 100)
          const attractX = centerX + (mouseX - centerX) * (1 - strength * 0.3)
          const attractY = centerY + (mouseY - centerY) * (1 - strength * 0.3)
          cursor.style.left = `${attractX}px`
          cursor.style.top = `${attractY}px`
          return
        }
      }

      cursor.style.left = `${mouseX}px`
      cursor.style.top = `${mouseY}px`
    }

    const scheduleMove = () => {
      if (rafRef.current !== null) return
      rafRef.current = requestAnimationFrame(moveCursor)
    }

    const handleMouseMove = (e: MouseEvent) => {
      pointerRef.current = { x: e.clientX, y: e.clientY }
      scheduleMove()
    }

    const handleMouseEnter = (e: Event) => {
      setIsHovering(true)
      const target = e.target as HTMLElement
      if (target.hasAttribute("data-magnetic")) {
        setMagneticTarget(target)
        magneticRectRef.current = target.getBoundingClientRect()
      }
    }

    const handleMouseLeave = () => {
      setIsHovering(false)
      setMagneticTarget(null)
      magneticRectRef.current = null
    }

    document.addEventListener("mousemove", handleMouseMove, { passive: true })
    window.addEventListener("scroll", updateMagneticRect, { passive: true })
    window.addEventListener("resize", updateMagneticRect)

    // Add hover effects to interactive elements
    const interactiveElements = document.querySelectorAll("button, a, [data-magnetic]")
    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", handleMouseEnter, { passive: true })
      el.addEventListener("mouseleave", handleMouseLeave, { passive: true })
    })

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("scroll", updateMagneticRect)
      window.removeEventListener("resize", updateMagneticRect)
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
      }
      interactiveElements.forEach((el) => {
        el.removeEventListener("mouseenter", handleMouseEnter)
        el.removeEventListener("mouseleave", handleMouseLeave)
      })
    }
  }, [magneticTarget])

  return (
    <motion.div
      ref={cursorRef}
      className="fixed w-6 h-6 pointer-events-none z-50 mix-blend-difference"
      style={{
        background: "radial-gradient(circle, oklch(0.65 0.25 285) 0%, transparent 70%)",
        borderRadius: "50%",
        transform: "translate(-50%, -50%)",
      }}
      animate={{
        scale: isHovering ? 2.5 : 1,
        opacity: isHovering ? 0.9 : 0.6,
      }}
      transition={{ type: "spring", stiffness: 500, damping: 28 }}
    />
  )
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll()

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-primary/30 z-50 origin-left"
      style={{ scaleX: scrollYProgress }}
    />
  )
}

function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true)
  const { t } = useTranslation()

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 3000) // Increased to 3 seconds to show the cat properly

    return () => clearTimeout(timer)
  }, [])

  if (!isLoading) return null

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.8, delay: 2.5 }}
      className="fixed inset-0 bg-background z-[100] flex items-center justify-center"
      onAnimationComplete={() => setIsLoading(false)}
    >
      <div className="text-center">
        {/* Replace with LoadingCat component */}
        <LoadingCat size="xl" message={t("brand.name")} showMessage={true} />
      </div>
    </motion.div>
  )
}

function SmoothScroll() {
  useEffect(() => {
    const handleClick = (e: Event) => {
      const target = e.target as HTMLElement
      const href = target.getAttribute("href")

      if (href && href.startsWith("#")) {
        e.preventDefault()
        const element = document.querySelector(href)
        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start",
          })
        }
      }
    }

    const links = document.querySelectorAll('a[href^="#"]')
    links.forEach((link) => {
      link.addEventListener("click", handleClick)
    })

    return () => {
      links.forEach((link) => {
        link.removeEventListener("click", handleClick)
      })
    }
  }, [])

  return null
}

function FloatingActionButton() {
  const [isVisible, setIsVisible] = useState(false)
  const { t } = useTranslation()
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const toggleVisibility = () => {
      rafRef.current = null
      setIsVisible(window.pageYOffset > 300)
    }

    const handleScroll = () => {
      if (rafRef.current !== null) return
      rafRef.current = requestAnimationFrame(toggleVisibility)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", handleScroll)
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [])

  const scrollToContact = () => {
    const contactSection = document.getElementById("contact")
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: isVisible ? 1 : 0,
        scale: isVisible ? 1 : 0,
      }}
      transition={{ duration: 0.3 }}
      onClick={scrollToContact}
      className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg z-40 flex items-center justify-center"
      whileHover={{
        scale: 1.1,
        boxShadow: "0 0 30px oklch(0.65 0.25 285 / 0.5)",
      }}
      whileTap={{ scale: 0.9 }}
      data-magnetic
      aria-label={t("navigation.contact")}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    </motion.button>
  )
}

function MagneticElements() {
  const rafRef = useRef<number | null>(null)
  const rectMapRef = useRef(new WeakMap<HTMLElement, DOMRect>())

  useEffect(() => {
    const magneticElements = document.querySelectorAll<HTMLElement>("[data-magnetic]")

    const updateRect = (element: HTMLElement) => {
      rectMapRef.current.set(element, element.getBoundingClientRect())
    }

    const scheduleMove = (element: HTMLElement, x: number, y: number) => {
      if (rafRef.current !== null) return
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null
        element.style.transform = `translate(${x}px, ${y}px)`
      })
    }

    const handleMouseMove = (e: MouseEvent) => {
      const element = e.currentTarget as HTMLElement
      let rect = rectMapRef.current.get(element)
      if (!rect) {
        rect = element.getBoundingClientRect()
        rectMapRef.current.set(element, rect)
      }
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2

      const distance = Math.sqrt(x * x + y * y)
      const maxDistance = 50

      if (distance < maxDistance) {
        const strength = (maxDistance - distance) / maxDistance
        const moveX = x * strength * 0.3
        const moveY = y * strength * 0.3
        scheduleMove(element, moveX, moveY)
      }
    }

    const handleMouseEnter = (e: MouseEvent) => {
      updateRect(e.currentTarget as HTMLElement)
    }

    const handleMouseLeave = (e: MouseEvent) => {
      const element = e.currentTarget as HTMLElement
      element.style.transform = "translate(0px, 0px)"
    }

    const handleViewportChange = () => {
      rectMapRef.current = new WeakMap()
    }

    magneticElements.forEach((element) => {
      element.addEventListener("mouseenter", handleMouseEnter, { passive: true })
      element.addEventListener("mousemove", handleMouseMove, { passive: true })
      element.addEventListener("mouseleave", handleMouseLeave, { passive: true })
    })
    window.addEventListener("scroll", handleViewportChange, { passive: true })
    window.addEventListener("resize", handleViewportChange)

    return () => {
      magneticElements.forEach((element) => {
        element.removeEventListener("mouseenter", handleMouseEnter)
        element.removeEventListener("mousemove", handleMouseMove)
        element.removeEventListener("mouseleave", handleMouseLeave)
      })
      window.removeEventListener("scroll", handleViewportChange)
      window.removeEventListener("resize", handleViewportChange)
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [])

  return null
}

function DrawingSVG() {
  return (
    <motion.svg width="200" height="100" viewBox="0 0 200 100" className="absolute top-20 right-10 opacity-30">
      <motion.path
        d="M10,50 Q50,10 100,50 T190,50"
        stroke="oklch(0.65 0.25 285)"
        strokeWidth="2"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, delay: 1.5, ease: "easeInOut" }}
      />
      <motion.circle
        cx="190"
        cy="50"
        r="4"
        fill="oklch(0.65 0.25 285)"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 3.5, type: "spring" }}
      />
    </motion.svg>
  )
}

function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { t } = useTranslation()

  const menuItems = [
    { key: "projects", label: t("navigation.projects") },
    { key: "services", label: t("navigation.services") },
    { key: "about", label: t("navigation.about") },
    { key: "contact", label: t("navigation.contact") },
  ]

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 p-4 md:p-6"
    >
      <div className="flex justify-between items-center max-w-7xl mx-auto px-6 py-4">
        <motion.div whileHover={{ scale: 1.05 }} className="flex items-center" data-magnetic>
          <Image
            src={buildImageKitUrl("/prodigy%20corp/Logo/prodigy-corp-text-logo-nobg-cut.png", [
              "w-326",
              "q-90",
              "f-auto",
              "dpr-2",
              "cm-maintain_ratio",
              "bo-2_FFFFFF",
            ])}
            alt="Prodigy Corp"
            className="h-8 md:h-10 w-auto"
            width={179}
            height={56}
            sizes="(min-width: 768px) 179px, 140px"
            style={{
              filter:
                // White edge, then brand-purple outer glow layers
                "drop-shadow(0 0 2px rgba(255,255,255,0.5)) " +
                "drop-shadow(0 0 8px rgba(139,92,246,0.45)) " +
                "drop-shadow(0 0 18px rgba(139,92,246,0.25))",
            }}
          />
        </motion.div>

        <div className="hidden md:flex items-center gap-4 lg:gap-8">
          {menuItems.map((item, index) => (
            <motion.a
              key={item.key}
              href={`#${item.key}`}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 + 0.5 }}
              whileHover={{
                scale: 1.1,
                color: "oklch(0.65 0.25 285)",
                transition: { type: "spring", stiffness: 400, damping: 10 },
              }}
              className="text-sm lg:text-base text-foreground hover:text-primary transition-colors cursor-pointer relative font-medium drop-shadow-sm"
              data-magnetic
            >
              {item.label}
              <motion.div
                className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary origin-left"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.a>
          ))}

          <LanguageSwitcher />
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-foreground p-2 drop-shadow-sm"
          data-magnetic
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </motion.button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden border-t border-border/20 bg-background/95 backdrop-blur-md rounded-b-2xl"
          >
            <div className="px-6 py-4 space-y-4">
              {menuItems.map((item, index) => (
                <motion.a
                  key={item.key}
                  href={`#${item.key}`}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => {
                    setIsMobileMenuOpen(false)
                    // Small delay to ensure menu closes before scrolling
                    setTimeout(() => {
                      const element = document.querySelector(`#${item.key}`)
                      if (element) {
                        element.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        })
                      }
                    }, 300)
                  }}
                  className="block text-foreground hover:text-primary transition-colors py-2 font-medium"
                >
                  {item.label}
                </motion.a>
              ))}
              <div className="pt-4 border-t border-border/20">
                <LanguageSwitcher isMobile={true} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

function MixedTypographyText({ children }: { children: string }) {
  const words = children.split(" ")
  const [highlightIndex, setHighlightIndex] = useState(0)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const interval = setInterval(() => {
      setHighlightIndex((prev) => (prev + 1) % words.length)
    }, 1500)
    return () => clearInterval(interval)
  }, [words.length])

  return (
    <span>
      {words.map((word, index) => (
        <span
          key={index}
          className={`transition-colors duration-500 ${
            isClient && index === highlightIndex ? "text-primary font-semibold" : ""
          }`}
        >
          {word}{" "}
        </span>
      ))}
    </span>
  )
}

function ServiceCard({
  title,
  description,
  icon,
  delay,
}: {
  title: string
  description: string
  icon: React.ReactNode
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay }}
      viewport={{ once: true }}
      className="group bg-card/20 backdrop-blur-md border border-border/20 rounded-2xl p-6 md:p-8 relative overflow-hidden h-full"
      whileHover={{
        scale: 1.02,
        boxShadow: "0 0 40px oklch(0.65 0.25 285 / 0.2)",
      }}
      data-magnetic
    >
      <motion.div
        className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
      <div className="relative z-10">
        <div className="w-14 h-14 bg-primary/20 rounded-2xl flex items-center justify-center mb-6">
          {icon}
        </div>
        <h3 className="font-heading font-bold text-2xl mb-4 text-foreground">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </motion.div>
  )
}

function ProjectCard({
  title,
  description,
  category,
  image,
  url,
  alt,
}: {
  title: string
  description: string
  category: string
  image: string
  url: string
  alt: string
}) {
  const [isHovering, setIsHovering] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className="block"
    >
      <motion.div
        className="group bg-card/30 backdrop-blur-md border border-border/30 rounded-2xl p-5 md:p-6 relative overflow-hidden h-full"
        whileHover={{
          scale: 1.03,
          rotateY: mousePosition.x * 0.01,
          rotateX: -mousePosition.y * 0.01,
          boxShadow: "0 25px 50px -12px oklch(0.65 0.25 285 / 0.4)",
        }}
        transition={{ duration: 0.3 }}
        style={{
          transformStyle: "preserve-3d",
          perspective: "1000px",
        }}
      >
        {/* Animated background gradient */}
        <motion.div
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{
            duration: 6,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: "linear-gradient(45deg, oklch(0.65 0.25 285 / 0.1), oklch(0.7 0.25 340 / 0.1))",
            backgroundSize: "200% 200%",
          }}
        />

        {/* Gradient overlay that follows cursor */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          animate={
            isHovering
              ? {
                  background: `radial-gradient(circle at ${mousePosition.x + 200}px ${
                    mousePosition.y + 200
                  }px, oklch(0.65 0.25 285 / 0.15), transparent 50%)`,
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
            <div className="relative w-full aspect-[4/3]">
              <Image
                src={buildImageKitUrl(image || "/placeholder.svg", getResponsiveImageTransformations())}
                alt={alt}
                fill
                sizes="(min-width: 1280px) 360px, (min-width: 768px) 45vw, 90vw"
                className="object-cover rounded-t-lg"
              />
            </div>
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
                {/* We'll add translation later */}
                Click to visit
              </motion.span>
              <motion.svg
                className="w-4 h-4 text-primary"
                animate={isHovering ? { x: 3, scale: 1.1 } : { x: 0, scale: 1 }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </motion.svg>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.a>
  )
}

function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })
  const { t } = useTranslation()

  const digitalAssets = [
    {
      title: t("projects.portfolio.mrimot.name"),
      description: t("projects.portfolio.mrimot.description"),
      category: t("projects.portfolio.mrimot.category"),
      image: "/prodigy%20corp/projects/mrimot.com-showcase.png",
      url: "https://www.mrimot.com/",
      alt: "mrimot.com showcase on prodigy corp website",
    },
  ]

  const clientSuccessStories = [
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
          >
            {t("projects.title")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty"
          >
            {t("projects.subtitle")}
          </motion.p>
        </motion.div>

        {/* Digital Assets Section */}
        <div className="mb-16 md:mb-20">
          <motion.h3
            className="font-heading font-bold text-2xl md:text-3xl mb-8 text-foreground flex items-center gap-3"
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <span className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
              </svg>
            </span>
            {t("projects.digitalAssets.title")}
          </motion.h3>

          <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
            {digitalAssets.map((project, index) => (
              <ProjectCard key={project.title} {...project} />
            ))}
          </div>
        </div>

        {/* Client Success Stories Section */}
        <div>
          <motion.h3
            className="font-heading font-bold text-2xl md:text-3xl mb-8 text-foreground flex items-center gap-3"
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <span className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </span>
            {t("projects.clientSuccess.title")}
          </motion.h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {clientSuccessStories.map((project, index) => (
              <ProjectCard key={project.title} {...project} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function ServicesSection() {
  const { t } = useTranslation()
  const services = [
    {
      title: t("services.items.design.title"),
      description: t("services.items.design.description"),
      icon: (
        <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      title: t("services.items.development.title"),
      description: t("services.items.development.description"),
      icon: (
        <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2m4-1v4m0-4a2 2 0 00-2 2v4m2-4a2 2 0 012 2v4m-6 4h6m-6 4h6" />
        </svg>
      ),
    },
    {
      title: t("services.items.strategy.title"),
      description: t("services.items.strategy.description"),
      icon: (
        <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 2h14v8H5V6zm2 12h10" />
        </svg>
      ),
    },
  ]

  return (
    <section id="services" className="min-h-screen py-20 px-4 md:px-6 relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.h2
            className="font-heading font-bold text-4xl md:text-5xl lg:text-7xl mb-6 text-balance"
            animate={{
              backgroundImage: [
                "linear-gradient(45deg, oklch(0.98 0 0), oklch(0.65 0.25 285))",
                "linear-gradient(45deg, oklch(0.65 0.25 285), oklch(0.7 0.25 340))",
                "linear-gradient(45deg, oklch(0.7 0.25 340), oklch(0.6 0.2 160))",
                "linear-gradient(45deg, oklch(0.6 0.2 160), oklch(0.65 0.25 285))",
              ],
            }}
            transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
          >
            {t("services.title")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty"
          >
            {t("services.subtitle")}
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard key={service.title} {...service} delay={index * 0.2} />
          ))}
        </div>
      </div>
    </section>
  )
}

function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })
  const { t } = useTranslation()

  const teamMembers = [
    { name: "John", role: "CEO" },
    { name: "Sarah", role: "CTO" },
    { name: "Mike", role: "Lead Designer" },
    { name: "Emma", role: "Lead Developer" },
    { name: "Alex", role: "Marketing" },
    { name: "Lisa", role: "Support" },
  ]

  const AnimatedAvatar = ({ name, role, index }: { name: string; role: string; index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="flex flex-col items-center text-center"
    >
      <motion.div
        className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mb-3"
        whileHover={{ scale: 1.1, boxShadow: "0 0 20px oklch(0.65 0.25 285 / 0.4)" }}
      >
        <span className="text-2xl text-primary font-semibold">{name.charAt(0)}</span>
      </motion.div>
      <p className="font-medium text-foreground">{name}</p>
      <p className="text-sm text-muted-foreground">{role}</p>
    </motion.div>
  )

  return (
    <section ref={sectionRef} id="about" className="min-h-screen py-20 px-4 md:px-6 relative">
      <div className="max-w-7xl mx-auto">
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
          >
            {t("about.title")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty"
          >
            {t("about.subtitle")}
          </motion.p>
        </motion.div>

        {/* Team Section - Commented out for now */}
        {/*
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <motion.h3
            className="font-heading font-bold text-3xl md:text-4xl mb-4 text-foreground"
            animate={
              isInView
                ? {
                    textShadow: [
                      "0 0 20px oklch(0.65 0.25 285 / 0.3)",
                      "0 0 30px oklch(0.7 0.25 340 / 0.3)",
                      "0 0 20px oklch(0.65 0.25 285 / 0.3)",
                    ],
                  }
                : {}
            }
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
          >
            Meet Our Team
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty"
          >
            The brilliant minds behind every pixel, every line of code, and every innovative solution.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8 mb-12 md:mb-16">
          {teamMembers.map((member, index) => (
            <AnimatedAvatar key={member.name} name={member.name} role={member.role} index={index} />
          ))}
        </div>
        */}

        {/* Call to action - Commented out for now */}
        {/*
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="text-center"
        >
          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 40px oklch(0.65 0.25 285 / 0.4)",
              y: -5,
            }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-8 py-4 rounded-xl font-semibold text-lg hover:from-primary/90 hover:to-primary/70 transition-all duration-300 relative overflow-hidden"
            data-magnetic
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.6 }}
            />
            <span className="relative z-10">Join Our Team</span>
          </motion.button>
        </motion.div>
        */}

        {/* Animated background elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-primary/20 rounded-full"
              style={{
                left: `${5 + i * 10}%`,
                top: `${10 + (i % 4) * 25}%`,
              }}
              animate={{
                y: [0, -40, 0],
                x: [0, 30, 0],
                opacity: [0.2, 0.6, 0.2],
                scale: [1, 2, 1],
              }}
              transition={{
                duration: 6 + i * 0.3,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.5,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function ContactSection() {
  const { t } = useTranslation()
  const isMobile = useIsMobile()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    project: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState<{
    type: "success" | "error" | null
    message: string
  }>({ type: null, message: "" })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitResult({ type: null, message: "" })

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: "88ab9b06-511c-4c5a-9531-9137d2aa69f9",
          name: formData.name,
          email: formData.email,
          projectType: formData.project,
          message: formData.message,
          botcheck: false, // Honeypot spam protection
        }),
      })

      const result = await response.json()

      if (result.success) {
        setSubmitResult({
          type: "success",
          message: t("contact.form.success") || "Thank you! Your message has been sent successfully.",
        })
        setFormData({ name: "", email: "", project: "", message: "" })
      } else {
        setSubmitResult({
          type: "error",
          message: result.message || t("contact.form.error") || "Something went wrong. Please try again.",
        })
      }
    } catch (error) {
      setSubmitResult({
        type: "error",
        message: t("contact.form.error") || "Network error. Please check your connection and try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="min-h-screen py-20 px-6 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => {
          const positions = [
            { left: 10, top: 15 },
            { left: 90, top: 25 },
            { left: 30, top: 45 },
            { left: 70, top: 65 },
            { left: 20, top: 85 },
            { left: 80, top: 10 },
            { left: 50, top: 75 },
            { left: 40, top: 35 },
          ]
          const pos = positions[i] || { left: 50, top: 50 }

          return (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-primary/20 rounded-full"
              style={{
                left: `${pos.left}%`,
                top: `${pos.top}%`,
              }}
              animate={{
                scale: [1, 2, 1],
                opacity: [0.2, 0.8, 0.2],
                x: [0, i % 2 === 0 ? 30 : -30, 0],
                y: [0, i % 3 === 0 ? 40 : -40, 0],
              }}
              transition={{
                duration: 4 + i * 0.2,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.5,
                ease: "easeInOut",
              }}
            />
          )
        })}
      </div>

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.h2
            className="font-heading font-bold text-5xl md:text-7xl mb-6 text-balance"
            animate={{
              backgroundImage: [
                "linear-gradient(45deg, oklch(0.98 0 0), oklch(0.65 0.25 285))",
                "linear-gradient(45deg, oklch(0.65 0.25 285), oklch(0.7 0.25 340))",
                "linear-gradient(45deg, oklch(0.7 0.25 340), oklch(0.6 0.2 160))",
                "linear-gradient(45deg, oklch(0.6 0.2 160), oklch(0.65 0.25 285))",
              ],
            }}
            transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
          >
            {t("contact.title")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty"
          >
            {t("contact.subtitle")}
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left: Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h3 className="font-heading font-bold text-2xl md:text-3xl mb-4 text-foreground">
                {t("contact.info.title")}
              </h3>
              <p className="text-muted-foreground text-lg leading-relaxed">{t("contact.info.description")}</p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t("contact.info.phone.label")}</p>
                  <p className="text-lg font-medium text-foreground">{t("contact.info.phone.value")}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1a3 3 0 11-6 0v-1m6 0V9a3 3 0 00-6 0v3m6 0H9" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t("contact.info.email.label")}</p>
                  <p className="text-lg font-medium text-foreground">{t("contact.info.email.value")}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 12.414a4 4 0 10-5.657 5.657l4.243 4.243a8 8 0 1111.314-11.314z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t("contact.info.location.label")}</p>
                  <p className="text-lg font-medium text-foreground">{t("contact.info.location.value")}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="bg-card/30 backdrop-blur-md border border-border/30 rounded-2xl p-6 md:p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">{t("contact.form.name.label")}</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-background/50 border border-border/50 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder={t("contact.form.name.placeholder")}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">{t("contact.form.email.label")}</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-background/50 border border-border/50 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder={t("contact.form.email.placeholder")}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">{t("contact.form.project.label")}</label>
                <select
                  name="project"
                  value={formData.project}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-background/50 border border-border/50 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                >
                  <option value="">{t("contact.form.project.placeholder")}</option>
                  <option value="website">{t("contact.form.project.options.website")}</option>
                  <option value="app">{t("contact.form.project.options.app")}</option>
                  <option value="branding">{t("contact.form.project.options.branding")}</option>
                  <option value="other">{t("contact.form.project.options.other")}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">{t("contact.form.message.label")}</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={isMobile ? 4 : 5}
                  className="w-full px-4 py-3 bg-background/50 border border-border/50 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                  placeholder={t("contact.form.message.placeholder")}
                />
              </div>

              {submitResult.type && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-xl text-sm ${
                    submitResult.type === "success"
                      ? "bg-green-500/10 text-green-400 border border-green-500/20"
                      : "bg-red-500/10 text-red-400 border border-red-500/20"
                  }`}
                >
                  {submitResult.message}
                </motion.div>
              )}

              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-primary-foreground px-6 py-4 rounded-xl font-semibold text-lg hover:bg-primary/90 transition-all duration-300 relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 0 30px oklch(0.65 0.25 285 / 0.4)",
                }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />
                <span className="relative z-10">
                  {isSubmitting ? t("contact.form.submitting") : t("contact.form.submit")}
                </span>
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default function HomePageClient() {
  const { t } = useTranslation()

  return (
    <main className="min-h-screen relative overflow-hidden md:cursor-none cursor-auto">
      <LoadingScreen />
      <ScrollProgress />
      {/* Liquid Cursor - Desktop only */}
      <div className="hidden md:block">
        <LiquidCursor />
      </div>
      <ShaderBackground />
      <Navigation />
      <SmoothScroll />
      {/* Magnetic Elements - Desktop only */}
      <div className="hidden md:block">
        <MagneticElements />
      </div>
      <FloatingActionButton />

      {/* Enhanced Hero Section */}
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
              {t("hero.title.line1")}
              <br />
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
                {t("hero.title.line2")}
              </motion.span>
              <br />
              {t("hero.title.line3")}
            </motion.h1>
          </motion.div>

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-lg md:text-xl lg:text-2xl text-muted-foreground mb-8 md:mb-12 max-w-3xl mx-auto text-pretty px-4"
          >
            <MixedTypographyText>{t("hero.subtitle")}</MixedTypographyText>
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
              data-magnetic
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.6 }}
              />
              <span className="relative z-10">{t("hero.ctaStart")}</span>
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
              <span className="relative z-10">{t("hero.ctaPortfolio")}</span>
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

      <ProjectsSection />
      <ServicesSection />
      <AboutSection />

      <ContactSection />

      {/* Global Footer */}
      <footer className="bg-card/10 border-t border-border/20 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Left: Logo + Brand */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                <Image
                  src={buildImageKitUrl("/prodigy%20corp/Logo/prodigy-corp-logo-nobg-cut.png", [
                    "w-96",
                    "q-90",
                    "f-auto",
                    "dpr-2",
                    "cm-maintain_ratio",
                  ])}
                  alt="Prodigy Corp"
                  width={48}
                  height={48}
                />
              </div>
              <div>
                <p className="font-heading font-bold text-xl text-foreground">Prodigy Corp</p>
                <p className="text-sm text-muted-foreground">{t("footer.tagline")}</p>
              </div>
            </div>

            {/* Right: Follow Us + Social Icons */}
            <div className="flex items-center gap-4">
              <p className="text-base text-muted-foreground">{t("contact.social.followUs")}</p>
              <div className="flex gap-3">
                {[
                  { name: t("contact.social.platforms.x"), icon: <XIcon />, href: "https://x.com/prodigy_corp" },
                  {
                    name: t("contact.social.platforms.instagram"),
                    icon: <InstagramIcon />,
                    href: "https://www.instagram.com/prodigy_corp/",
                  },
                  {
                    name: t("contact.social.platforms.facebook"),
                    icon: <FacebookIcon />,
                    href: "https://www.facebook.com/prodigycorp.io/",
                  },
                ].map((social, index) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{
                      scale: 1.12,
                      boxShadow: "0 0 20px oklch(0.65 0.25 285 / 0.25)",
                    }}
                    className="w-11 h-11 bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl flex items-center justify-center text-foreground hover:border-primary/50 hover:bg-primary/10 transition-all duration-300"
                    data-magnetic
                    aria-label={social.name}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
