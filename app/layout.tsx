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
  // 👇 cache-busting aqui
  icons: {
    icon: [
      { url: "/favicon.ico?v=3" },
      { url: "/icon.png?v=3", type: "image/png", sizes: "any" },
    ],
    apple: "/apple-icon.png?v=3",
  },
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