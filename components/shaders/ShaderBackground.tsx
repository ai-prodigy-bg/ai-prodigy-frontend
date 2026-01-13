"use client"

import { useEffect, useState } from "react"
import { DotGrid, NeuroNoise } from "@paper-design/shaders-react"

export default function ShaderBackground() {
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    // Only load shaders on desktop and when motion is preferred
    const isDesktop = window.innerWidth >= 768
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    
    if (isDesktop && !prefersReducedMotion) {
      // Load after first paint
      const timer = setTimeout(() => {
        setShouldRender(true)
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [])

  // Fallback for mobile or reduced motion
  if (!shouldRender) {
    return (
      <div
        style={{
          position: "fixed",
          width: "100%",
          height: "100%",
          backgroundColor: "#0a0f1e",
          overflow: "hidden",
          zIndex: -10,
        }}
      />
    )
  }

  return (
    <div
      style={{
        position: "fixed",
        width: "100%",
        height: "100%",
        backgroundColor: "#0a0f1e", // A deep, corporate navy blue
        overflow: "hidden",
        zIndex: -10,
      }}
    >
      {/* Base Layer: The Architectural Blueprint */}
      <DotGrid
        colors={["#0a0f1e", "#1a2a47"]} // Barely visible dots for a subtle grid
        scale={0.2}
        speed={0} // The foundation is static and stable
        style={{ position: "absolute", width: "100%", height: "100%" }}
      />
      {/* Top Layer: The Flow of Ideas & Data */}
      <NeuroNoise
        colors={["#FFFFFF", "#4A90E2", "#00000000"]} // White, tech-blue, and fading trails
        scale={2.0}
        speed={0.15} // A deliberate, confident pace
        style={{ position: "absolute", width: "100%", height: "100%", opacity: 0.6 }}
      />
    </div>
  )
}
