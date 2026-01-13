"use client"

import { useState } from "react"
import { motion } from "framer-motion"

interface MorphingNavigationProps {
  categories: string[]
  activeCategory: string
  onCategoryChange: (category: string) => void
}

export default function MorphingNavigation({
  categories,
  activeCategory,
  onCategoryChange,
}: MorphingNavigationProps) {
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
