"use client"

import { NeuroNoise } from "@paper-design/shaders-react"

/**
 * Pure shader rendering component - no state updates, no side effects.
 * Any errors will be caught by the Error Boundary in ShaderBackground.
 * 
 * Note: TypeScript types for @paper-design/shaders-react may be incomplete.
 * The `colors` prop works at runtime but may not be in the type definitions.
 */
export default function ShaderImpl() {
  return (
    <NeuroNoise
      // @ts-expect-error - colors prop exists at runtime but types may be incomplete
      colors={["#FFFFFF", "#4A90E2", "#00000000"]}
      scale={2.0}
      speed={0.05}
      style={{ position: "absolute", inset: 0, opacity: 0.6 }}
    />
  )
}
