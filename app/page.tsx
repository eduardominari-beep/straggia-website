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

      {/* nova seção de contato para bater com o #contato do Navbar */}
      <section id="contato" className="bg-card border-t border-border py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Vamos conversar?
          </h2>
          <p className="text-muted-foreground mb-6">
            Agende uma conversa de 45 minutos ou fale direto comigo no WhatsApp.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="px-8 py-3">
              <Link href="/agenda">Agendar conversa</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="px-8 py-3 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground"
            >
              <Link
                href="https://wa.me/5516996317472"
                target="_blank"
                rel="noopener noreferrer"
              >
                Falar no WhatsApp
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}