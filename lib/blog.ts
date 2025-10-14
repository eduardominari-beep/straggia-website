// lib/blog.ts
import fs from "node:fs"
import path from "node:path"
import matter from "gray-matter"
import { execSync } from "node:child_process"

export interface BlogPost {
  slug: string
  title: string
  date?: string            // vem do front-matter (opcional)
  description?: string
  tags: string[]
  content: string
}

const POSTS_DIR = path.join(process.cwd(), "content", "posts")

type Parsed = {
  data: Record<string, any>
  content: string
  fullPath: string
}

function readMdx(slug: string): Parsed | null {
  const fullPath = path.join(POSTS_DIR, `${slug}.mdx`)
  if (!fs.existsSync(fullPath)) return null
  const raw = fs.readFileSync(fullPath, "utf8")
  const { data, content } = matter(raw)
  return { data, content, fullPath }
}

// timestamp do último commit; fallback: mtime
function fileTimeMs(fullPath: string): number {
  try {
    const out = execSync(`git log -1 --pretty=%ct -- "${fullPath}"`, {
      stdio: ["ignore", "pipe", "ignore"],
    })
      .toString()
      .trim()
    const sec = Number(out)
    if (Number.isFinite(sec)) return sec * 1000
  } catch {}
  try {
    return fs.statSync(fullPath).mtimeMs
  } catch {
    return 0
  }
}

// converte front-matter date -> ms, ou NaN
function dateMs(date?: string): number {
  if (!date) return NaN
  const t = Date.parse(date)
  return Number.isFinite(t) ? t : NaN
}

export function getAllPosts(): BlogPost[] {
  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".mdx"))

  const posts = files.map((file) => {
    const slug = file.replace(/\.mdx$/, "")
    const parsed = readMdx(slug)!
    const d = parsed.data

    const post: BlogPost = {
      slug,
      title: d.title ?? slug,
      date: d.date, // mantemos o que vier do front-matter
      description: d.description ?? "",
      tags: Array.isArray(d.tags) ? d.tags : [],
      content: parsed.content,
    }

    // chave de ordenação unificada
    const sortMs = Number.isFinite(dateMs(d.date))
      ? dateMs(d.date)
      : fileTimeMs(parsed.fullPath)

    return { post, sortMs }
  })

  posts.sort((a, b) => b.sortMs - a.sortMs)

  return posts.map(({ post }) => post)
}

export function getRecentPosts(limit = 2): BlogPost[] {
  return getAllPosts().slice(0, limit)
}

export function getPostBySlug(slug: string): BlogPost | null {
  const parsed = readMdx(slug)
  if (!parsed) return null
  const d = parsed.data
  return {
    slug,
    title: d.title ?? slug,
    date: d.date,
    description: d.description ?? "",
    tags: Array.isArray(d.tags) ? d.tags : [],
    content: parsed.content,
  }
}