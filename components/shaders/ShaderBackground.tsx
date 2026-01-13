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
  const [mounted, setMounted] = useState(false)
  const [shouldLoadShaders, setShouldLoadShaders] = useState(false)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    // Set mounted immediately to prevent flickering
    setMounted(true)

    // Guard against SSR
    if (typeof window === 'undefined') return

    const initializeShaders = () => {
      try {
        // Check conditions before loading (works on both desktop and mobile)
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        const webGLAvailable = isWebGLAvailable()
        
        // Only block if user prefers reduced motion or WebGL is unavailable
        if (prefersReducedMotion || !webGLAvailable) {
          setHasError(true) // Use fallback background
          return
        }

        // Load after first paint to avoid blocking render
        const timer = setTimeout(() => {
          setShouldLoadShaders(true)
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

  // Always render container to prevent flickering
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
      {/* Only render shaders when mounted and should load */}
      {mounted && shouldLoadShaders && !hasError && (
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
  const [loadError, setLoadError] = useState(false)

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

  // Don't render anything until shaders are loaded (container is already rendered by parent)
  if (loadError || !ShaderComponents) {
    return null
  }

  const { DotGrid, NeuroNoise } = ShaderComponents

  try {
    return (
      <>
        {/* Base Layer: The Architectural Blueprint */}
        <DotGrid
          colors={["#0a0f1e", "#1a2a47"]}
          scale={0.2}
          speed={0}
          style={{ position: "absolute", width: "100%", height: "100%", top: 0, left: 0 }}
          onError={() => setLoadError(true)}
        />
        {/* Top Layer: The Flow of Ideas & Data */}
        <NeuroNoise
          colors={["#FFFFFF", "#4A90E2", "#00000000"]}
          scale={2.0}
          speed={0.15}
          style={{ position: "absolute", width: "100%", height: "100%", top: 0, left: 0, opacity: 0.6 }}
          onError={() => setLoadError(true)}
        />
      </>
    )
  } catch (error) {
    console.warn('ShaderBackground: Shader rendering error, falling back:', error)
    setLoadError(true)
    return null
  }
}
