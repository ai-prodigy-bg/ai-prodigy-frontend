"use client"

import { useEffect } from "react"

export default function MagneticElements() {
  useEffect(() => {
    const magneticElements = document.querySelectorAll("[data-magnetic]")

    const handleMouseMove = (e: MouseEvent) => {
      const element = e.currentTarget as HTMLElement
      const rect = element.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2

      const distance = Math.sqrt(x * x + y * y)
      const maxDistance = 50

      if (distance < maxDistance) {
        const strength = (maxDistance - distance) / maxDistance
        const moveX = x * strength * 0.3
        const moveY = y * strength * 0.3
        element.style.transform = `translate(${moveX}px, ${moveY}px)`
      }
    }

    const handleMouseLeave = (e: MouseEvent) => {
      const element = e.currentTarget as HTMLElement
      element.style.transform = "translate(0px, 0px)"
    }

    magneticElements.forEach((element) => {
      element.addEventListener("mousemove", handleMouseMove)
      element.addEventListener("mouseleave", handleMouseLeave)
    })

    return () => {
      magneticElements.forEach((element) => {
        element.removeEventListener("mousemove", handleMouseMove)
        element.removeEventListener("mouseleave", handleMouseLeave)
      })
    }
  }, [])

  return null
}
