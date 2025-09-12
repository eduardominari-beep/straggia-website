import type { Metadata } from "next"

interface SEOProps {
  title?: string
  description?: string
  image?: string
  url?: string
}

export function getSEOMetadata({
  title = "Straggia - Consultoria que conecta estratégia à prática",
  description = "Clareza executável, método comprovado e resultados mensuráveis — com pessoas no centro.",
  image = "/brand/og-image.jpg",
  url = process.env.NEXT_PUBLIC_SITE_URL ?? "https://straggia.com",
}: SEOProps = {}): Metadata {
  return {
    title,
    description,
    metadataBase: new URL(url),
    openGraph: {
      title,
      description,
      images: [image],
      url,
      siteName: "Straggia",
      locale: "pt_BR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}
