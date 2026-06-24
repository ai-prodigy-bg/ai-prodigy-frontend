"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

interface StatCounterProps {
  value: number
  label: string
  suffix?: string
  index: number
}

export default function StatCounter({ value, label, suffix = "", index }: StatCounterProps) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setIsVisible(true)
    }, { threshold: 0.2 })

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return

    const timer = setTimeout(() => {
      const steps = 48
      const increment = value / steps
      let step = 0

      const counter = setInterval(() => {
        step += 1
        if (step >= steps) {
          setCount(value)
          clearInterval(counter)
          return
        }
        setCount(Math.floor(increment * step))
      }, 26)

      return () => clearInterval(counter)
    }, index * 120)

    return () => clearTimeout(timer)
  }, [index, isVisible, value])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.12 }}
      className="text-center"
    >
      <div className="text-[clamp(48px,10vw,96px)] font-normal leading-none tracking-[-0.04em] text-white">
        {count}
        {suffix}
      </div>
      <p className="mt-4 text-[13px] leading-relaxed tracking-wide text-white/40 sm:text-[15px]">{label}</p>
    </motion.div>
  )
}
