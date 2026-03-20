import { notFound } from "next/navigation"
import Link from "next/link"
import { MDXRemote } from "next-mdx-remote/rsc"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getPostBySlug, getAllPosts } from "@/lib/blog"
import { getSEOMetadata } from "@/lib/seo"

interface BlogPostPageProps {
  params: { slug: string }
}

function formatBrazilianDate(dateValue?: string) {
  if (!dateValue) return ""

  const match = String(dateValue).match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (!match) return dateValue

  const [, year, month, day] = match
  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(Number(year), Number(month) - 1, Number(day)))
}

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const post = getPostBySlug(params.slug)

  if (!post) {
    return getSEOMetadata({ path: "/blog" })
  }

  return getSEOMetadata({
    title: `${post.title} - Blog Straggia`,
    description: post.description ?? "",
    path: `/blog/${params.slug}`,
    type: "article",
    publishedTime: post.date,
  })
}

// --- COMPONENTE DA TABELA (VERSÃO FINAL E LIMPA) ---
const MatrizRisco = ({ lang }: { lang: "pt" | "en" }) => {
  const isPt = lang === "pt"

  const rowsPt = [
    ["Sobrecarga de trabalho", "Volume excessivo, prazos inatingíveis, metas arrojadas/abusivas.", "Alta", "Alto", "Alto/Crítico", "Redesenho do trabalho, redistribuição das tarefas, contratação, gestão de prioridades, pausas ativas."],
    ["Falta de autonomia", "Pouco ou baixo controle sobre o trabalho e tarefas, incluindo organizar e planejar o próprio trabalho.", "Média", "Alto", "Alto", "Flexibilização do método de trabalho, gerenciamento de tarefas, poder de decisão sobre as funções."],
    ["Assédio moral/sexual e violência", "Exposição repetitiva a situações humilhantes e constrangedoras, perseguições, discriminação, abuso psicológico ou sexual.", "Média", "Crítico", "Crítico", "Políticas de prevenção, canal de denúncia, apuração, cultura de respeito, responsabilização dos agressores."],
    ["Conflitos interpessoais", "Ambiente com comunicação hostil, rivalidade excessiva, ausência de cooperação e apoio.", "Média", "Médio / Alto", "Médio / Alto", "Mediação de conflitos, desenvolvimento de lideranças, pactuação de rotinas, fortalecimento da comunicação e do trabalho em equipe."],
    ["Baixo reconhecimento", "Falta de feedback, valorização, justiça percebida e reconhecimento do esforço e dos resultados.", "Média", "Médio", "Médio", "Estruturar rituais de feedback, critérios claros de reconhecimento, desenvolvimento gerencial e práticas de valorização."]
  ]

  const rowsEn = [
    ["Work overload", "Excessive workload, unrealistic deadlines, overly aggressive or abusive targets.", "High", "High", "High/Critical", "Work redesign, task redistribution, hiring, priority management, and active breaks."],
    ["Lack of autonomy", "Little or low control over work and tasks, including organizing and planning one’s own work.", "Medium", "High", "High", "Greater flexibility in work methods, task management, and decision-making power over one’s role."],
    ["Moral/sexual harassment and violence", "Repeated exposure to humiliating and embarrassing situations, persecution, discrimination, psychological abuse, or sexual abuse.", "Medium", "Critical", "Critical", "Prevention policies, reporting channels, investigation, a culture of respect, and accountability for aggressors."],
    ["Interpersonal conflicts", "An environment marked by hostile communication, excessive rivalry, and lack of cooperation and support.", "Medium", "Medium / High", "Medium / High", "Conflict mediation, leadership development, agreed routines, and stronger communication and teamwork."],
    ["Low recognition", "Lack of feedback, appreciation, perceived fairness, and recognition of effort and results.", "Medium", "Medium", "Medium", "Establish feedback routines, clear recognition criteria, managerial development, and appreciation practices."]
  ]

  const rows = isPt ? rowsPt : rowsEn

  return (
    <div className="my-8 w-full rounded-lg border border-border shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm bg-card text-foreground">
          <thead className="bg-muted/50 text-primary">
            <tr>
              <th className="border-b border-border p-4 align-top font-bold">{isPt ? "Fator" : "Factor"}</th>
              <th className="border-b border-border p-4 align-top font-bold">{isPt ? "Descrição" : "Description"}</th>
              <th className="border-b border-border p-4 align-top font-bold">{isPt ? "Probabilidade" : "Probability"}</th>
              <th className="border-b border-border p-4 align-top font-bold">{isPt ? "Severidade" : "Severity"}</th>
              <th className="border-b border-border p-4 align-top font-bold">{isPt ? "Nível de risco" : "Risk level"}</th>
              <th className="border-b border-border p-4 align-top font-bold">{isPt ? "Ação preventiva" : "Preventive action"}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((row, i) => (
              <tr key={i} className="hover:bg-muted/20 transition-colors">
                <td className="p-4 align-top font-medium whitespace-nowrap">{row[0]}</td>
                <td className="p-4 align-top min-w-[200px]">{row[1]}</td>
                <td className="p-4 align-top">{row[2]}</td>
                <td className="p-4 align-top">{row[3]}</td>
                <td className="p-4 align-top font-bold">{row[4]}</td>
                <td className="p-4 align-top min-w-[200px]">{row[5]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const mdxComponents = {
  h1: (props: any) => <h1 className="text-3xl font-display font-bold mb-6 text-primary" {...props} />,
  h2: (props: any) => <h2 className="text-2xl font-display font-semibold mb-4 text-primary mt-8" {...props} />,
  h3: (props: any) => <h3 className="text-xl font-display font-semibold mb-3 text-primary mt-6" {...props} />,
  p: (props: any) => <p className="mb-4 leading-relaxed text-foreground" {...props} />,
  ul: (props: any) => <ul className="mb-4 ml-6 list-disc space-y-2" {...props} />,
  ol: (props: any) => <ol className="mb-4 ml-6 list-decimal space-y-2" {...props} />,
  li: (props: any) => <li className="leading-relaxed" {...props} />,
  blockquote: (props: any) => (
    <blockquote className="border-l-4 border-primary pl-4 my-6 italic text-muted-foreground" {...props} />
  ),
  code: (props: any) => <code className="bg-muted px-2 py-1 rounded text-sm text-primary font-mono" {...props} />,
  pre: (props: any) => <pre className="prism-code mb-6 text-sm overflow-x-auto" {...props} />,
  a: (props: any) => <a className="text-primary hover:text-secondary underline transition-colors" {...props} />,
  MatrizRisco, // O componente é registado aqui para o MDX conseguir renderizá-lo!
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Button asChild variant="outline" className="mb-6 bg-transparent">
            <Link href="/blog">← Voltar ao blog</Link>
          </Button>

          <div className="flex items-center gap-4 mb-4 flex-wrap">
            <time className="text-sm text-muted-foreground" dateTime={post.date ?? ""}>
              {formatBrazilianDate(post.date)}
            </time>

            {!!post.tags?.length && (
              <div className="flex gap-2 flex-wrap">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl font-display font-bold text-balance mb-4">
            {post.title}
          </h1>

          <p className="text-xl text-muted-foreground text-pretty leading-relaxed">
            {post.description ?? ""}
          </p>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-none">
          <MDXRemote source={post.content ?? ""} components={mdxComponents} />
        </div>

        <div className="mt-16 pt-8 border-t border-border text-center">
          <Button asChild size="lg">
            <Link href="/blog">Ver mais artigos</Link>
          </Button>
        </div>
      </article>
    </main>
  )
}