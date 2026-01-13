import { getServerTranslations } from "../lib/translations/server"
import HeroSection from "../components/hero/HeroSection"
import ProjectsSection from "../components/projects/ProjectsSection"
import ServicesSection from "../components/services/ServicesSection"
import AboutSection from "../components/about/AboutSection"
import ContactSection from "../components/contact/ContactSection"
import Footer from "../components/Footer"
import ClientOverlaysWrapper from "../components/interactive/ClientOverlaysWrapper"

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
