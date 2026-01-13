"use client"

import { useEffect, useState } from "react"
import { useTranslation } from "../../lib/translations"
import LoadingCat from "../LoadingCat"

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true)
  const [isFading, setIsFading] = useState(false)
  const { t } = useTranslation()

  useEffect(() => {
    let removeTimer: NodeJS.Timeout | null = null

    // Start fade after 1s, then remove after fade completes
    // Don't hide the server-rendered LCP image - let it be visible for LCP
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

  if (!isLoading) return null

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center pointer-events-none transition-opacity duration-500 ${
        isFading ? 'opacity-0' : 'opacity-100'
      }`}
      style={{ 
        willChange: 'opacity',
        // Transparent background so LCP image shows through
        backgroundColor: 'transparent'
      }}
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
