"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"

interface StatCounterProps {
  value: number
  label: string
  suffix?: string
  index: number
}

export default function StatCounter({
  value,
  label,
  suffix = "",
  index,
}: StatCounterProps) {
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
