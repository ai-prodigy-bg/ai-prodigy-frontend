"use client"

import { motion } from "framer-motion"

// ImageKit URL for the cat logo with transformations
const IMAGEKIT_BASE_URL = "https://ik.imagekit.io/ts59gf2ul/prodigy%20corp/Logo/prodigy-corp-logo-nobg-cut.png"

interface LoadingCatProps {
  size?: "sm" | "md" | "lg" | "xl"
  message?: string
  showMessage?: boolean
}

export default function LoadingCat({ 
  size = "lg", 
  message = "Loading...", 
  showMessage = true 
}: LoadingCatProps) {
  
  // Size configurations
  const sizeConfig = {
    sm: { 
      container: "w-16 h-16", 
      image: "w-12 h-12",
      imageSize: "w-64,h-264", 
      text: "text-sm" 
    },
    md: { 
      container: "w-24 h-24", 
      image: "w-20 h-20",
      imageSize: "w-320,h-320", 
      text: "text-base" 
    },
    lg: { 
      container: "w-32 h-32", 
      image: "w-28 h-28",
      imageSize: "w-448,h-448", 
      text: "text-lg" 
    },
    xl: { 
      container: "w-48 h-48", 
      image: "w-44 h-44",
      imageSize: "w-704,h-704", 
      text: "text-xl" 
    }
  }

  const config = sizeConfig[size]

  // ImageKit transformations for high quality cat with purple glow
  const catImageUrl = `${IMAGEKIT_BASE_URL}?tr=${[
    config.imageSize,           // High resolution
    "q-95",                     // High quality
    "f-auto",                   // Auto format
    "cm-maintain_ratio",        // Maintain aspect ratio
    "bo-4_8B5CF6",             // Purple border for glow effect
    "e-sharpen",                // Sharpen for crisp edges
    "e-contrast:1.1",           // Slight contrast boost
    "e-saturate:1.2",           // Enhanced colors
    "bg-transparent"            // Maintain transparency
  ].join(",")}`

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      {/* Loading Cat with Glow Effects */}
      <div className={`${config.container} relative flex items-center justify-center`}>
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

        {/* Cat Image with Floating Animation */}
        <motion.div
          className={`${config.image} relative z-10 flex items-center justify-center`}
          animate={{
            y: [-4, 4, -4],
            rotate: [-2, 2, -2],
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          style={{
            filter: `
              drop-shadow(0 0 8px rgba(139, 92, 246, 0.6))
              drop-shadow(0 0 16px rgba(139, 92, 246, 0.4))
              drop-shadow(0 0 24px rgba(139, 92, 246, 0.2))
            `
          }}
        >
          <img
            src={catImageUrl}
            alt="Loading..."
            className="w-full h-full object-contain"
            loading="eager"
          />
        </motion.div>

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
      {showMessage && (
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <p className={`${config.text} font-medium text-foreground/80 mb-2`}>
            {message}
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
      )}
    </div>
  )
}
