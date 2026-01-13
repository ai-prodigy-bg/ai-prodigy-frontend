# Proper Way to Use @paper-design/shaders-react

## 🎯 Current Issues with Your Implementation

1. **No pause mechanism** - Shaders run continuously even when tab is hidden
2. **No frame rate limiting** - Running at full speed (60fps) constantly
3. **Two shaders simultaneously** - Both DotGrid and NeuroNoise rendering at once
4. **No visibility detection** - Rendering even when not visible
5. **High animation speed** - `speed={0.15}` is relatively high
6. **No performance monitoring** - Can't detect when performance degrades

## ✅ Best Practices for Optimal Shader Usage

### 1. **Page Visibility API** (CRITICAL)
Pause shaders when the browser tab is hidden to save CPU/GPU:

```typescript
useEffect(() => {
  const handleVisibilityChange = () => {
    if (document.hidden) {
      // Pause shaders when tab is hidden
      setIsPaused(true)
    } else {
      // Resume when tab becomes visible
      setIsPaused(false)
    }
  }
  
  document.addEventListener('visibilitychange', handleVisibilityChange)
  return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
}, [])
```

### 2. **Reduce Shader Complexity**
Instead of two shaders, use ONE:

**Option A: Static Only (Best Performance)**
```typescript
<DotGrid
  colors={["#0a0f1e", "#1a2a47"]}
  scale={0.2}
  speed={0}  // Static = no animation = minimal CPU
  style={{ position: "absolute", width: "100%", height: "100%" }}
/>
```

**Option B: Single Animated Shader (Better Performance)**
```typescript
<NeuroNoise
  colors={["#FFFFFF", "#4A90E2", "#00000000"]}
  scale={2.0}
  speed={0.05}  // Reduced from 0.15 to 0.05 (3x slower = less CPU)
  style={{ position: "absolute", width: "100%", height: "100%", opacity: 0.4 }}
/>
```

**Option C: Conditional Dual Shaders (Current, but optimized)**
Only render both if performance allows, otherwise fallback to single.

### 3. **Reduce Animation Speed**
Lower speed = less computation per frame:

```typescript
// Current (HIGH CPU)
speed={0.15}

// Optimized (LOW CPU)
speed={0.05}  // 3x slower = 3x less computation
```

### 4. **Intersection Observer for Viewport Visibility**
Pause when shader is not in viewport (if using in scrollable sections):

```typescript
const containerRef = useRef<HTMLDivElement>(null)

useEffect(() => {
  if (!containerRef.current) return
  
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        setIsVisible(entry.isIntersecting)
      })
    },
    { threshold: 0.1 }
  )
  
  observer.observe(containerRef.current)
  return () => observer.disconnect()
}, [])
```

### 5. **Delay Loading Until After Critical Content**
Load shaders AFTER LCP (Largest Contentful Paint):

```typescript
useEffect(() => {
  // Wait for page to be fully interactive
  const timer = setTimeout(() => {
    setShouldRender(true)
  }, 2000)  // Increased from 100ms to 2000ms
  
  return () => clearTimeout(timer)
}, [])
```

### 6. **Performance-Based Rendering**
Detect low-end devices and disable shaders:

```typescript
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
```

### 7. **Use CSS `will-change` and GPU Acceleration**
Hint to browser for GPU acceleration:

```typescript
<div
  style={{
    position: "fixed",
    width: "100%",
    height: "100%",
    backgroundColor: "#0a0f1e",
    overflow: "hidden",
    zIndex: -10,
    willChange: 'transform',  // Hint for GPU acceleration
    transform: 'translateZ(0)',  // Force GPU layer
  }}
>
```

### 8. **Frame Rate Limiting** (If library supports it)
Some shader libraries support `fps` or `frameRate` props:

```typescript
<NeuroNoise
  speed={0.05}
  fps={30}  // Limit to 30fps instead of 60fps (50% less CPU)
  // ... other props
/>
```

## 📋 Recommended Optimized Implementation

Here's the **proper way** to implement ShaderBackground:

