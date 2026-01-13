"use client"

import { useState } from "react"
import { motion } from "framer-motion"

interface AnimatedAvatarProps {
  name: string
  role: string
  index: number
}

export default function AnimatedAvatar({
  name,
  role,
  index,
}: AnimatedAvatarProps) {
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
