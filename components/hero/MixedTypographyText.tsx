"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export default function MixedTypographyText({ children }: { children: string }) {
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
