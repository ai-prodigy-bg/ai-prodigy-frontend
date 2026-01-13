"use client"

import { useEffect, useState } from "react"
import { useTranslation } from "../../lib/translations"
import LoadingCat from "../LoadingCat"

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true)
  const [isFading, setIsFading] = useState(false)
  const { t } = useTranslation()

  useEffect(() => {
    // Hide server-rendered LCP image when client component mounts
    const lcpImage = document.getElementById('lcp-image')
    if (lcpImage) {
      lcpImage.style.display = 'none'
    }

    let removeTimer: NodeJS.Timeout | null = null

    // Start fade after 1s, then remove after fade completes
    const fadeTimer = setTimeout(() => {
      setIsFading(true)
      // Remove after CSS transition completes (500ms)
      removeTimer = setTimeout(() => {
        setIsLoading(false)
      }, 500)
    }, 1000)

    return () => {
      clearTimeout(fadeTimer)
      if (removeTimer) {
        clearTimeout(removeTimer)
      }
      // Show server-rendered LCP image again if still exists
      if (lcpImage) {
        lcpImage.style.display = ''
      }
    }
  }, [])

  if (!isLoading) return null

  return (
    <div
      className={`fixed inset-0 bg-background z-[100] flex items-center justify-center pointer-events-none transition-opacity duration-500 ${
        isFading ? 'opacity-0' : 'opacity-100'
      }`}
      style={{ willChange: 'opacity' }}
    >
      <div className="text-center">
        <LoadingCat 
          size="xl" 
          message={t('brand.name')}
          showMessage={true}
        />
      </div>
    </div>
  )
}
