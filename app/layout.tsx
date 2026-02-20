// app/layout.tsx
import type { Metadata } from "next"
import Script from "next/script"
import { Inter, Poppins } from "next/font/google"
import "./globals.css"
import { getSEOMetadata } from "@/lib/seo"
import SeoJsonLd from "@/components/SeoJsonLd"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.straggia.com"

// ✅ GA4 (Measurement ID)
const GA4_ID = "G-F32C4E85KT"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-poppins" })

export const metadata: Metadata = {
  ...getSEOMetadata({
    title: "Straggia Consultoria",
    description: "Clareza estratégica, execução efetiva, resultados mensuráveis e pessoas no centro.",
  }),
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "48x48" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180" }],
    shortcut: ["/favicon.ico"],
  },
  themeColor: "#0b0b0b",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${poppins.variable}`}>
      <head>
        {/* ✅ Google Analytics 4 (gtag.js) */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA4_ID}', {
              send_page_view: true
            });
          `}
        </Script>
      </head>

      <body>
        <SeoJsonLd siteUrl={SITE_URL} sameAs={["https://www.linkedin.com/company/straggia"]} />
        {children}
      </body>
    </html>
  )
}