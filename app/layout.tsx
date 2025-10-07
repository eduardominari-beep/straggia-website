// app/layout.tsx
import type { Metadata } from "next"
import { Inter, Poppins } from "next/font/google"
import "./globals.css"
import { getSEOMetadata } from "@/lib/seo"
import SeoJsonLd from "@/components/SeoJsonLd"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.straggia.com"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const poppins = Poppins({ subsets: ["latin"], weight: ["400","500","600","700"], variable: "--font-poppins" })

export const metadata: Metadata = {
  ...getSEOMetadata({
    title: "Straggia Consultoria",
    description: "Clareza estratégica, execução efetiva, resultados mensuráveis e pessoas no centro.",
  }),
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },                 // .ico multi-res
      { url: "/icon.png", type: "image/png", sizes: "48x48" } // PNG para o Google
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180" }],
    shortcut: ["/favicon.ico"],
  },
  themeColor: "#0b0b0b",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${poppins.variable}`}>
      <body>
        <SeoJsonLd siteUrl={SITE_URL} sameAs={["https://www.linkedin.com/company/straggia"]} />
        {children}
      </body>
    </html>
  )
}