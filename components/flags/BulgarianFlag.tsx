import React from 'react'

interface BulgarianFlagProps {
  className?: string
  size?: number
}

export default function BulgarianFlag({ className = "", size = 20 }: BulgarianFlagProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      className={`inline-block ${className}`}
      aria-label="Bulgarian Flag"
    >
      <defs>
        <clipPath id="bg-flag-clip">
          <rect width="20" height="20" rx="2" />
        </clipPath>
      </defs>
      
      {/* White stripe (top) */}
      <rect width="20" height="6.67" fill="#FFFFFF" rx="2" />
      
      {/* Green stripe (middle) */}
      <rect y="6.67" width="20" height="6.67" fill="#00966E" />
      
      {/* Red stripe (bottom) */}
      <rect y="13.33" width="20" height="6.67" fill="#D62612" />
      
      {/* Rounded corners overlay */}
      <rect 
        width="20" 
        height="20" 
        fill="none" 
        stroke="rgba(0,0,0,0.1)" 
        strokeWidth="0.5" 
        rx="2" 
      />
    </svg>
  )
}
