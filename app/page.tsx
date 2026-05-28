// app/page.tsx
import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { SolutionsSection } from "@/components/solutions-section"
import { MethodSection } from "@/components/method-section"
import { ContentSection } from "@/components/content-section"
import { Footer } from "@/components/footer"
import { getRecentPosts } from "@/lib/blog"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  const recentPosts = getRecentPosts(2)

  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <SolutionsSection />
      <MethodSection />
      <ContentSection recentPosts={recentPosts} />

      <section id="performance" className="relative overflow-hidden bg-secondary py-16 text-secondary-foreground md:py-20">
        <div className="absolute inset-0 straggia-texture opacity-20" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            Diagnóstico de gestão e crescimento
          </p>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-balance">
            Transforme intenção estratégica em performance mensurável.
          </h2>
          <p className="mx-auto mb-7 max-w-2xl text-secondary-foreground/78">
            Acesse a LP Performance para entender como a Straggia organiza metas, rituais, indicadores e liderança em um sistema prático de execução.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="px-8 py-3 bg-primary text-primary-foreground shadow-lg shadow-black/15 hover:bg-primary/90">
              <Link href="/lp/performance">Fale conosco</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="px-8 py-3 border-secondary-foreground/30 bg-transparent text-secondary-foreground hover:bg-secondary-foreground hover:text-secondary"
            >
              <Link href="/quem-somos">Conhecer a Straggia</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