```typescript
"use client"

import { useEffect, useState, useRef } from "react"

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

function isLowEndDevice(): boolean {
  if (typeof window === 'undefined') return false
  const cores = navigator.hardwareConcurrency || 4
  const memory = (navigator as any).deviceMemory
  const connection = (navigator as any).connection
  
  return cores < 4 || 
         (memory && memory < 4) || 
         (connection && connection.effectiveType === 'slow-2g')
}

export default function ShaderBackground() {
  const [shouldRender, setShouldRender] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [useSimpleShader, setUseSimpleShader] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const initializeShaders = () => {
      try {
        const isDesktop = window.innerWidth >= 768
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        const webGLAvailable = isWebGLAvailable()
        const lowEnd = isLowEndDevice()
        
        if (!isDesktop || prefersReducedMotion || !webGLAvailable) {
          return
        }

        // Use simple shader on low-end devices
        setUseSimpleShader(lowEnd)

        // Load after critical content (LCP)
        const timer = setTimeout(() => {
          setShouldRender(true)
        }, 2000)  // Wait 2 seconds for LCP
        
        return () => clearTimeout(timer)
      } catch (error) {
        console.warn('Shader initialization error:', error)
        setHasError(true)
      }
    }

    const cleanup = initializeShaders()
    return cleanup
  }, [])

  // Page Visibility API - Pause when tab is hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsPaused(document.hidden)
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  // Intersection Observer - Pause when not visible (optional for scrollable sections)
  useEffect(() => {
    if (!containerRef.current || !shouldRender) return
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Only pause if completely out of viewport
          if (!entry.isIntersecting && entry.intersectionRatio === 0) {
            setIsPaused(true)
          } else if (entry.isIntersecting) {
            setIsPaused(false)
          }
        })
      },
      { threshold: [0, 1] }
    )
    
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [shouldRender])

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

  return <ShaderComponents isPaused={isPaused} useSimpleShader={useSimpleShader} />
}

function ShaderComponents({ isPaused, useSimpleShader }: { isPaused: boolean; useSimpleShader: boolean }) {
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

  // If paused, render static background only
  if (isPaused) {
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
        backgroundColor: "#0a0f1e",
        overflow: "hidden",
        zIndex: -10,
        willChange: 'transform',
        transform: 'translateZ(0)',
      }}
    >
      {/* OPTION 1: Simple shader only (BEST PERFORMANCE) */}
      {useSimpleShader ? (
        <DotGrid
          colors={["#0a0f1e", "#1a2a47"]}
          scale={0.2}
          speed={0}  // Static = no CPU usage
          style={{ position: "absolute", width: "100%", height: "100%" }}
        />
      ) : (
        <>
          {/* OPTION 2: Single animated shader (GOOD PERFORMANCE) */}
          <NeuroNoise
            colors={["#FFFFFF", "#4A90E2", "#00000000"]}
            scale={2.0}
            speed={0.05}  // Reduced from 0.15 (3x slower = less CPU)
            style={{ position: "absolute", width: "100%", height: "100%", opacity: 0.4 }}
          />
          
          {/* OPTION 3: Dual shaders (CURRENT, but optimized) */}
          {/* Uncomment if you need both, but expect higher CPU usage */}
          {/* 
          <DotGrid
            colors={["#0a0f1e", "#1a2a47"]}
            scale={0.2}
            speed={0}
            style={{ position: "absolute", width: "100%", height: "100%" }}
          />
          <NeuroNoise
            colors={["#FFFFFF", "#4A90E2", "#00000000"]}
            scale={2.0}
            speed={0.05}  // Reduced speed
            style={{ position: "absolute", width: "100%", height: "100%", opacity: 0.4 }}
          />
          */}
        </>
      )}
    </div>
  )
}
```

## 🎯 Performance Impact Summary

| Optimization | Main Thread Time Saved | Implementation Difficulty |
|-------------|----------------------|-------------------------|
| Page Visibility API | ~50% (when tab hidden) | ⭐ Easy |
| Single Shader | ~40-50% | ⭐ Easy |
| Reduced Speed (0.15 → 0.05) | ~30-40% | ⭐ Easy |
| Delay Loading (100ms → 2000ms) | Better LCP | ⭐ Easy |
| Low-End Device Detection | ~100% (on low-end) | ⭐⭐ Medium |
| Intersection Observer | ~20-30% (when scrolled) | ⭐⭐ Medium |

## 🚀 Quick Wins (Implement First)

1. **Add Page Visibility API** - Pause when tab hidden (5 min)
2. **Reduce speed from 0.15 to 0.05** - Less CPU (1 min)
3. **Use single shader** - Remove DotGrid or NeuroNoise (2 min)
4. **Delay loading to 2000ms** - Better LCP (1 min)

**Expected Result:** Main thread work should drop from 33.7s to ~10-15s

## ⚠️ Important Notes

1. **The library may not support pause/resume** - If `@paper-design/shaders-react` doesn't have pause props, you'll need to conditionally render/unmount the component
2. **Unmounting is better than hiding** - If you can't pause, unmount the component when paused
3. **Test on real devices** - Lighthouse uses throttled CPU, real devices may perform differently
4. **Monitor actual FPS** - Use Chrome DevTools to see if optimizations help

## 📊 Testing Your Optimizations

1. **Before optimization:**
   - Run Lighthouse
   - Note "Minimize main-thread work" time
   - Note "Other" category time

2. **After optimization:**
   - Run Lighthouse again
   - Compare times
   - Should see 50-70% reduction

3. **Real-world testing:**
   - Open Chrome DevTools → Performance tab
   - Record while page loads
   - Check FPS meter (should stay near 60fps)
   - Check CPU usage (should be lower)
