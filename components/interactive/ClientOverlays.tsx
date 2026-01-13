"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import LoadingScreen from "./LoadingScreen"
import ScrollProgress from "./ScrollProgress"
import SmoothScroll from "./SmoothScroll"
import FloatingActionButton from "./FloatingActionButton"
import Navigation from "../navigation/Navigation"

// Dynamic imports for expensive effects
const LiquidCursor = dynamic(() => import("./LiquidCursor"), {
  ssr: false,
})

const MagneticElements = dynamic(() => import("./MagneticElements"), {
  ssr: false,
})

const ShaderBackground = dynamic(() => import("../shaders/ShaderBackground"), {
  ssr: false,
})

export default function ClientOverlays() {
  const [shouldLoadDesktopEffects, setShouldLoadDesktopEffects] = useState(false)

  useEffect(() => {
    // Only load desktop effects on desktop and when motion is preferred
    if (typeof window === 'undefined') return

    const checkConditions = () => {
      const isDesktop = window.innerWidth >= 768
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      setShouldLoadDesktopEffects(isDesktop && !prefersReducedMotion)
    }

    checkConditions()
    
    // Debounce resize handler to avoid excessive checks
    let resizeTimeout: NodeJS.Timeout
    const handleResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(checkConditions, 150) // Debounce by 150ms
    }
    
    // Listen for resize and motion preference changes
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handleMotionChange = () => checkConditions()

    window.addEventListener('resize', handleResize, { passive: true })
    mediaQuery.addEventListener('change', handleMotionChange)

    return () => {
      clearTimeout(resizeTimeout)
      window.removeEventListener('resize', handleResize)
      mediaQuery.removeEventListener('change', handleMotionChange)
    }
  }, [])

  return (
    <>
      <LoadingScreen />
      <ScrollProgress />
      <SmoothScroll />
      <FloatingActionButton />
      <Navigation />
      {shouldLoadDesktopEffects && (
        <>
          <LiquidCursor />
          <ShaderBackground />
        </>
      )}
      <MagneticElements />
    </>
  )
}
