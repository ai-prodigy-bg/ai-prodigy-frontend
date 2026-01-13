"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import type React from "react"

interface ServiceCardProps {
  title: string
  description: string
  features: string[]
  icon: React.ReactNode
  index: number
}

export default function ServiceCard({
  title,
  description,
  features,
  icon,
  index,
}: ServiceCardProps) {
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
