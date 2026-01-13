"use client"

import { useScroll } from "framer-motion"
import { motion } from "framer-motion"

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-primary/30 z-50 origin-left"
      style={{ scaleX: scrollYProgress }}
    />
  )
}
