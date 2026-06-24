"use client"

import { motion } from "framer-motion"
import type React from "react"

interface ServiceCardProps {
  title: string
  description: string
  features: string[]
  icon: React.ReactNode
  index: number
}

export default function ServiceCard({ title, description, features, icon, index }: ServiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, delay: index * 0.08 }}
      className="h-full rounded-lg border border-white/10 bg-black/75 p-6 backdrop-blur-sm"
    >
      <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-lg border border-white/10 bg-white/[0.05] text-white/70">
        {icon}
      </div>
      <h3 className="mb-4 text-[22px] font-normal leading-tight tracking-[-0.02em] text-white">{title}</h3>
      <p className="mb-7 text-[13px] leading-relaxed text-white/50 sm:text-[14px]">{description}</p>
      <div className="space-y-3">
        {features.map((feature) => (
          <div key={feature} className="flex items-start gap-3 text-[13px] leading-relaxed text-white/45">
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-white/45" />
            <span>{feature}</span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
