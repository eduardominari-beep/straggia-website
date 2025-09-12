"use client"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section id="inicio" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-card to-muted"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-balance mb-6">
            Consultoria que conecta <span className="text-accent">estratégia</span> à{" "}
            <span className="text-secondary">prática</span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground text-pretty mb-8 max-w-3xl mx-auto leading-relaxed">
            Clareza executável, método comprovado e resultados mensuráveis — com pessoas no centro.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              asChild
              size="lg"
              className="px-8 py-3 text-lg"
              style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}
            >
              <a
                href="https://wa.me/5516996317472"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Entrar em contato via WhatsApp"
              >
                Falar no WhatsApp
              </a>
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={() => scrollToSection("#pre-diagnostico")}
              className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground px-8 py-3 text-lg"
            >
              Pré-Diagnóstico Gratuito
            </Button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-accent rounded-full flex justify-center">
          <div className="w-1 h-3 bg-accent rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  )
}
