const IMAGEKIT_URL_ENDPOINT = "https://ik.imagekit.io/ts59gf2ul"

export function buildImageKitUrl(src: string, transformations: string[]): string {
  if (!src || src.startsWith('/placeholder')) return src
  const transformationString = transformations.join(',')
  return `${IMAGEKIT_URL_ENDPOINT}/tr:${transformationString}${src}`
}

// Responsive image transformations for different screen sizes
// Updated with better compression (q-85 instead of q-90)
export function getResponsiveImageTransformations(): string[] {
  return [
    "w-400", // Set width to 400px
    "h-auto", // Let height adjust automatically to maintain aspect ratio
    "q-85", // Optimized quality (85% - good balance between quality and size)
    "f-auto", // Auto format (WebP when supported)
    "cm-maintain_ratio" // Maintain original aspect ratio without padding
  ]
}

// Generate transformations for logo images with proper sizing
export function getLogoTransformations(width: number, quality: number = 85): string[] {
  return [
    `w-${width}`, // Specific width matching display size
    "h-auto", // Maintain aspect ratio
    `q-${quality}`, // Quality setting
    "f-auto", // Auto format (WebP when supported)
    "cm-maintain_ratio", // Maintain aspect ratio
    "bo-2_FFFFFF", // White border for edge cases
  ]
}

// Generate transformations for project card images
export function getProjectImageTransformations(width: number = 400, quality: number = 80): string[] {
  return [
    `w-${width}`, // Specific width
    "h-auto", // Maintain aspect ratio
    `q-${quality}`, // Optimized quality (reduced from 85 to 80 for better compression)
    "f-auto", // Auto format
    "cm-maintain_ratio", // Maintain aspect ratio
  ]
}

// Generate responsive srcset for project images
// Returns array of { src: string, width: number, descriptor: string }
export function getProjectImageSrcSet(baseImagePath: string, quality: number = 80): Array<{ src: string; width: number; descriptor: string }> {
  // Breakpoints: mobile (640px), tablet (1024px), desktop (400px actual display)
  // Account for container padding and grid gaps
  const breakpoints = [
    { width: 640, descriptor: '640w' },   // Mobile full width
    { width: 400, descriptor: '400w' },   // Desktop grid item
    { width: 323, descriptor: '323w' },   // Actual displayed size on desktop
  ]
  
  return breakpoints.map(bp => ({
    src: buildImageKitUrl(baseImagePath, getProjectImageTransformations(bp.width, quality)),
    width: bp.width,
    descriptor: bp.descriptor
  }))
}

// Generate responsive srcset for logo images (navigation text logo)
// Mobile: h-8 = 32px height, aspect ratio ~3.2:1, so width ~102px
// Desktop: h-10 = 40px height, aspect ratio ~3.2:1, so width ~128px
export function getLogoImageSrcSet(baseImagePath: string, quality: number = 80): Array<{ src: string; width: number; descriptor: string }> {
  const breakpoints = [
    { width: 102, descriptor: '102w' },   // Mobile: h-8 = 32px height
    { width: 128, descriptor: '128w' },   // Desktop: h-10 = 40px height
  ]
  
  return breakpoints.map(bp => ({
    src: buildImageKitUrl(baseImagePath, getLogoTransformations(bp.width, quality)),
    width: bp.width,
    descriptor: bp.descriptor
  }))
}

// Generate LCP image URL for preloading
// Returns the most appropriate size for LCP (mobile: 308px, desktop: 176px)
export function getLCPImageUrl(baseImagePath: string, size: 'mobile' | 'desktop' = 'desktop', quality: number = 80): string {
  const displaySize = size === 'mobile' ? 308 : 176
  return buildImageKitUrl(baseImagePath, [
    `w-${displaySize}`,
    `h-${displaySize}`,
    `q-${quality}`,
    "f-auto",
    "cm-maintain_ratio",
    "bo-4_8B5CF6",
    "e-sharpen",
    "e-contrast:1.1",
    "e-saturate:1.2",
    "bg-transparent"
  ])
}

// Generate responsive srcset for loading cat images
// Supports different sizes: sm (48px), md (80px), lg (112px), xl (176px)
// Uses 2x DPI for crisp display
export function getLoadingCatImageSrcSet(baseImagePath: string, displaySize: number, quality: number = 80): Array<{ src: string; width: number; descriptor: string }> {
  // Generate sizes for 1x and 2x DPI
  const sizes = [
    displaySize,      // 1x DPI
    displaySize * 2,  // 2x DPI
  ]
  
  return sizes.map(size => ({
    src: buildImageKitUrl(baseImagePath, [
      `w-${size}`,
      `h-${size}`,
      `q-${quality}`,
      "f-auto",
      "cm-maintain_ratio",
      "bo-4_8B5CF6",
      "e-sharpen",
      "e-contrast:1.1",
      "e-saturate:1.2",
      "bg-transparent"
    ]),
    width: size,
    descriptor: `${size}w`
  }))
}

// Calculate aspect ratio from original dimensions
export function calculateAspectRatio(width: number, height: number): number {
  return width / height
}

// Calculate height from width and aspect ratio
export function calculateHeight(width: number, aspectRatio: number): number {
  return Math.round(width / aspectRatio)
}
