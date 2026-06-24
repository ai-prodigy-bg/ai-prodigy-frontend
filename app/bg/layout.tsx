import type { Metadata } from "next"
import { getBaseUrl, getAlternateUrls } from "../../lib/utils/seo"

const baseUrl = getBaseUrl()
const alternateUrls = getAlternateUrls()
const logoUrl = `${baseUrl}/favicon_io/prodigy-corp-logo.png`

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Prodigy Corp - Премиум Дигитални Решения | Разработка с AI",
    template: "%s | Prodigy Corp"
  },
  description:
    "Премиум дигитални продукти, задвижвани от AI. Работим по-бързо, по-умно и на достъпна цена. Мобилни приложения, уеб приложения, уебсайтове и дигитални услуги. Базирани в Пловдив, България.",
  keywords: [
    "уеб разработка",
    "разработка на приложения",
    "дигитални услуги",
    "AI разработка",
    "мобилни приложения",
    "уеб приложения",
    "електронна търговия",
    "дигитална трансформация",
    "Prodigy Corp",
    "България",
    "Пловдив",
    "разработка на софтуер",
    "дигитални решения"
  ],
  authors: [{ name: "Prodigy Corp" }],
  creator: "Prodigy Corp",
  publisher: "Prodigy Corp",
  openGraph: {
    type: "website",
    locale: "bg_BG",
    url: alternateUrls.bg,
    siteName: "Prodigy Corp",
    title: "Prodigy Corp - Премиум Дигитални Решения | Разработка с AI",
    description: "Премиум дигитални продукти, задвижвани от AI. Работим по-бързо, по-умно и на достъпна цена. Мобилни приложения, уеб приложения, уебсайтове и дигитални услуги.",
    images: [
      {
        url: logoUrl,
        width: 1200,
        height: 1200,
        alt: "Prodigy Corp - Премиум Дигитални Решения",
      },
    ],
    alternateLocale: ["en_US"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Prodigy Corp - Премиум Дигитални Решения | Разработка с AI",
    description: "Премиум дигитални продукти, задвижвани от AI. Работим по-бързо, по-умно и на достъпна цена.",
    images: [logoUrl],
    creator: "@prodigycorp",
  },
  alternates: {
    canonical: alternateUrls.bg,
    languages: {
      "en": alternateUrls.en,
      "bg": alternateUrls.bg,
      "x-default": alternateUrls.xDefault,
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default function BulgarianLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
