// components/hero-section.tsx
"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section id="inicio" className="relative flex min-h-[calc(100vh-7rem)] items-center justify-center overflow-hidden py-16 md:py-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(208,126,62,0.14),transparent_30%),linear-gradient(135deg,#ffffff_0%,#f4f1ee_48%,#e8e5e3_100%)]" />
      <div className="absolute inset-0 straggia-texture opacity-70" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <p className="mb-5 inline-flex items-center border border-primary/25 bg-background/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary shadow-sm backdrop-blur">
            Sistema Straggia de Performance
          </p>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-balance mb-6 leading-[1.02]">
            Estratégia que<span className="text-accent"> move pessoas</span> e transforma{" "}
            <span className="text-secondary"> organizações.</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground text-pretty mb-8 max-w-3xl mx-auto leading-relaxed">
            Clareza estratégica, execução efetiva, resultados mensuráveis e pessoas no centro.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              asChild
              size="lg"
              className="px-8 py-3 text-lg shadow-lg shadow-primary/15"
              style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}
            >
              <Link href="/lp/performance">Fale conosco</Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="px-8 py-3 text-lg border-secondary/60 bg-background/50 text-secondary hover:bg-secondary hover:text-secondary-foreground"
            >
              <Link href="#solucoes">Ver soluções</Link>
            </Button>

            <Button asChild variant="outline" size="lg" className="px-8 py-3 text-lg bg-background/50">
              <Link href="/quem-somos">Quem somos</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-accent rounded-full flex justify-center">
          <div className="w-1 h-3 bg-accent rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  )
}
