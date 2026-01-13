import { MetadataRoute } from 'next'
import { getBaseUrl } from '../lib/utils/seo'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getBaseUrl()
  
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
      alternates: {
        languages: {
          en: baseUrl,
          bg: `${baseUrl}/bg`,
        },
      },
    },
    {
      url: `${baseUrl}/bg`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
      alternates: {
        languages: {
          en: baseUrl,
          bg: `${baseUrl}/bg`,
        },
      },
    },
  ]
}
