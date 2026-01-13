"use client"

import { motion } from "framer-motion"
import { getLoadingCatImageSrcSet } from "../lib/utils/imagekit"

// ImageKit URL for the cat logo with transformations
const IMAGEKIT_BASE_URL = "/prodigy%20corp/Logo/prodigy-corp-logo-nobg-cut.png"

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
  // Tailwind sizes: sm=48px, md=80px, lg=112px, xl=176px (w-44 = 176px)
  // On mobile, xl might display smaller, so we use responsive images
  const sizeConfig = {
    sm: { 
      container: "w-16 h-16", 
      image: "w-12 h-12",
      displaySize: 48,  // w-12 = 48px
      imageWidth: 96,   // 1x fallback
      imageHeight: 96,
      text: "text-sm" 
    },
    md: { 
      container: "w-24 h-24", 
      image: "w-20 h-20",
      displaySize: 80,  // w-20 = 80px
      imageWidth: 160,  // 1x fallback
      imageHeight: 160,
      text: "text-base" 
    },
    lg: { 
      container: "w-32 h-32", 
      image: "w-28 h-28",
      displaySize: 112, // w-28 = 112px
      imageWidth: 176, // 1x fallback
      imageHeight: 176,
      text: "text-lg" 
    },
    xl: { 
      container: "w-48 h-48", 
      image: "w-44 h-44",
      displaySize: 176, // w-44 = 176px (but may display smaller on mobile)
      imageWidth: 308, // Mobile fallback (matches audit: 308x308 on mobile)
      imageHeight: 308,
      text: "text-xl" 
    }
  }

  const config = sizeConfig[size]

  // Generate responsive srcset for the image
  const srcSet = getLoadingCatImageSrcSet(IMAGEKIT_BASE_URL, config.displaySize, 80)
  const srcSetString = srcSet.map((item: { src: string; width: number; descriptor: string }) => `${item.src} ${item.descriptor}`).join(', ')
  
  // Fallback src (1x DPI)
  const fallbackSrc = srcSet[0]?.src || ''

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
            src={fallbackSrc}
            srcSet={srcSetString}
            alt="Loading..."
            className="w-full h-full object-contain"
            loading="eager"
            fetchPriority="high"
            width={config.imageWidth}
            height={config.imageHeight}
            sizes={size === 'xl' 
              ? "(max-width: 640px) 308px, 176px"  // xl: 308px on mobile, 176px on desktop
              : size === 'lg'
              ? "(max-width: 640px) 112px, 112px"   // lg: 112px everywhere
              : `${config.displaySize}px`           // sm/md: fixed size
            }
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
