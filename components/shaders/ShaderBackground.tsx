"use client"

import { useEffect, useState, useRef } from "react"

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

// Helper to detect low-end devices
function isLowEndDevice(): boolean {
  if (typeof window === 'undefined') return false
  
  // Check hardware concurrency (CPU cores)
  const cores = navigator.hardwareConcurrency || 4
  if (cores < 4) return true
  
  // Check device memory (if available)
  const memory = (navigator as any).deviceMemory
  if (memory && memory < 4) return true
  
  // Check connection speed
  const connection = (navigator as any).connection
  if (connection && connection.effectiveType === 'slow-2g') return true
  
  return false
}

export default function ShaderBackground() {
  const [shouldRender, setShouldRender] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [useSimpleShader, setUseSimpleShader] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Page Visibility API - Pause when tab is hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsPaused(document.hidden)
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  // Intersection Observer - Pause when not visible in viewport
  useEffect(() => {
    if (!containerRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Pause if less than 10% visible
          setIsVisible(entry.intersectionRatio >= 0.1)
        })
      },
      { threshold: [0, 0.1, 1] }
    )

    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  // Initialization
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

        // Detect low-end devices - use simplified shader
        const lowEnd = isLowEndDevice()
        setUseSimpleShader(lowEnd)

        // Load after LCP (2000ms delay instead of 100ms)
        const timer = setTimeout(() => {
          setShouldRender(true)
        }, 2000)
        
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
        ref={containerRef}
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
  return (
    <ShaderComponents
      isPaused={isPaused}
      isVisible={isVisible}
      useSimpleShader={useSimpleShader}
    />
  )
}

// Separate component to isolate shader rendering
function ShaderComponents({
  isPaused,
  isVisible,
  useSimpleShader,
}: {
  isPaused: boolean
  isVisible: boolean
  useSimpleShader: boolean
}) {
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

  // Render static background when paused, not visible, loading, or error
  if (loadError || !ShaderComponents || isPaused || !isVisible) {
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
        willChange: 'transform',
        transform: 'translateZ(0)',
      }}
    >
      {/* Conditional shader rendering based on device capabilities */}
      {useSimpleShader ? (
        // Low-end devices: Single animated shader only
        <NeuroNoise
          colors={["#FFFFFF", "#4A90E2", "#00000000"]}
          scale={2.0}
          speed={0.05}
          style={{ position: "absolute", width: "100%", height: "100%", opacity: 0.4 }}
        />
      ) : (
        // High-end devices: Dual shaders for full visual effect
        <>
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
            speed={0.05}
            style={{ position: "absolute", width: "100%", height: "100%", opacity: 0.4 }}
          />
        </>
      )}
    </div>
  )
}
