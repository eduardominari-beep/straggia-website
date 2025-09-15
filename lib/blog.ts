// lib/blog.ts
import fs from "node:fs"
import path from "node:path"
import matter from "gray-matter"

export interface BlogPost {
  slug: string
  title: string
  date: string
  description: string
  tags: string[]
  content: string
}

const POSTS_DIR = path.join(process.cwd(), "content", "posts")

function readMdx(slug: string) {
  const file = path.join(POSTS_DIR, `${slug}.mdx`)
  if (!fs.existsSync(file)) return null
  const raw = fs.readFileSync(file, "utf8")
  const { data, content } = matter(raw)
  return { data, content }
}

export function getAllPosts(): BlogPost[] {
  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".mdx"))

  const posts = files.map((file) => {
    const slug = file.replace(/\.mdx$/, "")
    const parsed = readMdx(slug)!
    const data = parsed.data as Record<string, any>

    return {
      slug,
      title: data.title ?? slug,
      date: data.date ?? new Date().toISOString().slice(0, 10),
      description: data.description ?? "",
      tags: Array.isArray(data.tags) ? data.tags : [],
      content: parsed.content,
    } as BlogPost
  })

  // Ordena por data desc
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1))
}

export function getPostBySlug(slug: string): BlogPost | null {
  const parsed = readMdx(slug)
  if (!parsed) return null
  const data = parsed.data as Record<string, any>

  return {
    slug,
    title: data.title ?? slug,
    date: data.date ?? new Date().toISOString().slice(0, 10),
    description: data.description ?? "",
    tags: Array.isArray(data.tags) ? data.tags : [],
    content: parsed.content,
  }
}

export function getRecentPosts(limit = 2): BlogPost[] {
  return getAllPosts().slice(0, limit)
}