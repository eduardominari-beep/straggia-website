// lib/seo.ts
import type { Metadata } from "next"

type OgType = "website" | "article"

interface SEOProps {
  title?: string
  description?: string
  image?: string              // pode ser /brand/og.jpg ou URL absoluta
  url?: string                // BASE do site
  path?: string               // ex: "/quem-somos", "/blog/okrs-bussola"
  type?: OgType               // default: "website"
  publishedTime?: string      // para artigos
  modifiedTime?: string       // para artigos
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.straggia.com"

function absUrl(u: string) {
  if (!u) return SITE_URL
  if (u.startsWith("http://") || u.startsWith("https://")) return u
  return `${SITE_URL}${u.startsWith("/") ? u : `/${u}`}`
}

export function getSEOMetadata({
  title = "Straggia Consultoria",
  description = "Clareza estratégica, execução efetiva, resultados mensuráveis e pessoas no centro.",
  image = "/brand/og-image.jpg",
  url = SITE_URL,
  path = "/",
  type = "website",
  publishedTime,
  modifiedTime,
}: SEOProps = {}): Metadata {
  const canonicalPath = path.startsWith("/") ? path : `/${path}`
  const ogImage = absUrl(image)

  return {
    title,
    description,
    metadataBase: new URL(url),
    alternates: {
      canonical: canonicalPath, // <link rel="canonical" ...>
    },
    openGraph: {
      type,
      url: canonicalPath,       // combinado com metadataBase vira URL absoluta
      siteName: "Straggia",
      title,
      description,
      images: [{ url: ogImage }],
      ...(type === "article"
        ? { publishedTime, modifiedTime, locale: "pt_BR" }
        : { locale: "pt_BR" }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    robots: { index: true, follow: true },
  }
}