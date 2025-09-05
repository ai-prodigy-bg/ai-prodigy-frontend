"use client"

import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

// ImageKit URL for the cat logo with transformations
const IMAGEKIT_BASE_URL = "https://ik.imagekit.io/ts59gf2ul/prodigy%20corp/Logo/prodigy-corp-logo-nobg-cut.png"

interface ErrorCatProps {
  title?: string
  message?: string
  showRetry?: boolean
  onRetry?: () => void
  size?: "sm" | "md" | "lg" | "xl"
}

export default function ErrorCat({ 
  title = "Oops! Something went wrong",
  message = "Don't worry, our cat is on it. Please try again.",
  showRetry = true,
  onRetry,
  size = "lg"
}: ErrorCatProps) {
  const router = useRouter()

  // Size configurations
  const sizeConfig = {
    sm: { 
      container: "w-20 h-20", 
      image: "w-16 h-16",
      imageSize: "w-256,h-256", 
      title: "text-lg",
      text: "text-sm",
      button: "px-4 py-2 text-sm"
    },
    md: { 
      container: "w-28 h-28", 
      image: "w-24 h-24",
      imageSize: "w-384,h-384", 
      title: "text-xl",
      text: "text-base",
      button: "px-5 py-2.5 text-sm"
    },
    lg: { 
      container: "w-36 h-36", 
      image: "w-32 h-32",
      imageSize: "w-512,h-512", 
      title: "text-2xl",
      text: "text-lg",
      button: "px-6 py-3 text-base"
    },
    xl: { 
      container: "w-48 h-48", 
      image: "w-44 h-44",
      imageSize: "w-704,h-704", 
      title: "text-3xl",
      text: "text-xl",
      button: "px-8 py-4 text-lg"
    }
  }

  const config = sizeConfig[size]

  // ImageKit transformations for error state cat (muted, concerned look)
  const errorCatUrl = `${IMAGEKIT_BASE_URL}?tr=${[
    config.imageSize,           // High resolution
    "q-95",                     // High quality
    "f-auto",                   // Auto format
    "cm-maintain_ratio",        // Maintain aspect ratio
    "bo-3_EF4444",             // Red border for error state
    "e-saturate:0.7",           // Slightly muted colors
    "e-contrast:0.9",           // Reduced contrast
    "e-brightness:0.9",         // Slightly darker
    "bg-transparent"            // Maintain transparency
  ].join(",")}`

  const handleRetry = () => {
    if (onRetry) {
      onRetry()
    } else {
      // Default retry behavior - refresh the page
      window.location.reload()
    }
  }

  const goHome = () => {
    router.push('/')
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
      {/* Error Cat with Effects */}
      <div className={`${config.container} relative flex items-center justify-center mb-8`}>
        {/* Error glow effect (red/orange) */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500/20 via-orange-500/20 to-red-500/20 blur-xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />

        {/* Middle glow */}
        <motion.div
          className="absolute inset-2 rounded-full bg-gradient-to-r from-red-400/25 via-orange-400/25 to-red-400/25 blur-lg"
          animate={{
            scale: [1.05, 0.95, 1.05],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />

        {/* Cat Image with Sad Animation */}
        <motion.div
          className={`${config.image} relative z-10 flex items-center justify-center`}
          animate={{
            y: [0, -2, 0],
            rotate: [-1, 1, -1],
          }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          style={{
            filter: `
              drop-shadow(0 0 6px rgba(239, 68, 68, 0.4))
              drop-shadow(0 0 12px rgba(239, 68, 68, 0.2))
              drop-shadow(0 0 18px rgba(239, 68, 68, 0.1))
            `
          }}
        >
          <img
            src={errorCatUrl}
            alt="Error"
            className="w-full h-full object-contain"
            loading="eager"
          />
        </motion.div>

        {/* Error indicator particles */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 bg-red-400 rounded-full"
            style={{
              left: `${30 + Math.cos(i * 90 * Math.PI / 180) * 50}%`,
              top: `${30 + Math.sin(i * 90 * Math.PI / 180) * 50}%`,
            }}
            animate={{
              scale: [0, 1.2, 0],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: 2.5,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.4,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Error Content */}
      <motion.div
        className="max-w-md mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {/* Error Title */}
        <h1 className={`${config.title} font-bold text-foreground mb-4`}>
          {title}
        </h1>

        {/* Error Message */}
        <p className={`${config.text} text-muted-foreground mb-8 leading-relaxed`}>
          {message}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {showRetry && (
            <motion.button
              onClick={handleRetry}
              className={`${config.button} bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Try Again
            </motion.button>
          )}

          <motion.button
            onClick={goHome}
            className={`${config.button} bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Go Home
          </motion.button>
        </div>
      </motion.div>

      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-red-500/10 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 0.3, 0],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 5,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  )
}
