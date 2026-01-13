"use client"

import dynamic from "next/dynamic"

// Dynamic imports for expensive effects with ssr: false
const ClientOverlays = dynamic(() => import("./ClientOverlays"), {
  ssr: false,
})

export default function ClientOverlaysWrapper() {
  return <ClientOverlays />
}
