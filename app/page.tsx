import type { Metadata } from "next"
import { getServerTranslations } from "../lib/translations/server"
import HeroSection from "../components/hero/HeroSection"
import ProjectsSection from "../components/projects/ProjectsSection"
import ServicesSection from "../components/services/ServicesSection"
import AboutSection from "../components/about/AboutSection"
import ContactSection from "../components/contact/ContactSection"
import Footer from "../components/Footer"
import ClientOverlaysWrapper from "../components/interactive/ClientOverlaysWrapper"
import { getBaseUrl, getAlternateUrls } from "../lib/utils/seo"
import { getLCPImageUrl, getLoadingCatImageSrcSet } from "../lib/utils/imagekit"

const baseUrl = getBaseUrl()
const alternateUrls = getAlternateUrls()

export const metadata: Metadata = {
  title: "Prodigy Corp - Premium Digital Solutions | AI-Powered Development",
  description: "Premium digital products powered by AI. We build faster, smarter, and more cost-effectively for both our clients and our portfolio. Mobile apps, web applications, websites, and digital services.",
  openGraph: {
    title: "Prodigy Corp - Premium Digital Solutions | AI-Powered Development",
    description: "Premium digital products powered by AI. We build faster, smarter, and more cost-effectively for both our clients and our portfolio.",
    url: alternateUrls.en,
    siteName: "Prodigy Corp",
    images: [
      {
        url: `${baseUrl}/prodigy-corp-logo-nobg.png`,
        width: 1200,
        height: 630,
        alt: "Prodigy Corp - Premium Digital Solutions",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  alternates: {
    canonical: alternateUrls.en,
    languages: {
      "en": alternateUrls.en,
      "bg": alternateUrls.bg,
      "x-default": alternateUrls.xDefault,
    },
  },
}

export default async function HomePage() {
  const translations = await getServerTranslations()
  
  // Generate LCP image URLs for server-side rendering
  const lcpImageBase = "/prodigy%20corp/Logo/prodigy-corp-logo-nobg-cut.png"
  const lcpMobileUrl = getLCPImageUrl(lcpImageBase, "mobile", 80)
  const lcpDesktopUrl = getLCPImageUrl(lcpImageBase, "desktop", 80)
  const lcpDesktop2xSet = getLoadingCatImageSrcSet(lcpImageBase, 176, 80)
  const lcpDesktop2xUrl = lcpDesktop2xSet.find(item => item.width === 352)?.src || lcpDesktopUrl
  
  // Generate srcset for LCP image
  const lcpSrcSet = [
    `${lcpMobileUrl} 308w`,
    `${lcpDesktopUrl} 176w`,
    `${lcpDesktop2xUrl} 352w`,
  ].join(', ')
  
  return (
    <main className="min-h-screen relative overflow-hidden md:cursor-none cursor-auto">
      {/* LCP Image - Server-rendered in initial HTML for immediate discovery */}
      <img
        src={lcpMobileUrl}
        srcSet={lcpSrcSet}
        alt="Loading..."
        width={308}
        height={308}
        loading="eager"
        fetchPriority="high"
        sizes="(max-width: 640px) 308px, 176px"
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] w-[308px] h-[308px] md:w-[176px] md:h-[176px] object-contain"
        style={{
          filter: `
            drop-shadow(0 0 8px rgba(139, 92, 246, 0.6))
            drop-shadow(0 0 16px rgba(139, 92, 246, 0.4))
            drop-shadow(0 0 24px rgba(139, 92, 246, 0.2))
          `
        }}
        id="lcp-image"
      />
      <ClientOverlaysWrapper />
      <HeroSection />
      <ProjectsSection />
      <ServicesSection />
      <AboutSection />
      <ContactSection />
      <Footer t={translations.t} />
    </main>
  )
}
