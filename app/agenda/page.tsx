// app/agenda/page.tsx
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getSEOMetadata } from "@/lib/seo"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export const metadata = getSEOMetadata({
  title: "Conversa Estratégica (45 min) - Straggia",
  description: "Converse 45 min com um especialista e receba próximos passos práticos. Sem compromisso.",
  path: "/agenda",
})

export default function AgendaPage() {
  const bookingUrl = "https://calendar.app.google/he9LRTQy6LTE2kZJ6"

  return (
    <main className="min-h-screen bg-background">
      {/* Navbar fixa */}
      <Navbar />

      {/* Header */}
      <header className="bg-card border-b border-border pt-28 md:pt-32 pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Button asChild variant="outline" className="mb-6 bg-transparent">
              <Link href="/">← Voltar ao início</Link>
            </Button>

            <h1 className="text-4xl md:text-5xl font-display font-bold text-balance mb-4">
              <span className="text-primary">Conversa</span> Estratégica
            </h1>
            <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto leading-relaxed">
              45 min para entender seu contexto e sugerir próximos passos. Sem compromisso.
            </p>
          </div>
        </div>
      </header>

      {/* Agenda / Conteúdo */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-8">
          <Card className="bg-card border-border">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-display">Agendar conversa</CardTitle>
              <CardDescription className="text-base">
                Abra a agenda do Google para escolher o melhor horário.
              </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col items-center gap-4">
              <Button asChild className="px-6">
                <a href={bookingUrl} target="_blank" rel="noopener noreferrer">
                  Abrir agenda
                </a>
              </Button>

              <p className="text-sm text-muted-foreground text-center">
                Privacidade garantida. NDA disponível sob demanda.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-xl font-display text-primary">O que esperar</CardTitle>
              <CardDescription>Em 45 minutos, cobrimos o essencial:</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc ml-5 leading-relaxed">
                <li>Entendimento rápido das prioridades e métricas.</li>
                <li>Identificação das alavancas de resultado nos próximos 90 dias.</li>
                <li>Próximos passos claros (com ou sem proposta).</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </main>
  )
}