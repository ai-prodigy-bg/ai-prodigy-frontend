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
  
  return (
    <main className="min-h-screen relative overflow-hidden md:cursor-none cursor-auto">
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
