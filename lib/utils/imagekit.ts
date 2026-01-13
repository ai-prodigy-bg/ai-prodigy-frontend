const IMAGEKIT_URL_ENDPOINT = "https://ik.imagekit.io/ts59gf2ul"

export function buildImageKitUrl(src: string, transformations: string[]): string {
  if (!src || src.startsWith('/placeholder')) return src
  const transformationString = transformations.join(',')
  return `${IMAGEKIT_URL_ENDPOINT}/tr:${transformationString}${src}`
}

// Responsive image transformations for different screen sizes
export function getResponsiveImageTransformations(): string[] {
  return [
    "w-400", // Set width to 400px
    "h-auto", // Let height adjust automatically to maintain aspect ratio
    "q-90", // High quality (90%)
    "f-auto", // Auto format (WebP when supported)
    "cm-maintain_ratio" // Maintain original aspect ratio without padding
  ]
}
