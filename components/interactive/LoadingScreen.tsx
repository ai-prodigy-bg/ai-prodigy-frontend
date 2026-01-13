"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useTranslation } from "../../lib/translations"

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true)
  const [isFading, setIsFading] = useState(false)
  const { t } = useTranslation()

  useEffect(() => {
    let removeTimer: NodeJS.Timeout | null = null

    // Start fade after 1s, then remove after fade completes
    const fadeTimer = setTimeout(() => {
      setIsFading(true)
      // Remove after CSS transition completes (500ms)
      removeTimer = setTimeout(() => {
        setIsLoading(false)
        // Hide server-rendered LCP image only after LoadingScreen is done
        const lcpImage = document.getElementById('lcp-image')
        if (lcpImage) {
          lcpImage.style.display = 'none'
        }
      }, 500)
    }, 1000)

    return () => {
      clearTimeout(fadeTimer)
      if (removeTimer) {
        clearTimeout(removeTimer)
      }
    }
  }, [])

  useEffect(() => {
    // Apply floating animation to the existing LCP image
    const lcpImage = document.getElementById('lcp-image')
    if (lcpImage && isLoading && !isFading) {
      lcpImage.classList.add('animate-lcp-float')
      
      return () => {
        if (lcpImage) {
          lcpImage.classList.remove('animate-lcp-float')
        }
      }
    }
  }, [isLoading, isFading])

  if (!isLoading) return null

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center pointer-events-none transition-opacity duration-500 ${
        isFading ? 'opacity-0' : 'opacity-100'
      }`}
      style={{ 
        willChange: 'opacity',
        backgroundColor: 'transparent'
      }}
    >
      {/* Glow effects around the LCP image */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[308px] h-[308px] md:w-[176px] md:h-[176px] pointer-events-none">
        {/* Outer glow ring */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-purple-500/20 blur-xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        
        {/* Middle glow ring */}
        <motion.div
          className="absolute inset-2 rounded-full bg-gradient-to-r from-violet-400/30 via-purple-400/30 to-violet-400/30 blur-lg"
          animate={{
            scale: [1.1, 0.9, 1.1],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 0.3,
          }}
        />

        {/* Inner glow ring */}
        <motion.div
          className="absolute inset-4 rounded-full bg-gradient-to-r from-purple-300/40 via-blue-300/40 to-purple-300/40 blur-md"
          animate={{
            scale: [0.9, 1.1, 0.9],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 1,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 0.6,
          }}
        />

        {/* Sparkle Effects */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400 rounded-full"
            style={{
              left: `${20 + Math.cos(i * 60 * Math.PI / 180) * 60}%`,
              top: `${20 + Math.sin(i * 60 * Math.PI / 180) * 60}%`,
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.3,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Loading Message */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-[calc(50%+120px)] md:translate-y-[calc(50%+100px)] text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-xl font-medium text-foreground/80 mb-2">
          {t('brand.name')}
        </p>
        
        {/* Animated dots */}
        <motion.div className="flex justify-center gap-1">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-purple-500 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}
