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
    "dpr-2", // Support high DPI displays
    "cm-maintain_ratio", // Maintain aspect ratio
    "bo-2_FFFFFF", // White border for edge cases
  ]
}

// Generate transformations for project card images
export function getProjectImageTransformations(width: number = 400, quality: number = 85): string[] {
  return [
    `w-${width}`, // Specific width
    "h-auto", // Maintain aspect ratio
    `q-${quality}`, // Optimized quality
    "f-auto", // Auto format
    "cm-maintain_ratio", // Maintain aspect ratio
  ]
}

// Calculate aspect ratio from original dimensions
export function calculateAspectRatio(width: number, height: number): number {
  return width / height
}

// Calculate height from width and aspect ratio
export function calculateHeight(width: number, aspectRatio: number): number {
  return Math.round(width / aspectRatio)
}
