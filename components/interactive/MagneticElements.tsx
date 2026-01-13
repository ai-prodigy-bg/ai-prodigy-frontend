"use client"

import { useEffect } from "react"

export default function MagneticElements() {
  useEffect(() => {
    const magneticElements = document.querySelectorAll("[data-magnetic]")
    const rafMap = new Map<HTMLElement, number>()
    const rectCache = new Map<HTMLElement, { rect: DOMRect; time: number }>()
    const RECT_CACHE_DURATION = 16 // Cache rect for 16ms (60fps)

    const updateElement = (element: HTMLElement, clientX: number, clientY: number) => {
      const now = performance.now()
      let cached = rectCache.get(element)
      
      // Cache rect to avoid forced reflows
      if (!cached || now - cached.time > RECT_CACHE_DURATION) {
        cached = { rect: element.getBoundingClientRect(), time: now }
        rectCache.set(element, cached)
      }
      
      const rect = cached.rect
      const x = clientX - rect.left - rect.width / 2
      const y = clientY - rect.top - rect.height / 2

      const distance = Math.sqrt(x * x + y * y)
      const maxDistance = 50

      if (distance < maxDistance) {
        const strength = (maxDistance - distance) / maxDistance
        const moveX = x * strength * 0.3
        const moveY = y * strength * 0.3
        element.style.transform = `translate(${moveX}px, ${moveY}px)`
      }
      
      rafMap.delete(element)
    }

    const handleMouseMove = (e: MouseEvent) => {
      const element = e.currentTarget as HTMLElement
      
      // Throttle updates using requestAnimationFrame
      if (!rafMap.has(element)) {
        const rafId = requestAnimationFrame(() => {
          updateElement(element, e.clientX, e.clientY)
        })
        rafMap.set(element, rafId)
      }
    }

    const handleMouseLeave = (e: MouseEvent) => {
      const element = e.currentTarget as HTMLElement
      element.style.transform = "translate(0px, 0px)"
      
      // Cancel pending RAF
      const rafId = rafMap.get(element)
      if (rafId !== undefined) {
        cancelAnimationFrame(rafId)
        rafMap.delete(element)
      }
      rectCache.delete(element)
    }

    magneticElements.forEach((element) => {
      element.addEventListener("mousemove", handleMouseMove)
      element.addEventListener("mouseleave", handleMouseLeave)
    })

    return () => {
      magneticElements.forEach((element) => {
        element.removeEventListener("mousemove", handleMouseMove)
        element.removeEventListener("mouseleave", handleMouseLeave)
        
        // Cancel pending RAF
        const rafId = rafMap.get(element)
        if (rafId !== undefined) {
          cancelAnimationFrame(rafId)
        }
      })
      rafMap.clear()
      rectCache.clear()
    }
  }, [])

  return null
}
