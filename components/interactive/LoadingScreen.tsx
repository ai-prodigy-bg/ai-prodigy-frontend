"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useTranslation } from "../../lib/translations"
import LoadingCat from "../LoadingCat"

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true)
  const { t } = useTranslation()

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 3000) // Increased to 3 seconds to show the cat properly

    return () => clearTimeout(timer)
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
