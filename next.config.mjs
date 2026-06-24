import bundleAnalyzer from '@next/bundle-analyzer'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = dirname(fileURLToPath(import.meta.url))

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['127.0.0.1'],
  turbopack: {
    root: projectRoot,
  },
  images: {
    unoptimized: true, // ImageKit handles optimization via URL transformations
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
        pathname: '/**',
      },
    ],
  },
}

export default withBundleAnalyzer(nextConfig)
