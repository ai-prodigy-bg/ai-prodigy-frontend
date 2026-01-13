"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useTranslation } from "../../lib/translations"
import LoadingCat from "../LoadingCat"

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true)
  const { t } = useTranslation()

  useEffect(() => {
    // Hide LCP image IMMEDIATELY - do this first thing
    const hideLcp = () => {
      const lcpImage = document.getElementById('lcp-image')
      if (lcpImage) {
        lcpImage.style.display = 'none'
        lcpImage.style.visibility = 'hidden'
        lcpImage.style.opacity = '0'
      }
    }
    
    // Hide immediately
    hideLcp()
    
    // Also hide on next frame to be sure
    requestAnimationFrame(hideLcp)

    const timer = setTimeout(() => {
      setIsLoading(false)
      hideLcp()
    }, 3000)

    return () => {
      clearTimeout(timer)
      hideLcp()
    }
  }, [])

  if (!isLoading) return null

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.8, delay: 2.5 }}
      className="fixed inset-0 bg-background z-[100] flex items-center justify-center"
      onAnimationComplete={() => setIsLoading(false)}
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
