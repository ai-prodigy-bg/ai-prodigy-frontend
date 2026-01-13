"use client"

import { useEffect, useState, Component, ReactNode } from "react"

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

// Error Boundary for shader components
class ShaderErrorBoundary extends Component<
  { children: ReactNode; fallback?: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; fallback?: ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.warn('ShaderBackground: Shader error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || null
    }
    return this.props.children
  }
}

export default function ShaderBackground() {
  const [shouldLoadShaders, setShouldLoadShaders] = useState(false)

  useEffect(() => {
    // Guard against SSR
    if (typeof window === 'undefined') return

    // Check conditions before loading (works on both desktop and mobile)
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const webGLAvailable = isWebGLAvailable()
    
    // Only block if user prefers reduced motion or WebGL is unavailable
    if (prefersReducedMotion || !webGLAvailable) {
      return // Use fallback background (already rendered)
    }

    // Load after idle for best Lighthouse performance
    // Use requestIdleCallback with fallback to setTimeout
    const loadShaders = () => {
      setShouldLoadShaders(true)
    }

    if ('requestIdleCallback' in window) {
      const idleCallback = (window as any).requestIdleCallback(loadShaders, { timeout: 500 })
      return () => (window as any).cancelIdleCallback(idleCallback)
    } else {
      // Fallback: use setTimeout after a short delay
      const timer = setTimeout(loadShaders, 500)
      return () => clearTimeout(timer)
    }
  }, [])

  // Always render container with fallback background (progressive enhancement)
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
      {/* Progressive enhancement: upgrade to shaders after idle */}
      {shouldLoadShaders && (
        <ShaderErrorBoundary>
          <ShaderComponents />
        </ShaderErrorBoundary>
      )}
    </div>
  )
}

// Separate component to isolate shader rendering
function ShaderComponents() {
  const [ShaderComponents, setShaderComponents] = useState<{
    DotGrid: any
    NeuroNoise: any
  } | null>(null)

  useEffect(() => {
    let mounted = true

    const loadShaders = async () => {
      try {
        // Dynamic import - only loaded when needed, not in initial bundle
        const shaders = await import("@paper-design/shaders-react")
        if (mounted) {
          setShaderComponents({
            DotGrid: shaders.DotGrid,
            NeuroNoise: shaders.NeuroNoise,
          })
        }
      } catch (error) {
        console.warn('Failed to load shader components:', error)
        // Error will be caught by Error Boundary
        throw error
      }
    }

    loadShaders()

    return () => {
      mounted = false
    }
  }, [])

  // Don't render anything until shaders are loaded (container is already rendered by parent)
  if (!ShaderComponents) {
    return null
  }

  const { DotGrid, NeuroNoise } = ShaderComponents

  // Render shaders - any errors will be caught by Error Boundary
  return (
    <>
      {/* Base Layer: The Architectural Blueprint */}
      <DotGrid
        colors={["#0a0f1e", "#1a2a47"]}
        scale={0.2}
        speed={0}
        style={{ position: "absolute", width: "100%", height: "100%", top: 0, left: 0 }}
      />
      {/* Top Layer: The Flow of Ideas & Data */}
      <NeuroNoise
        colors={["#FFFFFF", "#4A90E2", "#00000000"]}
        scale={2.0}
        speed={0.15}
        style={{ position: "absolute", width: "100%", height: "100%", top: 0, left: 0, opacity: 0.6 }}
      />
    </>
  )
}
