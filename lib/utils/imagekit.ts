const IMAGEKIT_URL_ENDPOINT = "https://ik.imagekit.io/ts59gf2ul"

function encodePathSegment(segment: string): string {
  try {
    return encodeURIComponent(decodeURIComponent(segment))
  } catch {
    return encodeURIComponent(segment)
  }
}

function encodeImagePath(src: string): string {
  return src.split("/").map(encodePathSegment).join("/")
}

export function buildImageKitUrl(src: string, transformations: string[]): string {
  if (!src || src.startsWith("/placeholder")) return src
  const transformationString = transformations.join(",")
  return `${IMAGEKIT_URL_ENDPOINT}/tr:${transformationString}${encodeImagePath(src)}`
}

export function getProjectImageTransformations(width: number = 400, quality: number = 80): string[] {
  return [
    `w-${width}`,
    "h-auto",
    `q-${quality}`,
    "f-auto", // Auto format
    "cm-maintain_ratio",
  ]
}

export function getProjectImageSrcSet(baseImagePath: string, quality: number = 80): Array<{ src: string; width: number; descriptor: string }> {
  const breakpoints = [
    { width: 640, descriptor: "640w" },
    { width: 400, descriptor: "400w" },
    { width: 323, descriptor: "323w" },
  ]

  return breakpoints.map((bp) => ({
    src: buildImageKitUrl(baseImagePath, getProjectImageTransformations(bp.width, quality)),
    width: bp.width,
    descriptor: bp.descriptor,
  }))
}
