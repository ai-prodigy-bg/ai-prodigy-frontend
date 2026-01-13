"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

export default function LiquidCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)
  const [magneticTarget, setMagneticTarget] = useState<HTMLElement | null>(null)

  useEffect(() => {
    const cursor = cursorRef.current
    if (!cursor) return

    let mouseX = 0
    let mouseY = 0
    let rafId: number | null = null
    let cachedRect: DOMRect | null = null
    let rectCacheTime = 0
    const RECT_CACHE_DURATION = 16 // Cache rect for 16ms (60fps)

    const updateCursor = () => {
      // Magnetic attraction effect
      if (magneticTarget) {
        const now = performance.now()
        // Cache rect to avoid forced reflows
        if (!cachedRect || now - rectCacheTime > RECT_CACHE_DURATION) {
          cachedRect = magneticTarget.getBoundingClientRect()
          rectCacheTime = now
        }
        const rect = cachedRect
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        const distance = Math.sqrt(Math.pow(mouseX - centerX, 2) + Math.pow(mouseY - centerY, 2))

        if (distance < 100) {
          const strength = Math.max(0, 1 - distance / 100)
          const attractX = centerX + (mouseX - centerX) * (1 - strength * 0.3)
          const attractY = centerY + (mouseY - centerY) * (1 - strength * 0.3)
          cursor.style.left = attractX + "px"
          cursor.style.top = attractY + "px"
        } else {
          cursor.style.left = mouseX + "px"
          cursor.style.top = mouseY + "px"
        }
      } else {
        cursor.style.left = mouseX + "px"
        cursor.style.top = mouseY + "px"
      }
      rafId = null
    }

    const moveCursor = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY

      // Throttle updates using requestAnimationFrame
      if (rafId === null) {
        rafId = requestAnimationFrame(updateCursor)
      }
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
      if (rafId !== null) {
        cancelAnimationFrame(rafId)
      }
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
