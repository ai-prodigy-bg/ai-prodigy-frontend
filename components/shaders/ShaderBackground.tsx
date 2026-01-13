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

// Type definitions for requestIdleCallback (if not already defined)
type IdleCallbackHandle = number;
type IdleRequestCallback = (deadline: IdleDeadline) => void;
interface IdleDeadline {
  readonly didTimeout: boolean;
  timeRemaining(): DOMHighResTimeStamp;
}
interface IdleRequestOptions {
  timeout?: number;
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

  // Load shaders when idle (best for Lighthouse)
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Check conditions
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    
    // Block if reduced motion or WebGL unavailable (works on both desktop and mobile)
    if (prefersReducedMotion || !webglOK()) {
      return
    }

    // Upgrade when idle (best for Lighthouse)
    const ric = (window as any).requestIdleCallback as undefined | ((cb: () => void, opts?: any) => any)
    let idleId: any
    let timerId: any

    const start = () => {
      setEnabled(true)
    }

    if (ric) {
      // Use requestIdleCallback with 2500ms timeout (don't wait forever)
      idleId = ric(start, { timeout: 2500 })
    } else {
      // Fallback: wait a bit after first paint (1200ms)
      timerId = window.setTimeout(start, 1200)
    }

    return () => {
      if (ric && idleId) {
        const cancel = (window as any).cancelIdleCallback
        if (cancel) cancel(idleId)
      }
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
