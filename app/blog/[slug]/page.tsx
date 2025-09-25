// app/blog/[slug]/page.tsx
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

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const post = getPostBySlug(params.slug)
  if (!post) return getSEOMetadata({ path: "/blog" })

  return getSEOMetadata({
    title: `${post.title} - Blog Straggia`,
    description: post.description,
    path: `/blog/${params.slug}`,
    type: "article",
    publishedTime: post.date, // usa a data do post
  })
}

const mdxComponents = {
  h1: (props: any) => <h1 className="text-3xl font-display font-bold mb-6 text-primary" {...props} />,
  h2: (props: any) => <h2 className="text-2xl font-display font-semibold mb-4 text-primary mt-8" {...props} />,
  h3: (props: any) => <h3 className="text-xl font-display font-semibold mb-3 text-primary mt-6" {...props} />,
  p:  (props: any) => <p className="mb-4 leading-relaxed text-foreground" {...props} />,
  ul: (props: any) => <ul className="mb-4 ml-6 list-disc space-y-2" {...props} />,
  ol: (props: any) => <ol className="mb-4 ml-6 list-decimal space-y-2" {...props} />,
  li: (props: any) => <li className="leading-relaxed" {...props} />,
  blockquote: (props: any) => (
    <blockquote className="border-l-4 border-primary pl-4 my-6 italic text-muted-foreground" {...props} />
  ),
  code: (props: any) => <code className="bg-muted px-2 py-1 rounded text-sm text-primary font-mono" {...props} />,
  pre:  (props: any) => <pre className="prism-code mb-6 text-sm overflow-x-auto" {...props} />,
  a:   (props: any) => <a className="text-primary hover:text-secondary underline transition-colors" {...props} />,
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getPostBySlug(params.slug)
  if (!post) notFound()

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Button asChild variant="outline" className="mb-6 bg-transparent">
            <Link href="/blog">← Voltar ao blog</Link>
          </Button>

          <div className="flex items-center gap-4 mb-4">
            <time className="text-sm text-muted-foreground" dateTime={post.date}>
              {new Date(post.date).toLocaleDateString("pt-BR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            {post.tags.length > 0 && (
              <div className="flex gap-2">
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
            {post.description}
          </p>
        </div>
      </div>

      {/* Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg max-w-none">
          <MDXRemote source={post.content} components={mdxComponents} />
        </div>

        {/* Back to blog */}
        <div className="mt-16 pt-8 border-t border-border text-center">
          <Button asChild size="lg">
            <Link href="/blog">Ver mais artigos</Link>
          </Button>
        </div>
      </article>
    </main>
  )
}