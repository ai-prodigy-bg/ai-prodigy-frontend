"use client"

import { DotGrid, NeuroNoise } from "@paper-design/shaders-react"

export default function ShaderBackground() {
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
      {/* Base Layer: The Architectural Blueprint */}
      <DotGrid
        colors={["#0a0f1e", "#1a2a47"]}
        scale={0.2}
        speed={0}
        style={{ position: "absolute", width: "100%", height: "100%" }}
      />
      {/* Top Layer: The Flow of Ideas & Data */}
      <NeuroNoise
        colors={["#FFFFFF", "#4A90E2", "#00000000"]}
        scale={2.0}
        speed={0.15}
        style={{ position: "absolute", width: "100%", height: "100%", opacity: 0.6 }}
      />
    </div>
  )
}
