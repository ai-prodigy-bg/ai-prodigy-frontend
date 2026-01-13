"use client"

import { useEffect, useState, Component, ReactNode } from "react"
import dynamic from "next/dynamic"

// Dynamic import - shaders are NOT in initial bundle
const ShaderImpl = dynamic(() => import("./ShaderImpl"), { ssr: false })

// Helper to check WebGL availability
function webglOK(): boolean {
  if (typeof window === 'undefined') return false
  
  try {
    const canvas = document.createElement('canvas')
    return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
  } catch {
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
  const [enabled, setEnabled] = useState(false)
  const [visible, setVisible] = useState(true)

  // Page Visibility API - pause when tab is hidden
  useEffect(() => {
    if (typeof window === 'undefined') return

    const onVisibilityChange = () => {
      setVisible(!document.hidden)
    }
    
    document.addEventListener('visibilitychange', onVisibilityChange)
    onVisibilityChange() // Set initial state
    
    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [])

  // Load shaders immediately (make shader the LCP)
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Check conditions
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    
    // Block if reduced motion or WebGL unavailable (works on both desktop and mobile)
    if (prefersReducedMotion || !webglOK()) {
      return
    }

    const timerId = window.setTimeout(() => {
      setEnabled(true)
    }, 0)

    const watchLcp = () => {
      if (!('PerformanceObserver' in window)) {
        scheduleIdleStart()
        return
      }

      try {
        lcpObserver = new PerformanceObserver((entryList) => {
          if (entryList.getEntries().length === 0) return
          lcpObserver?.disconnect()
          lcpObserver = null
          if (lcpTimeoutId) {
            window.clearTimeout(lcpTimeoutId)
            lcpTimeoutId = null
          }
          scheduleIdleStart()
        })
        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true })
        // Safety fallback: if LCP never fires, still start after 3.5s
        lcpTimeoutId = window.setTimeout(scheduleIdleStart, 3500)
      } catch {
        scheduleIdleStart()
      }
    }

    watchLcp()

    return () => {
      if (timerId) {
        window.clearTimeout(timerId)
      }
    }
  }, [])

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#0a0f1e]">
      {/* Only mount shaders when enabled and tab is visible */}
      {/* Unmounting when hidden stops the 60fps loop = saves battery + reduces main thread work */}
      {enabled && visible ? (
        <ShaderErrorBoundary>
          <ShaderImpl />
        </ShaderErrorBoundary>
      ) : null}
    </div>
  )
}
