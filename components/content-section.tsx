import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Mock data for client-side rendering - will be replaced with server-side data
const mockRecentPosts = [
  {
    title: "Por que OKRs são bússola, não cura",
    date: "2024-01-15",
    description: "Entenda como usar OKRs de forma estratégica para navegar em direção aos seus objetivos.",
    slug: "okr-bussola",
  },
  {
    title: "Do apagar incêndios à operação sustentável",
    date: "2024-01-10",
    description: "Como transformar uma gestão reativa em um sistema proativo e sustentável.",
    slug: "operacao-sustentavel",
  },
]

interface ContentSectionProps {
  recentPosts?: Array<{
    title: string
    date: string
    description: string
    slug: string
  }>
}

export function ContentSection({ recentPosts = mockRecentPosts }: ContentSectionProps) {
  return (
    <section id="conteudo" className="py-20 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-balance mb-4">
            <span className="text-primary">Conteúdo</span> Estratégico
          </h2>
          <p className="text-xl text-muted-foreground text-pretty max-w-3xl mx-auto leading-relaxed">
            Insights práticos e metodologias comprovadas para acelerar seus resultados
          </p>
        </div>

        {recentPosts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {recentPosts.map((post, index) => (
                <Card key={index} className="bg-background border-border hover:border-primary transition-colors group">
                  <CardHeader>
                    <div className="text-sm text-muted-foreground mb-2">
                      {new Date(post.date).toLocaleDateString("pt-BR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                    <CardTitle className="text-xl font-display group-hover:text-primary transition-colors">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-muted-foreground leading-relaxed mb-4">
                      {post.description}
                    </CardDescription>
                    <Button
                      asChild
                      variant="outline"
                      className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground bg-transparent"
                    >
                      <Link href={`/blog/${post.slug}`}>Ler mais</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/blog">Ver todos os artigos</Link>
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-display font-semibold mb-2 text-primary">Em breve, novos conteúdos</h3>
            <p className="text-muted-foreground mb-6">
              Estamos preparando artigos exclusivos sobre estratégia e gestão.
            </p>
            <Button asChild>
              <Link href="/blog">Acessar blog</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
