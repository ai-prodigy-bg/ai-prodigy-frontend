"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import Navigation from "../navigation/Navigation"

const SmoothScroll = dynamic(() => import("./SmoothScroll"), {
  ssr: false,
})

export default function ClientOverlays() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <>
      <Navigation />
      {mounted && (
        <>
          <SmoothScroll />
        </>
      )}
    </>
  )
}
