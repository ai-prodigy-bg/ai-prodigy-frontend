"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { motion, useInView, useScroll, AnimatePresence } from "framer-motion"
import { DotGrid, NeuroNoise } from "@paper-design/shaders-react"
// ImageKit transformation utilities
const IMAGEKIT_URL_ENDPOINT = "https://ik.imagekit.io/ts59gf2ul"

function buildImageKitUrl(src: string, transformations: string[]): string {
  if (!src || src.startsWith('/placeholder')) return src
  const transformationString = transformations.join(',')
  return `${IMAGEKIT_URL_ENDPOINT}/tr:${transformationString}${src}`
}

// Responsive image transformations for different screen sizes
function getResponsiveImageTransformations(): string[] {
  return [
    "w-400", // Set width to 400px
    "h-auto", // Let height adjust automatically to maintain aspect ratio
    "q-90", // High quality (90%)
    "f-auto", // Auto format (WebP when supported)
    "cm-maintain_ratio" // Maintain original aspect ratio without padding
  ]
}

function LiquidCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)
  const [magneticTarget, setMagneticTarget] = useState<HTMLElement | null>(null)

  useEffect(() => {
    const cursor = cursorRef.current
    if (!cursor) return

    let mouseX = 0
    let mouseY = 0

    const moveCursor = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY

      // Magnetic attraction effect
      if (magneticTarget) {
        const rect = magneticTarget.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        const distance = Math.sqrt(Math.pow(mouseX - centerX, 2) + Math.pow(mouseY - centerY, 2))

        if (distance < 100) {
          const strength = Math.max(0, 1 - distance / 100)
          const attractX = centerX + (mouseX - centerX) * (1 - strength * 0.3)
          const attractY = centerY + (mouseY - centerY) * (1 - strength * 0.3)
          cursor.style.left = attractX + "px"
          cursor.style.top = attractY + "px"
          return
        }
      }

      cursor.style.left = mouseX + "px"
      cursor.style.top = mouseY + "px"
    }

    const handleMouseEnter = (e: Event) => {
      setIsHovering(true)
      const target = e.target as HTMLElement
      if (target.hasAttribute("data-magnetic")) {
        setMagneticTarget(target)
      }
    }

    const handleMouseLeave = () => {
      setIsHovering(false)
      setMagneticTarget(null)
    }

    document.addEventListener("mousemove", moveCursor)

    // Add hover effects to interactive elements
    const interactiveElements = document.querySelectorAll("button, a, [data-magnetic]")
    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", handleMouseEnter)
      el.addEventListener("mouseleave", handleMouseLeave)
    })

    return () => {
      document.removeEventListener("mousemove", moveCursor)
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

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (!isLoading) return null

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.5, delay: 1.5 }}
      className="fixed inset-0 bg-background z-[100] flex items-center justify-center"
      onAnimationComplete={() => setIsLoading(false)}
    >
      <div className="text-center">
        <motion.div
          className="font-heading font-bold text-4xl md:text-6xl mb-8 text-primary"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        >
          Prodigy Labs
        </motion.div>

        <motion.div
          className="flex justify-center gap-2"
          animate={{
            opacity: [0.3, 1, 0.3],
          }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
        >
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="w-3 h-3 bg-primary rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                delay: i * 0.2,
                repeat: Number.POSITIVE_INFINITY,
              }}
            />
          ))}
        </motion.div>
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

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener("scroll", toggleVisibility)
    return () => window.removeEventListener("scroll", toggleVisibility)
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
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    </motion.button>
  )
}

