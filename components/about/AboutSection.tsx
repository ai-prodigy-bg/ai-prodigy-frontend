"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { useTranslation } from "../../lib/translations"
import StatCounter from "./StatCounter"

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })
  const { t, tArray } = useTranslation()

  const storyParagraphs = tArray('about.story.paragraphs')

  const stats = [
    { value: 3, label: t('about.stats.projects'), suffix: "+" },
    { value: 2, label: t('about.stats.clients'), suffix: "+" },
    { value: 1, label: t('about.stats.experience'), suffix: "+" },
    { value: 100, label: t('about.stats.successRate'), suffix: "%" },
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
            transition={{ duration: 4, repeat: isInView ? Number.POSITIVE_INFINITY : 0 }}
            style={{
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            {t('about.title')}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-muted-foreground max-w-4xl mx-auto text-pretty"
          >
            {t('about.subtitle')}
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
              {t('about.story.title')}
            </motion.h3>
            <motion.p
              className="text-muted-foreground text-lg mb-6 text-pretty"
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              {storyParagraphs[0]}
              <br /><br />
              {storyParagraphs[1]}
              <br /><br />
              {storyParagraphs[2]}
            </motion.p>
            <motion.p
              className="text-muted-foreground text-lg text-pretty"
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              {storyParagraphs[3]}
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
              transition={{ duration: 6, repeat: isInView ? Number.POSITIVE_INFINITY : 0, ease: "easeInOut" }}
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
                transition={{ duration: 4, repeat: isInView ? Number.POSITIVE_INFINITY : 0 }}
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
                transition={{ duration: 2, repeat: isInView ? Number.POSITIVE_INFINITY : 0 }}
              />

              {/* Connecting nodes */}
              {[...Array(6)].map((_, i) => {
                const positions = [
                  { x: 280, y: 150 },
                  { x: 240, y: 80.72 },
                  { x: 160, y: 80.72 },
                  { x: 120, y: 150 },
                  { x: 160, y: 219.28 },
                  { x: 240, y: 219.28 }
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
                        repeat: isInView ? Number.POSITIVE_INFINITY : 0,
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
                        repeat: isInView ? Number.POSITIVE_INFINITY : 0,
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
