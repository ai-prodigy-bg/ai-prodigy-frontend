"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useTranslation } from "../../lib/translations"
import LoadingCat from "../LoadingCat"

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true)
  const { t } = useTranslation()

  useEffect(() => {
    // Hide server-rendered LCP image when client component mounts
    const lcpImage = document.getElementById('lcp-image')
    if (lcpImage) {
      lcpImage.style.display = 'none'
    }

    // Reduced delay to 1s for better LCP - content can render behind
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => {
      clearTimeout(timer)
      // Show server-rendered LCP image again if still exists
      if (lcpImage) {
        lcpImage.style.display = ''
      }
    }
  }, [])

  if (!isLoading) return null

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="fixed inset-0 bg-background z-[100] flex items-center justify-center pointer-events-none"
      onAnimationComplete={() => setIsLoading(false)}
      style={{ willChange: 'opacity' }}
    >
      <div className="text-center">
        <LoadingCat 
          size="xl" 
          message={t('brand.name')}
          showMessage={true}
        />
      </div>
    </motion.div>
  )
}
