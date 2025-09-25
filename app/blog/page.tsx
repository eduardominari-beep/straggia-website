// app/blog/page.tsx
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getAllPosts } from "@/lib/blog"
import { getSEOMetadata } from "@/lib/seo"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export const metadata = getSEOMetadata({
  title: "Blog - Straggia",
  description: "Insights práticos e metodologias comprovadas para acelerar seus resultados empresariais.",
})

export default function BlogPage() {
  // 1) carrega
  const postsRaw = getAllPosts()
  // 2) garante ordem: mais novo -> mais antigo
  const posts = [...postsRaw].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  return (
    <main className="min-h-screen bg-background">
      {/* Navbar fixa (mesmo padrão das demais páginas) */}
      <Navbar />

      {/* Header */}
      <header className="bg-card border-b border-border pt-28 md:pt-32 pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Button asChild variant="outline" className="mb-6 bg-transparent">
              <Link href="/">← Voltar ao início</Link>
            </Button>

            <h1 className="text-4xl md:text-5xl font-display font-bold text-balance mb-4">
              <span className="text-primary">Conteúdo</span> Estratégico
            </h1>
            <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto leading-relaxed">
              Insights práticos e metodologias comprovadas para acelerar seus resultados
            </p>
          </div>
        </div>
      </header>

      {/* Blog posts */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {posts.length > 0 ? (
          <div className="space-y-8">
            {posts.map((post) => (
  <Card
    key={post.slug}
    className="bg-card border-border hover:border-primary transition-colors group"
  >
    <article>
      <CardHeader>
        <div className="flex items-center gap-4 mb-2">
          <time className="text-sm text-muted-foreground" dateTime={post.date}>
            {new Date(post.date).toLocaleDateString("pt-BR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          {!!post.tags?.length && (
            <div className="flex gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <CardTitle className="text-2xl font-display group-hover:text-primary transition-colors">
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <CardDescription className="text-muted-foreground leading-relaxed mb-4 text-base">
          {post.description}
        </CardDescription>

        <Button
          asChild
          variant="outline"
          className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground bg-transparent"
        >
           <Link href={`/blog/${post.slug}`}>Ler artigo completo</Link>
           </Button>
           </CardContent>
           </article>
           </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-2xl font-display font-semibold mb-2 text-primary">
              Em breve, novos conteúdos
            </h2>
            <p className="text-muted-foreground mb-6">
              Estamos preparando artigos exclusivos sobre estratégia e gestão.
            </p>
            <Button asChild>
              <Link href="/">Voltar ao início</Link>
            </Button>
          </div>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </main>
  )
}