function MagneticElements() {
  useEffect(() => {
    const magneticElements = document.querySelectorAll("[data-magnetic]")

    const handleMouseMove = (e: MouseEvent) => {
      const element = e.currentTarget as HTMLElement
      const rect = element.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2

      const distance = Math.sqrt(x * x + y * y)
      const maxDistance = 50

      if (distance < maxDistance) {
        const strength = (maxDistance - distance) / maxDistance
        const moveX = x * strength * 0.3
        const moveY = y * strength * 0.3
        element.style.transform = `translate(${moveX}px, ${moveY}px)`
      }
    }

    const handleMouseLeave = (e: MouseEvent) => {
      const element = e.currentTarget as HTMLElement
      element.style.transform = "translate(0px, 0px)"
    }

    magneticElements.forEach((element) => {
      element.addEventListener("mousemove", handleMouseMove)
      element.addEventListener("mouseleave", handleMouseLeave)
    })

    return () => {
      magneticElements.forEach((element) => {
        element.removeEventListener("mousemove", handleMouseMove)
        element.removeEventListener("mouseleave", handleMouseLeave)
      })
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

function ShaderBackground() {
  return (
    <div
      style={{
        position: "fixed",
        width: "100%",
        height: "100%",
        backgroundColor: "#0a0f1e", // A deep, corporate navy blue
        overflow: "hidden",
        zIndex: -10,
      }}
    >
      {/* Base Layer: The Architectural Blueprint */}
      <DotGrid
        colors={["#0a0f1e", "#1a2a47"]} // Barely visible dots for a subtle grid
        scale={0.2}
        speed={0} // The foundation is static and stable
        style={{ position: "absolute", width: "100%", height: "100%" }}
      />
      {/* Top Layer: The Flow of Ideas & Data */}
      <NeuroNoise
        colors={["#FFFFFF", "#4A90E2", "#00000000"]} // White, tech-blue, and fading trails
        scale={2.0}
        speed={0.15} // A deliberate, confident pace
        style={{ position: "absolute", width: "100%", height: "100%", opacity: 0.6 }}
      />
    </div>
  )
}

function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 p-4 md:p-6"
    >
        <div className="flex justify-between items-center max-w-7xl mx-auto px-6 py-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="font-heading font-bold text-xl md:text-2xl text-primary drop-shadow-lg"
            data-magnetic
          >
            Prodigy Labs
          </motion.div>

          <div className="hidden md:flex gap-4 lg:gap-8">
            {["Projects", "Services", "About", "Contact"].map((item, index) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
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
                {item}
                <motion.div
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary origin-left"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.a>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-foreground p-2 drop-shadow-sm"
            data-magnetic
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
                {["Projects", "Services", "About", "Contact"].map((item, index) => (
                  <motion.a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={(e) => {
                      setIsMobileMenuOpen(false)
                      // Small delay to ensure menu closes before scrolling
                      setTimeout(() => {
                        const element = document.querySelector(`#${item.toLowerCase()}`)
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
                    {item}
                  </motion.a>
                ))}
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
    <>
      {words.map((word, index) => (
        <motion.span
          key={index}
          className={isClient && index === highlightIndex ? "font-heading font-bold text-primary" : ""}
          animate={
            isClient && index === highlightIndex
              ? {
                  scale: [1, 1.05, 1],
                  color: ["oklch(0.7 0 0)", "oklch(0.65 0.25 285)", "oklch(0.6 0.2 160)", "oklch(0.7 0 0)"],
                  textShadow: [
                    "0 0 20px oklch(0.65 0.25 285 / 0.5)",
                    "0 0 30px oklch(0.7 0.25 340 / 0.5)",
                    "0 0 25px oklch(0.6 0.2 160 / 0.5)",
                    "0 0 20px oklch(0.65 0.25 285 / 0.5)",
                  ],
                }
              : {}
          }
          transition={{ duration: 0.5 }}
        >
          {word}
          {index < words.length - 1 ? " " : ""}
        </motion.span>
      ))}
    </>
  )
}

function ProjectCard({
  title,
  description,
  category,
  image,
  index,
  url,
}: {
  title: string
  description: string
  category: string
  image: string
  index: number
  url?: string
}) {
  const [isHovering, setIsHovering] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    setMousePosition({ x, y })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className="group relative"
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
        onClick={() => url && window.open(url, '_blank')}
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
              src={buildImageKitUrl(image || "/placeholder.svg", getResponsiveImageTransformations())}
              alt={title}
              className="w-full h-auto object-cover rounded-t-lg"
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
    </motion.div>
  )
}

function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })

  const digitalAssets = [
    {
      title: "Mr imot",
      description: "Advanced real estate platform connecting buyers with verified developers. Interactive map search for off-plan and new construction projects.",
      category: "Real Estate Platform",
      image: "/prodigy corp/288shots_so.png",
      url: "https://www.mrimot.com/",
    },
  ]

  const clientSuccessStories = [
    {
      title: "teramedbio",
      description: "High-converting wellness website that scaled to 20,000+ monthly organic visitors. Advanced booking integration and lightning-fast 2-day delivery.",
      category: "Healthcare Website",
      image: "/prodigy corp/88shots_so.png",
      url: "https://teramedbio.com/",
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
            Our Portfolio
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty px-4"
          >
            Explore our digital assets and client success stories that showcase innovation and excellence.
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
            Our Digital Assets
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
            Client Success Stories
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

function MorphingNavigation({
  categories,
  activeCategory,
  onCategoryChange,
}: {
  categories: string[]
  activeCategory: string
  onCategoryChange: (category: string) => void
}) {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)

  return (
    <div className="relative flex justify-center mb-12">
      {/* SVG Filter for gooey effect */}
      <svg className="absolute inset-0 pointer-events-none" style={{ filter: "url(#gooey)" }}>
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

      <div className="flex gap-2 p-2 bg-card/30 backdrop-blur-sm rounded-2xl border border-border/50 relative">
        {/* Morphing background blob */}
        <motion.div
          className="absolute inset-0 bg-primary/20 rounded-2xl"
          animate={{
            x: categories.indexOf(activeCategory) * 140 + 8,
            width: 124,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          style={{ filter: "url(#gooey)" }}
        />

        {categories.map((category, index) => (
          <motion.button
            key={category}
            onClick={() => onCategoryChange(category)}
            onMouseEnter={() => setHoveredCategory(category)}
            onMouseLeave={() => setHoveredCategory(null)}
            className={`relative z-10 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
              activeCategory === category ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            data-magnetic
          >
            <motion.span
              animate={
                hoveredCategory === category || activeCategory === category
                  ? {
                      textShadow: "0 0 20px oklch(0.65 0.25 285 / 0.5)",
                    }
                  : {}
              }
            >
              {category}
            </motion.span>

            {/* Morphing hover effect */}
            {hoveredCategory === category && activeCategory !== category && (
              <motion.div
                className="absolute inset-0 bg-primary/10 rounded-xl"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{ filter: "url(#gooey)" }}
              />
            )}
          </motion.button>
        ))}
      </div>
    </div>
  )
}

function ServiceCard({
  title,
  description,
  features,
  icon,
  index,
}: {
  title: string
  description: string
  features: string[]
  icon: React.ReactNode
  index: number
}) {
  const [isHovering, setIsHovering] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        type: "spring",
        stiffness: 100,
        damping: 20,
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className="group relative"
      data-magnetic
    >
      <motion.div
        animate={isHovering ? { y: -10, scale: 1.02 } : { y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 h-full relative overflow-hidden"
      >
        {/* Morphing background effect */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: "radial-gradient(circle at center, oklch(0.65 0.25 285 / 0.1), transparent 70%)",
            filter: "url(#gooey)",
          }}
        />

        {/* Icon with morphing effect */}
        <motion.div
          className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mb-6 relative"
          animate={
            isHovering
              ? {
                  scale: 1.1,
                  borderRadius: ["16px", "24px", "16px"],
                }
              : { scale: 1 }
          }
          transition={{ duration: 0.3 }}
          style={{ filter: "url(#gooey)" }}
        >
          <motion.div
            animate={
              isHovering
                ? {
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.1, 1],
                  }
                : {}
            }
            transition={{ duration: 0.5 }}
            className="text-primary"
          >
            {icon}
          </motion.div>
        </motion.div>

        <motion.h3
          className="font-heading font-bold text-2xl mb-4 text-foreground"
          animate={
            isHovering
              ? {
                  color: "oklch(0.65 0.25 285)",
                  textShadow: "0 0 20px oklch(0.65 0.25 285 / 0.3)",
                }
              : {}
          }
        >
          {title}
        </motion.h3>

        <motion.p
          className="text-muted-foreground mb-6 text-pretty"
          animate={isHovering ? { y: -2 } : { y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {description}
        </motion.p>

        <div className="space-y-3">
          {features.map((feature, featureIndex) => (
            <motion.div
              key={feature}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 + featureIndex * 0.05 }}
              className="flex items-center gap-3"
            >
              <motion.div
                className="w-2 h-2 bg-primary rounded-full"
                animate={
                  isHovering
                    ? {
                        scale: [1, 1.5, 1],
                        opacity: [0.7, 1, 0.7],
                      }
                    : {}
                }
                transition={{
                  duration: 1,
                  delay: featureIndex * 0.1,
                  repeat: isHovering ? Number.POSITIVE_INFINITY : 0,
                }}
              />
              <span className="text-sm text-muted-foreground">{feature}</span>
            </motion.div>
          ))}
        </div>

        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            boxShadow: "0 0 50px oklch(0.65 0.25 285 / 0.1), inset 0 0 50px oklch(0.65 0.25 285 / 0.05)",
          }}
        />
      </motion.div>
    </motion.div>
  )
}

function ServicesSection() {
  const [activeService, setActiveService] = useState("Apps")
  const [isInView, setIsInView] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setIsInView(entry.isIntersecting), { threshold: 0.3 })
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const services = {
    Apps: [
      {
        title: "Mobile Applications",
        description: "Native iOS and Android apps with cutting-edge features and seamless user experiences.",
        features: ["Cross-platform development", "Real-time synchronization", "Advanced analytics"],
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
        title: "Web Applications",
        description: "Progressive web apps that deliver native-like experiences across all devices.",
        features: ["Offline functionality", "Push notifications", "App store deployment"],
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
        title: "Desktop Applications",
        description: "Cross-platform desktop solutions with native performance and modern interfaces.",
        features: ["Multi-platform support", "Native integrations", "Auto-updates"],
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
        title: "Corporate Websites",
        description: "Professional websites that establish credibility and drive business growth.",
        features: ["SEO optimization", "Content management", "Analytics integration"],
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
        title: "E-commerce Platforms",
        description: "Scalable online stores with advanced features and seamless checkout experiences.",
        features: ["Payment integration", "Inventory management", "Customer analytics"],
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
        title: "Portfolio Websites",
        description: "Stunning portfolios that showcase your work and attract ideal clients.",
        features: ["Interactive galleries", "Contact forms", "Social integration"],
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
        title: "Digital Strategy",
        description: "Comprehensive digital transformation strategies tailored to your business goals.",
        features: ["Market analysis", "Technology roadmap", "ROI optimization"],
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
        title: "UI/UX Design",
        description: "User-centered design that creates intuitive and engaging digital experiences.",
        features: ["User research", "Prototyping", "Usability testing"],
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
        title: "Technical Consulting",
        description: "Expert guidance on technology choices, architecture, and implementation strategies.",
        features: ["Architecture review", "Performance optimization", "Security audit"],
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
            Our Services
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty"
          >
            From concept to deployment, we offer comprehensive digital solutions that transform your vision into
            reality.
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

function AnimatedAvatar({
  name,
  role,
  index,
}: {
  name: string
  role: string
  index: number
}) {
  const [isHovering, setIsHovering] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 50 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        type: "spring",
        stiffness: 100,
        damping: 20,
      }}
      viewport={{ once: true, margin: "-50px" }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className="group relative"
      data-magnetic
    >
      <motion.div
        animate={isHovering ? { y: -10, scale: 1.05 } : { y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="text-center"
      >
        {/* Animated SVG Avatar */}
        <motion.div
          className="w-32 h-32 mx-auto mb-4 relative"
          animate={isHovering ? { rotate: [0, 5, -5, 0] } : {}}
          transition={{ duration: 0.5 }}
        >
          <motion.svg
            width="128"
            height="128"
            viewBox="0 0 128 128"
            className="w-full h-full"
            animate={isHovering ? { scale: 1.1 } : { scale: 1 }}
          >
            {/* Background circle with gradient */}
            <motion.circle
              cx="64"
              cy="64"
              r="60"
              fill="url(#avatarGradient)"
              animate={
                isHovering
                  ? {
                      r: [60, 65, 60],
                    }
                  : {}
              }
              transition={{ duration: 0.5 }}
            />

            {/* Face */}
            <motion.circle
              cx="64"
              cy="50"
              r="25"
              fill="oklch(0.8 0.1 285)"
              animate={
                isHovering
                  ? {
                      cy: [50, 48, 50],
                    }
                  : {}
              }
              transition={{ duration: 0.8, repeat: isHovering ? Number.POSITIVE_INFINITY : 0 }}
            />

            {/* Eyes */}
            <motion.circle
              cx="58"
              cy="45"
              r="2"
              fill="oklch(0.2 0 0)"
              animate={
                isHovering
                  ? {
                      scale: [1, 1.2, 1],
                    }
                  : {}
              }
              transition={{ duration: 0.3 }}
            />
            <motion.circle
              cx="70"
              cy="45"
              r="2"
              fill="oklch(0.2 0 0)"
              animate={
                isHovering
                  ? {
                      scale: [1, 1.2, 1],
                    }
                  : {}
              }
              transition={{ duration: 0.3, delay: 0.1 }}
            />

            {/* Mouth */}
            <motion.path
              d="M 58 52 Q 64 58 70 52"
              stroke="oklch(0.2 0 0)"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              animate={
                isHovering
                  ? {
                      d: ["M 58 52 Q 64 58 70 52", "M 58 52 Q 64 60 70 52", "M 58 52 Q 64 58 70 52"],
                    }
                  : {}
              }
              transition={{ duration: 0.5 }}
            />

            {/* Body */}
            <motion.rect
              x="44"
              y="75"
              width="40"
              height="35"
              rx="20"
              fill="oklch(0.65 0.25 285)"
              animate={
                isHovering
                  ? {
                      height: [35, 38, 35],
                    }
                  : {}
              }
              transition={{ duration: 0.6 }}
            />

            {/* Floating particles around avatar */}
            {[...Array(6)].map((_, i) => {
              const positions = [
                { x: 109, y: 64, animX: 115, animY: 58 },
                { x: 87, y: 103, animX: 91, animY: 109 },
                { x: 41, y: 103, animX: 37, animY: 109 },
                { x: 19, y: 64, animX: 13, animY: 58 },
                { x: 41, y: 25, animX: 37, animY: 19 },
                { x: 87, y: 25, animX: 91, animY: 19 }
              ];
              const pos = positions[i] || { x: 64, y: 64, animX: 64, animY: 64 };
              
              return (
                <motion.circle
                  key={i}
                  cx={pos.x}
                  cy={pos.y}
                  r="2"
                  fill="oklch(0.65 0.25 285)"
                  opacity="0.6"
                  animate={
                    isHovering
                      ? {
                          r: [2, 4, 2],
                          opacity: [0.6, 1, 0.6],
                          cx: pos.animX,
                          cy: pos.animY,
                        }
                      : {}
                  }
                  transition={{
                    duration: 2,
                    delay: i * 0.1,
                    repeat: isHovering ? Number.POSITIVE_INFINITY : 0,
                  }}
                />
              );
            })}

            <defs>
              <linearGradient id="avatarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="oklch(0.65 0.25 285)" stopOpacity="0.2" />
                <stop offset="100%" stopColor="oklch(0.7 0.25 340)" stopOpacity="0.4" />
              </linearGradient>
            </defs>
          </motion.svg>

          {/* Glow effect */}
          <motion.div
            className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              boxShadow: "0 0 40px oklch(0.65 0.25 285 / 0.3)",
            }}
          />
        </motion.div>

        <motion.h3
          className="font-heading font-bold text-xl mb-2 text-foreground"
          animate={
            isHovering
              ? {
                  color: "oklch(0.65 0.25 285)",
                  textShadow: "0 0 20px oklch(0.65 0.25 285 / 0.3)",
                }
              : {}
          }
        >
          {name}
        </motion.h3>

        <motion.p
          className="text-muted-foreground"
          animate={isHovering ? { y: -2 } : { y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {role}
        </motion.p>
      </motion.div>
    </motion.div>
  )
}

function StatCounter({
  value,
  label,
  suffix = "",
  index,
}: {
  value: number
  label: string
  suffix?: string
  index: number
}) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Use Intersection Observer to detect when stat comes into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true)
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [isVisible])

  // Animation effect
  useEffect(() => {
    if (isVisible) {
      const startDelay = index * 300 // Stagger by 300ms

      const timer = setTimeout(() => {
        const duration = 2000 // 2 seconds total
        const steps = 60 // 60 steps
        const increment = value / steps
        let current = 0
        let step = 0

        const counter = setInterval(() => {
          step++
          current += increment

          if (step >= steps) {
            setCount(value)
            clearInterval(counter)
          } else {
            setCount(Math.floor(current))
          }
        }, duration / steps)

        return () => clearInterval(counter)
      }, startDelay)

      return () => clearTimeout(timer)
    }
  }, [isVisible, value, index])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="text-center"
    >
      <motion.div
        className="font-heading font-bold text-4xl md:text-5xl mb-2 text-primary"
        animate={
          isVisible
            ? {
                textShadow: [
                  "0 0 20px oklch(0.65 0.25 285 / 0.3)",
                  "0 0 30px oklch(0.65 0.25 285 / 0.5)",
                  "0 0 20px oklch(0.65 0.25 285 / 0.3)",
                ],
              }
            : {}
        }
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
      >
        {count}
        {suffix}
      </motion.div>
      <p className="text-muted-foreground">{label}</p>
    </motion.div>
  )
}

function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })

  const teamMembers = [
    { name: "Alex Chen", role: "Founder & CEO" },
    { name: "Sarah Kim", role: "Lead Designer" },
    { name: "Marcus Johnson", role: "Tech Director" },
    { name: "Elena Rodriguez", role: "Product Manager" },
    { name: "David Park", role: "Full-Stack Developer" },
    { name: "Maya Patel", role: "AI Specialist" },
  ]

  const stats = [
    { value: 2, label: "Projects Completed", suffix: "+" },
    { value: 1, label: "Happy Clients", suffix: "+" },
    { value: 1, label: "Years Experience", suffix: "+" },
    { value: 100, label: "Success Rate", suffix: "%" },
  ]

  return (
    <section ref={sectionRef} id="about" className="min-h-screen py-20 px-6 relative">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.h2
            className="font-heading font-bold text-5xl md:text-7xl mb-6 text-balance"
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
            About Prodigy Labs
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-muted-foreground max-w-4xl mx-auto text-pretty"
          >
            Speed and value drive everything we do. We leverage AI to build exceptional digital products faster and more affordably, turning ambitious ideas into reality without the traditional agency overhead.
          </motion.p>
        </motion.div>

        {/* Company story */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-16 md:mb-20 items-center"
        >
          <div className="px-4 md:px-0">
            <motion.h3
              className="font-heading font-bold text-2xl md:text-3xl lg:text-4xl mb-4 md:mb-6 text-foreground"
              animate={
                isInView
                  ? {
                      color: ["oklch(0.98 0 0)", "oklch(0.65 0.25 285)", "oklch(0.98 0 0)"],
                    }
                  : {}
              }
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
            >
              Our Story
            </motion.h3>
            <motion.p
              className="text-muted-foreground text-lg mb-6 text-pretty"
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Founded in 2025, Prodigy Labs started with a focused mission: build and acquire profitable digital assets. We were product builders first, creating our own platforms and scaling them in competitive markets.
              <br /><br />
              But something unexpected happened. As we developed our portfolio, other entrepreneurs and businesses took notice. They wanted to know how we built products so efficiently and scaled them so quickly. Word spread, and soon we found ourselves fielding requests to build custom solutions for others.
              <br /><br />
              That's when we realized we had something special—a lean, technology-first approach that delivers results without the bloat of traditional agencies. We use the same AI-powered workflows and rapid development methods for client projects that we use for our own successful ventures.
            </motion.p>
            <motion.p
              className="text-muted-foreground text-lg text-pretty"
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              Today, we operate as both product builders and strategic partners. Our portfolio gives us real market insights, while our client work keeps us sharp and innovative. This dual perspective means we understand what actually works—not just what looks good in a presentation.
            </motion.p>
          </div>

          {/* Animated illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, delay: 0.5 }}
            className="relative"
          >
            <motion.svg
              width="400"
              height="300"
              viewBox="0 0 400 300"
              className="w-full h-auto"
              animate={{
                rotate: [0, 1, -1, 0],
              }}
              transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            >
              {/* Background shapes */}
              <motion.circle
                cx="200"
                cy="150"
                r="120"
                fill="oklch(0.65 0.25 285)"
                opacity="0.1"
                animate={{
                  r: [120, 130, 120],
                  opacity: [0.1, 0.2, 0.1],
                }}
                transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
              />

              {/* Central hub */}
              <motion.circle
                cx="200"
                cy="150"
                r="30"
                fill="oklch(0.65 0.25 285)"
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              />

              {/* Connecting nodes */}
              {[...Array(6)].map((_, i) => {
                const positions = [
                  { x: 280, y: 150 }, // 0°
                  { x: 240, y: 80.72 }, // 60°
                  { x: 160, y: 80.72 }, // 120°
                  { x: 120, y: 150 }, // 180°
                  { x: 160, y: 219.28 }, // 240°
                  { x: 240, y: 219.28 } // 300°
                ];
                const pos = positions[i] || { x: 200, y: 150 };
                const x = pos.x;
                const y = pos.y;

                return (
                  <g key={i}>
                    <motion.line
                      x1="200"
                      y1="150"
                      x2={x}
                      y2={y}
                      stroke="oklch(0.65 0.25 285)"
                      strokeWidth="2"
                      opacity="0.6"
                      animate={{
                        opacity: [0.6, 1, 0.6],
                      }}
                      transition={{
                        duration: 2,
                        delay: i * 0.2,
                        repeat: Number.POSITIVE_INFINITY,
                      }}
                    />
                    <motion.circle
                      cx={x}
                      cy={y}
                      r="15"
                      fill="oklch(0.7 0.25 340)"
                      animate={{
                        r: [15, 20, 15],
                        fill: ["oklch(0.7 0.25 340)", "oklch(0.6 0.2 160)", "oklch(0.7 0.25 340)"],
                      }}
                      transition={{
                        duration: 3,
                        delay: i * 0.3,
                        repeat: Number.POSITIVE_INFINITY,
                      }}
                    />
                  </g>
                )
              })}

              {/* Floating particles */}
              {[...Array(12)].map((_, i) => (
                <motion.circle
                  key={i}
                  cx={50 + ((i * 30) % 300)}
                  cy={50 + Math.floor(i / 10) * 200}
                  r="3"
                  fill="oklch(0.65 0.25 285)"
                  opacity="0.4"
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0.4, 0.8, 0.4],
                    scale: [1, 1.5, 1],
                  }}
                  transition={{
                    duration: 3 + i * 0.2,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: i * 0.1,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </motion.svg>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-16 md:mb-20"
        >
          {stats.map((stat, index) => (
            <StatCounter key={stat.label} value={stat.value} label={stat.label} suffix={stat.suffix} index={index} />
          ))}
        </motion.div>

        {/* Team section - Commented out for now as I'm working alone */}
        {/* 
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mb-12 md:mb-16 px-4"
        >
          <motion.h3
            className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl mb-4 md:mb-6 text-foreground"
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

export default function HomePage() {
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
              Premium<br/>
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
                Digital Products
              </motion.span><br/>
              Powered by AI
            </motion.h1>
          </motion.div>

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-lg md:text-xl lg:text-2xl text-muted-foreground mb-8 md:mb-12 max-w-3xl mx-auto text-pretty px-4"
          >
            <MixedTypographyText>
              Leveraging AI to build faster, smarter, and more cost-effectively for both our clients and our portfolio.
            </MixedTypographyText>
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
              <span className="relative z-10">Get Started</span>
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
              <span className="relative z-10">What We've Built</span>
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
    </main>
  )
}

function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    project: "",
    message: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
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
            { left: 40, top: 35 }
          ];
          const pos = positions[i] || { left: 50, top: 50 };
          
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
                x: [0, (i % 2 === 0 ? 30 : -30), 0],
                y: [0, (i % 3 === 0 ? 40 : -40), 0],
              }}
              transition={{
                duration: 4 + (i * 0.2),
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.5,
                ease: "easeInOut",
              }}
            />
          );
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
                "linear-gradient(45deg, oklch(0.65 0.25 285), oklch(0.7 0.25 340))",
                "linear-gradient(45deg, oklch(0.7 0.25 340), oklch(0.6 0.2 160))",
                "linear-gradient(45deg, oklch(0.6 0.2 160), oklch(0.65 0.25 285))",
                "linear-gradient(45deg, oklch(0.65 0.25 285), oklch(0.7 0.25 340))",
              ],
            }}
            transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            style={{
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            Let's Create Something
            <br />
            <motion.span
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              className="inline-block"
            >
              Extraordinary
            </motion.span>
          </motion.h2>
          <p className="text-xl md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty px-4">
            Ready to transform your vision into reality? Let's discuss your next groundbreaking project.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 md:p-8 relative overflow-hidden">
              {/* Magnetic Form Background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 rounded-2xl"
                animate={{
                  background: [
                    "radial-gradient(circle at 20% 20%, oklch(0.65 0.25 285 / 0.1), transparent 50%)",
                    "radial-gradient(circle at 80% 80%, oklch(0.7 0.25 340 / 0.1), transparent 50%)",
                    "radial-gradient(circle at 50% 50%, oklch(0.6 0.2 160 / 0.1), transparent 50%)",
                    "radial-gradient(circle at 20% 20%, oklch(0.65 0.25 285 / 0.1), transparent 50%)",
                  ],
                }}
                transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              />

              <form className="space-y-6 relative z-10">
                <div className="grid sm:grid-cols-2 gap-6">
                  <motion.div whileHover={{ scale: 1.02 }} whileFocus={{ scale: 1.02 }} className="relative">
                    <motion.input
                      type="text"
                      name="name"
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full bg-background/50 border border-border/50 rounded-xl px-4 py-3 md:py-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 min-h-[48px]"
                      whileFocus={{
                        boxShadow: "0 0 20px oklch(0.65 0.25 285 / 0.3)",
                        borderColor: "oklch(0.65 0.25 285)",
                      }}
                      data-magnetic
                    />
                    <motion.div
                      className="absolute inset-0 rounded-xl border-2 border-primary/50 pointer-events-none"
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileFocus={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.02 }} whileFocus={{ scale: 1.02 }} className="relative">
                    <motion.input
                      type="email"
                      name="email"
                      placeholder="Your Email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-background/50 border border-border/50 rounded-xl px-4 py-3 md:py-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 min-h-[48px]"
                      whileFocus={{
                        boxShadow: "0 0 20px oklch(0.65 0.25 285 / 0.3)",
                        borderColor: "oklch(0.65 0.25 285)",
                      }}
                      data-magnetic
                    />
                    <motion.div
                      className="absolute inset-0 rounded-xl border-2 border-primary/50 pointer-events-none"
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileFocus={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  </motion.div>
                </div>

                <motion.div whileHover={{ scale: 1.02 }} whileFocus={{ scale: 1.02 }} className="relative">
                  <motion.select
                    name="project"
                    value={formData.project}
                    onChange={handleInputChange}
                    className="w-full bg-background/50 border border-border/50 rounded-xl px-4 py-3 md:py-4 text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 min-h-[48px]"
                    whileFocus={{
                      boxShadow: "0 0 20px oklch(0.65 0.25 285 / 0.3)",
                      borderColor: "oklch(0.65 0.25 285)",
                    }}
                    data-magnetic
                  >
                    <option value="">Select Project Type</option>
                    <option value="web-app">Web Application</option>
                    <option value="mobile-app">Mobile App</option>
                    <option value="website">Website</option>
                    <option value="ecommerce">E-commerce</option>
                    <option value="other">Other</option>
                  </motion.select>
                  <motion.div
                    className="absolute inset-0 rounded-xl border-2 border-primary/50 pointer-events-none"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileFocus={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }} whileFocus={{ scale: 1.02 }} className="relative">
                  <motion.textarea
                    name="message"
                    placeholder="Tell us about your project..."
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={5}
                    className="w-full bg-background/50 border border-border/50 rounded-xl px-4 py-3 md:py-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 resize-none min-h-[48px]"
                    whileFocus={{
                      boxShadow: "0 0 20px oklch(0.65 0.25 285 / 0.3)",
                      borderColor: "oklch(0.65 0.25 285)",
                    }}
                    data-magnetic
                  />
                  <motion.div
                    className="absolute inset-0 rounded-xl border-2 border-primary/50 pointer-events-none"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileFocus={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                </motion.div>

                <motion.button
                  type="submit"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 0 40px oklch(0.65 0.25 285 / 0.6)",
                    y: -5,
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-primary text-primary-foreground px-8 py-4 rounded-xl font-semibold text-lg hover:bg-primary/90 transition-all duration-300 relative overflow-hidden"
                  data-magnetic
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.6 }}
                  />
                  <span className="relative z-10">Send Message</span>
                </motion.button>
              </form>
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h3 className="font-heading font-bold text-3xl mb-6 text-foreground">Get in Touch</h3>
              <p className="text-lg text-muted-foreground mb-8 text-pretty">
                Ready to bring your vision to life? We're here to help you create something extraordinary.
              </p>
            </div>

            <div className="space-y-6">
              {              [
                { icon: "📧", label: "Email", value: "hello@prodigylabs.com", href: "mailto:hello@prodigylabs.com" },
                { icon: "📱", label: "Phone", value: "+359 899 520 856", href: "tel:+359899520856" },
                { icon: "📍", label: "Location", value: "Plovdiv, Bulgaria", href: "#" },
              ].map((contact, index) => (
                <motion.a
                  key={contact.label}
                  href={contact.href}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{
                    scale: 1.05,
                    x: 10,
                    boxShadow: "0 10px 30px oklch(0.65 0.25 285 / 0.2)",
                  }}
                  className="flex items-center gap-4 p-4 bg-card/30 backdrop-blur-sm border border-border/30 rounded-xl hover:border-primary/50 transition-all duration-300 group"
                  data-magnetic
                >
                  <motion.div
                    className="text-2xl"
                    whileHover={{ rotate: 360, scale: 1.2 }}
                    transition={{ duration: 0.5 }}
                  >
                    {contact.icon}
                  </motion.div>
                  <div>
                    <p className="text-sm text-muted-foreground">{contact.label}</p>
                    <p className="text-foreground font-medium group-hover:text-primary transition-colors">
                      {contact.value}
                    </p>
                  </div>
                </motion.a>
              ))}
            </div>

            {/* Social Media Links */}
            <div className="pt-8">
              <h4 className="font-semibold text-lg mb-4 text-foreground">Follow Us</h4>
              <div className="flex gap-4">
                {[
                  { name: "Twitter", icon: "🐦", href: "#" },
                  { name: "LinkedIn", icon: "💼", href: "#" },
                  { name: "GitHub", icon: "🐙", href: "#" },
                  { name: "Dribbble", icon: "🏀", href: "#" },
                ].map((social, index) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{
                      scale: 1.2,
                      rotate: 360,
                      boxShadow: "0 0 20px oklch(0.65 0.25 285 / 0.4)",
                    }}
                    className="w-12 h-12 bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl flex items-center justify-center text-xl hover:border-primary/50 hover:bg-primary/10 transition-all duration-300"
                    data-magnetic
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-3 h-3 bg-primary/20 rounded-full"
                  style={{
                    right: `${10 + i * 20}%`,
                    top: `${20 + i * 15}%`,
                  }}
                  animate={{
                    y: [0, -30, 0],
                    opacity: [0.2, 0.8, 0.2],
                    scale: [1, 1.5, 1],
                  }}
                  transition={{
                    duration: 4 + i * 0.5,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: i * 0.3,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
