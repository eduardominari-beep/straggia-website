import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="text-6xl mb-6">🔍</div>
        <h1 className="text-4xl font-display font-bold mb-4 text-primary">Página não encontrada</h1>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          A página que você está procurando não existe ou foi movida.
        </p>
        <div className="space-y-4">
          <Button asChild size="lg" className="w-full">
            <Link href="/">Voltar ao início</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full bg-transparent">
            <Link href="/blog">Ver nosso blog</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
