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
    
    // Listen for resize and motion preference changes
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handleResize = () => checkConditions()
    const handleMotionChange = () => checkConditions()

    window.addEventListener('resize', handleResize)
    mediaQuery.addEventListener('change', handleMotionChange)

    return () => {
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
