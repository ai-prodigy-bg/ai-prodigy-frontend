import React from 'react'

interface USFlagProps {
  className?: string
  size?: number
}

export default function USFlag({ className = "", size = 20 }: USFlagProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      className={`inline-block ${className}`}
      aria-label="United States Flag"
    >
      <defs>
        <clipPath id="us-flag-clip">
          <rect width="20" height="20" rx="2" />
        </clipPath>
      </defs>
      
      {/* Background */}
      <rect width="20" height="20" fill="#B22234" rx="2" />
      
      {/* White stripes */}
      <rect y="1.54" width="20" height="1.54" fill="#FFFFFF" />
      <rect y="4.62" width="20" height="1.54" fill="#FFFFFF" />
      <rect y="7.69" width="20" height="1.54" fill="#FFFFFF" />
      <rect y="10.77" width="20" height="1.54" fill="#FFFFFF" />
      <rect y="13.85" width="20" height="1.54" fill="#FFFFFF" />
      <rect y="16.92" width="20" height="1.54" fill="#FFFFFF" />
      
      {/* Blue canton */}
      <rect width="8" height="10.77" fill="#3C3B6E" />
      
      {/* Stars (simplified 4x3 grid for small size) */}
      <g fill="#FFFFFF">
        <circle cx="1.6" cy="1.8" r="0.4" />
        <circle cx="4" cy="1.8" r="0.4" />
        <circle cx="6.4" cy="1.8" r="0.4" />
        
        <circle cx="2.8" cy="3.6" r="0.4" />
        <circle cx="5.2" cy="3.6" r="0.4" />
        
        <circle cx="1.6" cy="5.4" r="0.4" />
        <circle cx="4" cy="5.4" r="0.4" />
        <circle cx="6.4" cy="5.4" r="0.4" />
        
        <circle cx="2.8" cy="7.2" r="0.4" />
        <circle cx="5.2" cy="7.2" r="0.4" />
        
        <circle cx="1.6" cy="9" r="0.4" />
        <circle cx="4" cy="9" r="0.4" />
        <circle cx="6.4" cy="9" r="0.4" />
      </g>
    </svg>
  )
}
