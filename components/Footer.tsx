import { XIcon, InstagramIcon, FacebookIcon, WhatsAppIcon } from "./SocialIcons"
import type { TranslationFunction } from "../lib/translations/server"

interface FooterProps {
  t: TranslationFunction
}

const FOOTER_VIDEO = "/videos/prodigy-cat-back-metrics-loop-v1.mp4"
const FOOTER_POSTER = "/images/prodigy/prodigy-cat-back-metrics-v1.webp"

export default function Footer({ t }: FooterProps) {
  const whatsappHref = `https://wa.me/${t("contact.info.phone").replace(/\D/g, "")}`
  const socials = [
    { name: t("contact.social.platforms.x"), icon: <XIcon />, href: "https://x.com/prodigy_corp" },
    { name: t("contact.social.platforms.instagram"), icon: <InstagramIcon />, href: "https://www.instagram.com/prodigy_corp/" },
    { name: t("contact.social.platforms.facebook"), icon: <FacebookIcon />, href: "https://www.facebook.com/prodigycorp.io/" },
    { name: t("contact.social.platforms.whatsapp"), icon: <WhatsAppIcon />, href: whatsappHref },
  ]

  return (
    <footer className="relative overflow-hidden bg-black">
      <div className="flex min-h-[440px] flex-col border-t border-white/10 md:flex-row">
        <div className="relative min-h-[280px] overflow-hidden bg-[#010103] md:min-h-[440px] md:w-1/2">
          <video
            src={FOOTER_VIDEO}
            poster={FOOTER_POSTER}
            className="absolute inset-0 h-full w-full object-cover opacity-75"
            style={{ objectPosition: "62% center" }}
            muted
            loop
            autoPlay
            playsInline
            preload="metadata"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.08),rgba(0,0,0,0.72))]" />
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-[length:24px_24px] opacity-[0.04]" />
        </div>

        <div className="flex flex-1 items-center px-6 py-12 md:px-12 md:py-16 lg:px-16">
          <div className="w-full max-w-xl">
            <div className="flex flex-col items-start gap-7">
              <div>
                <p className="mb-5 text-[18px] font-semibold leading-none text-white/70 sm:text-[20px]">
                  {t("contact.social.followUs")}
                </p>
                <div className="flex gap-3.5">
                  {socials.map((social) => (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-[54px] w-[54px] items-center justify-center rounded-xl border border-white/12 bg-white/[0.055] text-white/75 transition-colors duration-200 hover:border-white/25 hover:bg-white/12 hover:text-white"
                      aria-label={social.name}
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>
              <p className="text-[15px] font-medium leading-none text-white/42 sm:text-[16px]">
                © {new Date().getFullYear()} Prodigy Corp
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
