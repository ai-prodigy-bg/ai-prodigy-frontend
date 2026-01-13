"use client"

import { motion } from "framer-motion"

export default function DrawingSVG() {
  return (
    <motion.svg width="200" height="100" viewBox="0 0 200 100" className="absolute top-20 right-10 opacity-30">
      <motion.path
        d="M10,50 Q50,10 100,50 T190,50"
        stroke="oklch(0.65 0.25 285)"
        strokeWidth="2"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, delay: 1.5, ease: "easeInOut" }}
      />
      <motion.circle
        cx="190"
        cy="50"
        r="4"
        fill="oklch(0.65 0.25 285)"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 3.5, type: "spring" }}
      />
    </motion.svg>
  )
}
