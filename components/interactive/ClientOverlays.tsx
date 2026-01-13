"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import LoadingScreen from "./LoadingScreen"
import Navigation from "../navigation/Navigation"

// Dynamic imports for expensive effects - desktop only
const LiquidCursor = dynamic(() => import("./LiquidCursor"), {
  ssr: false,
})

const MagneticElements = dynamic(() => import("./MagneticElements"), {
  ssr: false,
})

const ShaderBackground = dynamic(() => import("../shaders/ShaderBackground"), {
  ssr: false,
})

// Defer non-critical components until after initial render
const ScrollProgress = dynamic(() => import("./ScrollProgress"), {
  ssr: false,
})

const SmoothScroll = dynamic(() => import("./SmoothScroll"), {
  ssr: false,
})

const FloatingActionButton = dynamic(() => import("./FloatingActionButton"), {
  ssr: false,
})

export default function ClientOverlays() {
  const [shouldLoadDesktopEffects, setShouldLoadDesktopEffects] = useState(false)
  const [shouldLoadDeferredComponents, setShouldLoadDeferredComponents] = useState(false)

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

    // Defer non-critical components until after initial render and first paint
    // This reduces main-thread work on mobile (especially Script Evaluation time)
    const deferTimer = setTimeout(() => {
      // Use requestIdleCallback if available, otherwise just load after delay
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
          setShouldLoadDeferredComponents(true)
        }, { timeout: 2000 })
      } else {
        setShouldLoadDeferredComponents(true)
      }
    }, 100) // Small delay to let initial render complete

    return () => {
      clearTimeout(resizeTimeout)
      clearTimeout(deferTimer)
      window.removeEventListener('resize', handleResize)
      mediaQuery.removeEventListener('change', handleMotionChange)
    }
  }, [])

  return (
    <>
      <LoadingScreen />
      <Navigation />
      {shouldLoadDeferredComponents && (
        <>
          <ScrollProgress />
          <SmoothScroll />
          <FloatingActionButton />
        </>
      )}
      {shouldLoadDesktopEffects && (
        <>
          <LiquidCursor />
          <ShaderBackground />
          <MagneticElements />
        </>
      )}
    </>
  )
}
