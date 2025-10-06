import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Poppins } from "next/font/google"
import "./globals.css"
import { getSEOMetadata } from "@/lib/seo"
import SeoJsonLd from "@/components/SeoJsonLd"
import { ThemeProvider } from "@/components/theme-provider"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.straggia.com"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
})

export const metadata: Metadata = {
  ...getSEOMetadata({
    title: "Straggia Consultoria",
    description:
      "Clareza estratégica, execução efetiva, resultados mensuráveis e pessoas no centro.",
  }),
  icons: {
    icon: "/icon.png",          // Next serve em /icon.png
    shortcut: "/favicon.ico",   // multi-res .ico
    apple: "/apple-icon.png",   // /apple-icon.png
  },
  alternates: {
    canonical: SITE_URL,
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0b0b" },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.variable} ${poppins.variable} bg-background text-foreground antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SeoJsonLd
            siteUrl={SITE_URL}
            sameAs={[
              "https://www.linkedin.com/company/straggia",
            ]}
          />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}