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

// Helper to get target FPS based on device type
function getTargetFPS(isMobile: boolean): number {
  return isMobile ? 24 : 30
}

// Helper to get max DPR based on device type
function getMaxDPR(isMobile: boolean): number {
  return isMobile ? 1.0 : 1.25
}

// Helper to get resolution scale based on device type
function getResolutionScale(isMobile: boolean): number {
  return isMobile ? 0.6 : 0.75
}

export default function ShaderBackground() {
  const [shouldRender, setShouldRender] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [useSimpleShader, setUseSimpleShader] = useState(false)
  const [shouldRenderFrame, setShouldRenderFrame] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [targetFPS, setTargetFPS] = useState(30)
  const [maxDPR, setMaxDPR] = useState(1.25)
  const [resolutionScale, setResolutionScale] = useState(0.75)
  const containerRef = useRef<HTMLDivElement>(null)
  const fpsIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Page Visibility API - Pause when tab is hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsPaused(document.hidden)
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  // FPS Throttling - Render at target FPS by skipping frames
  useEffect(() => {
    if (!shouldRender || isPaused) {
      // Clear interval if not rendering or paused
      if (fpsIntervalRef.current) {
        clearInterval(fpsIntervalRef.current)
        fpsIntervalRef.current = null
      }
      setShouldRenderFrame(false)
      return
    }

    // Calculate frame skip pattern to achieve target FPS from 60fps base
    // For 30fps: render every other frame (frameCount % 2 === 0)
    // For 24fps: render 2 out of every 5 frames (frameCount % 5 < 2) ≈ 24fps
    const baseFPS = 60
    const toggleInterval = 1000 / baseFPS // 16.67ms (60fps base)
    let frameCount = 0

    // Determine render pattern based on target FPS
    const shouldRenderFrame = (count: number): boolean => {
      if (targetFPS === 30) {
        // 30fps: render every other frame
        return count % 2 === 0
      } else if (targetFPS === 24) {
        // 24fps: render 2 out of every 5 frames (24/60 = 0.4 = 2/5)
        return count % 5 < 2
      }
      return true // Fallback: render all frames
    }

    // Start with first frame rendered
    setShouldRenderFrame(true)

    fpsIntervalRef.current = setInterval(() => {
      frameCount++
      setShouldRenderFrame(shouldRenderFrame(frameCount))
    }, toggleInterval)

    return () => {
      if (fpsIntervalRef.current) {
        clearInterval(fpsIntervalRef.current)
        fpsIntervalRef.current = null
      }
    }
  }, [shouldRender, isPaused, targetFPS])

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

        // Detect device type and set optimization parameters
        const mobile = !isDesktop
        setIsMobile(mobile)
        setTargetFPS(getTargetFPS(mobile))
        setMaxDPR(getMaxDPR(mobile))
        setResolutionScale(getResolutionScale(mobile))

        // Detect low-end devices
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
      useSimpleShader={useSimpleShader}
      shouldRenderFrame={shouldRenderFrame}
      resolutionScale={resolutionScale}
      maxDPR={maxDPR}
    />
  )
}

// Separate component to isolate shader rendering
function ShaderComponents({
  isPaused,
  useSimpleShader,
  shouldRenderFrame,
  resolutionScale,
  maxDPR,
}: {
  isPaused: boolean
  useSimpleShader: boolean
  shouldRenderFrame: boolean
  resolutionScale: number
  maxDPR: number
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

  // Render static background when paused, frame skipped, loading, or error
  if (loadError || !ShaderComponents || isPaused || !shouldRenderFrame) {
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

  // Calculate scale factor for resolution clamping
  const scaleFactor = 1 / resolutionScale
  const scaledWidth = 100 * scaleFactor
  const scaledHeight = 100 * scaleFactor

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
      {/* Resolution-scaled container for DPR clamping */}
      <div
        style={{
          position: "absolute",
          width: `${scaledWidth}%`,
          height: `${scaledHeight}%`,
          transform: `scale(${scaleFactor})`,
          transformOrigin: '0 0',
        }}
      >
        {/* Single shader only - DotGrid for low-end, NeuroNoise for high-end */}
        {useSimpleShader ? (
          <DotGrid
            colors={["#0a0f1e", "#1a2a47"]}
            scale={0.2}
            speed={0}
            style={{ position: "absolute", width: "100%", height: "100%" }}
          />
        ) : (
          <NeuroNoise
            colors={["#FFFFFF", "#4A90E2", "#00000000"]}
            scale={2.0}
            speed={0.05}
            style={{ position: "absolute", width: "100%", height: "100%", opacity: 0.4 }}
          />
        )}
      </div>
    </div>
  )
}
