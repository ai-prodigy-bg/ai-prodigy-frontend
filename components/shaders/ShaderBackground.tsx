"use client"

import { useEffect, useState } from "react"

// Helper to check WebGL availability
function isWebGLAvailable(): boolean {
  if (typeof window === 'undefined') return false
  
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    return !!gl
  } catch (e) {
    return false
  }
}

export default function ShaderBackground() {
  const [shouldRender, setShouldRender] = useState(false)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    // Guard against SSR
    if (typeof window === 'undefined') return

    const initializeShaders = () => {
      try {
        // Check all conditions before loading
        const isDesktop = window.innerWidth >= 768
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        const webGLAvailable = isWebGLAvailable()
        
        if (!isDesktop || prefersReducedMotion || !webGLAvailable) {
          return // Don't render shaders
        }

        // Load after first paint to avoid blocking render
        const timer = setTimeout(() => {
          setShouldRender(true)
        }, 100)
        
        return () => clearTimeout(timer)
      } catch (error) {
        console.warn('Shader initialization error:', error)
        setHasError(true)
      }
    }

    const cleanup = initializeShaders()
    return cleanup
  }, [])

  // Fallback for mobile, reduced motion, WebGL unavailable, or errors
  if (!shouldRender || hasError) {
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

  // Lazy load shader components only when needed
  return <ShaderComponents />
}

// Separate component to isolate shader rendering
function ShaderComponents() {
  const [ShaderComponents, setShaderComponents] = useState<{
    DotGrid: any
    NeuroNoise: any
  } | null>(null)
  const [loadError, setLoadError] = useState(false)

  useEffect(() => {
    let mounted = true

    const loadShaders = async () => {
      try {
        const shaders = await import("@paper-design/shaders-react")
        if (mounted) {
          setShaderComponents({
            DotGrid: shaders.DotGrid,
            NeuroNoise: shaders.NeuroNoise,
          })
        }
      } catch (error) {
        console.warn('Failed to load shader components:', error)
        if (mounted) {
          setLoadError(true)
        }
      }
    }

    loadShaders()

    return () => {
      mounted = false
    }
  }, [])

  if (loadError || !ShaderComponents) {
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

  const { DotGrid, NeuroNoise } = ShaderComponents

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
    >
      {/* Base Layer: The Architectural Blueprint */}
      <DotGrid
        colors={["#0a0f1e", "#1a2a47"]}
        scale={0.2}
        speed={0}
        style={{ position: "absolute", width: "100%", height: "100%" }}
      />
      {/* Top Layer: The Flow of Ideas & Data */}
      <NeuroNoise
        colors={["#FFFFFF", "#4A90E2", "#00000000"]}
        scale={2.0}
        speed={0.15}
        style={{ position: "absolute", width: "100%", height: "100%", opacity: 0.6 }}
      />
    </div>
  )
}
