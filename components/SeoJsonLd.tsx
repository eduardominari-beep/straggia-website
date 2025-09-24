"use client"

import Script from "next/script"

type Props = {
  siteUrl: string
  brandName?: string
  logoUrl?: string
  sameAs?: string[] // LinkedIn, Instagram, YouTube etc.
}

export default function SeoJsonLd({
  siteUrl,
  brandName = "Straggia Consultoria",
  logoUrl = `${siteUrl}/brand/logo-horizontal.jpg`,
  sameAs = [],
}: Props) {
  const org = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: brandName,
    url: siteUrl,
    logo: logoUrl,
    sameAs,
  }

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: brandName,
    url: siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  }

  return (
    <>
      <Script id="ld-org" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(org) }} />
      <Script id="ld-website" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }} />
    </>
  )
}