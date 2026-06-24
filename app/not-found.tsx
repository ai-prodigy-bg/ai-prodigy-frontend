import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { getServerTranslations } from "../lib/translations/server"

const LOGO_SRC = "/favicon_io/prodigy-corp-logo.png"

export const metadata: Metadata = {
  title: "404",
  robots: {
    index: false,
    follow: false,
  },
}

export default async function NotFound() {
  const { locale, t } = await getServerTranslations()
  const homeHref = locale === "bg" ? "/bg" : "/"
  const contactHref = locale === "bg" ? "/bg#contact" : "/#contact"

  return (
    <main className="relative flex min-h-screen items-center overflow-hidden bg-black px-6 py-24 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-[length:26px_26px] opacity-[0.045]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[72vw] max-h-[820px] w-[72vw] max-w-[820px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.12),rgba(255,255,255,0.03)_42%,transparent_70%)] blur-2xl" />
      <div className="pointer-events-none absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-cyan-400/12 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-1/4 h-72 w-72 rounded-full bg-fuchsia-500/14 blur-3xl" />

      <section className="relative mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative mx-auto aspect-square w-full max-w-[360px] sm:max-w-[440px] lg:max-w-[520px]">
          <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_140deg,rgba(103,248,255,0.38),rgba(255,255,255,0.08),rgba(255,71,215,0.38),rgba(255,255,255,0.04),rgba(103,248,255,0.38))] blur-md" />
          <div className="relative h-full w-full overflow-hidden rounded-[28px] border border-white/10 bg-black shadow-[0_0_80px_rgba(255,255,255,0.08)]">
            <Image
              src={LOGO_SRC}
              alt={t("notFound.logoAlt")}
              fill
              priority
              sizes="(max-width: 640px) 360px, (max-width: 1024px) 440px, 520px"
              className="object-cover"
            />
          </div>
        </div>

        <div className="mx-auto max-w-2xl text-center lg:mx-0 lg:text-left">
          <p className="mb-5 font-mono text-[12px] uppercase tracking-[0.34em] text-white/42">{t("notFound.eyebrow")}</p>
          <div className="mb-6 font-mono text-[clamp(88px,18vw,220px)] leading-[0.8] text-white">{t("notFound.code")}</div>
          <h1 className="mb-6 text-[clamp(42px,7vw,84px)] font-normal leading-[0.95] tracking-normal text-white">
            {t("notFound.title")}
          </h1>
          <p className="mx-auto mb-9 max-w-xl text-[16px] leading-relaxed text-white/58 sm:text-[18px] lg:mx-0">
            {t("notFound.description")}
          </p>

          <div className="flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
            <Link
              href={homeHref}
              className="inline-flex h-14 items-center justify-center rounded-full bg-white px-7 text-[14px] font-bold text-black transition-colors duration-200 hover:bg-[#e2e2e6]"
            >
              {t("notFound.homeCta")}
            </Link>
            <Link
              href={contactHref}
              className="inline-flex h-14 items-center justify-center rounded-full border border-white/14 bg-white/[0.07] px-7 text-[14px] font-bold text-white transition-colors duration-200 hover:bg-white/12"
            >
              {t("notFound.contactCta")}
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
