"use client"

import { useEffect } from "react"

export default function SmoothScroll() {
  useEffect(() => {
    const handleClick = (e: Event) => {
      const target = e.target as HTMLElement
      const href = target.getAttribute("href")

      if (href && href.startsWith("#")) {
        e.preventDefault()
        const element = document.querySelector(href)
        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start",
          })
        }
      }
    }

    const links = document.querySelectorAll('a[href^="#"]')
    links.forEach((link) => {
      link.addEventListener("click", handleClick)
    })

    return () => {
      links.forEach((link) => {
        link.removeEventListener("click", handleClick)
      })
    }
  }, [])

  return null
}
