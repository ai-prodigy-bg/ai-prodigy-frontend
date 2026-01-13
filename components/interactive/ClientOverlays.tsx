"use client"

import dynamic from "next/dynamic"
import LoadingScreen from "./LoadingScreen"
import ScrollProgress from "./ScrollProgress"
import SmoothScroll from "./SmoothScroll"
import FloatingActionButton from "./FloatingActionButton"
import Navigation from "../navigation/Navigation"

// Dynamic imports for expensive effects
const LiquidCursor = dynamic(() => import("./LiquidCursor"), {
  ssr: false,
})

const MagneticElements = dynamic(() => import("./MagneticElements"), {
  ssr: false,
})

const ShaderBackground = dynamic(() => import("../shaders/ShaderBackground"), {
  ssr: false,
})

export default function ClientOverlays() {
  return (
    <>
      <LoadingScreen />
      <ScrollProgress />
      <SmoothScroll />
      <FloatingActionButton />
      <Navigation />
      <LiquidCursor />
      <MagneticElements />
      <ShaderBackground />
    </>
  )
}
