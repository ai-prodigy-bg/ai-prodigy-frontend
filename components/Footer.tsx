import { buildImageKitUrl } from "../lib/utils/imagekit"
import { XIcon, InstagramIcon, FacebookIcon } from "./SocialIcons"
import type { TranslationFunction } from "../lib/translations/server"

interface FooterProps {
  t: TranslationFunction
}

export default function Footer({ t }: FooterProps) {
  return (
    <footer className="mt-6 border-t border-border/20">
      <div className="max-w-7xl mx-auto px-6 py-4 pb-8">
        {/* Mobile Layout: Social icons above copyright */}
        <div className="flex flex-col md:hidden items-center gap-3">
          {/* Follow Us Text + Social Icons */}
          <div className="flex flex-col items-center gap-2">
            <p className="text-base text-muted-foreground">{t('contact.social.followUs')}</p>
            <div className="flex gap-3 justify-center">
              {[
                { name: t('contact.social.platforms.x'), icon: <XIcon />, href: "https://x.com/prodigy_corp" },
                { name: t('contact.social.platforms.instagram'), icon: <InstagramIcon />, href: "https://www.instagram.com/prodigy_corp/" },
                { name: t('contact.social.platforms.facebook'), icon: <FacebookIcon />, href: "https://www.facebook.com/prodigycorp.io/" },
              ].map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl flex items-center justify-center text-foreground hover:border-primary/50 hover:bg-primary/10 transition-all duration-300"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Logo + Copyright */}
          <div className="flex items-center gap-3 justify-center">
            <img
              src={buildImageKitUrl("/prodigy%20corp/Logo/prodigy-corp-logo-nobg-cut.png", [
                "w-96",
                "q-90",
                "f-auto",
                "dpr-2",
                "cm-maintain_ratio",
                "bo-2_FFFFFF",
              ])}
              alt=""
              aria-hidden="true"
              width={96}
              height={96}
              className="w-10 h-10"
              style={{
                filter:
                  "drop-shadow(0 0 2px rgba(255,255,255,0.5)) " +
                  "drop-shadow(0 0 8px rgba(139,92,246,0.4)) " +
                  "drop-shadow(0 0 16px rgba(139,92,246,0.22))",
              }}
              loading="lazy"
            />
            <p className="text-sm text-muted-foreground text-center">
              © {new Date().getFullYear()} Prodigy Corp
            </p>
          </div>
        </div>

        {/* Desktop Layout: Copyright left, Socials right */}
        <div className="hidden md:flex items-center justify-between">
          {/* Left: Logo + Copyright */}
          <div className="flex items-center gap-4">
            <img
              src={buildImageKitUrl("/prodigy%20corp/Logo/prodigy-corp-logo-nobg-cut.png", [
                "w-96",
                "q-90",
                "f-auto",
                "dpr-2",
                "cm-maintain_ratio",
                "bo-2_FFFFFF",
              ])}
              alt=""
              aria-hidden="true"
              width={96}
              height={96}
              className="w-12 h-12"
              style={{
                filter:
                  "drop-shadow(0 0 2px rgba(255,255,255,0.5)) " +
                  "drop-shadow(0 0 8px rgba(139,92,246,0.4)) " +
                  "drop-shadow(0 0 16px rgba(139,92,246,0.22))",
              }}
              loading="lazy"
            />
            <p className="text-base text-muted-foreground">
              © {new Date().getFullYear()} Prodigy Corp
            </p>
          </div>

          {/* Right: Follow Us + Social Icons */}
          <div className="flex items-center gap-4">
            <p className="text-base text-muted-foreground">{t('contact.social.followUs')}</p>
            <div className="flex gap-3">
              {[
                { name: t('contact.social.platforms.x'), icon: <XIcon />, href: "https://x.com/prodigy_corp" },
                { name: t('contact.social.platforms.instagram'), icon: <InstagramIcon />, href: "https://www.instagram.com/prodigy_corp/" },
                { name: t('contact.social.platforms.facebook'), icon: <FacebookIcon />, href: "https://www.facebook.com/prodigycorp.io/" },
              ].map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl flex items-center justify-center text-foreground hover:border-primary/50 hover:bg-primary/10 transition-all duration-300"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
