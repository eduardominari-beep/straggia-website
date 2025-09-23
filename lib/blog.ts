// lib/blog.ts
import fs from "node:fs"
import path from "node:path"
import matter from "gray-matter"

export interface BlogPost {
  slug: string
  title: string
  date: string        // armazenamos a string do front-matter
  description: string
  tags: string[]
  content: string
}

/* ---------- utils de FS e caminho ---------- */
function exists(p: string) {
  try {
    fs.accessSync(p)
    return true
  } catch {
    return false
  }
}

// Aceita "content/posts" (recomendado) ou "posts"
function getPostsDir(): string {
  const a = path.join(process.cwd(), "content", "posts")
  const b = path.join(process.cwd(), "posts")
  if (exists(a)) return a
  if (exists(b)) return b
  throw new Error('Nenhuma pasta de posts encontrada. Crie "content/posts" (recomendado) ou "posts".')
}

/* ---------- slug ---------- */
function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

/* ---------- parser de data “esperto” ---------- */
const PT_MONTHS = [
  "janeiro","fevereiro","março","abril","maio","junho",
  "julho","agosto","setembro","outubro","novembro","dezembro"
]

/**
 * Retorna um timestamp (ms UTC) para ordenar:
 * 1) ISO YYYY-MM-DD
 * 2) DD/MM/YYYY
 * 3) "DD de <mês> de YYYY" (pt-BR)
 * 4) fallback: mtime do arquivo
 */
function parseDateSmart(raw: string | undefined, fullPath: string): number {
  // 1) ISO
  if (raw && /^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    const t = Date.parse(raw + "T00:00:00Z")
    if (!Number.isNaN(t)) return t
  }
  // 2) DD/MM/YYYY
  if (raw && /^\d{2}\/\d{2}\/\d{4}$/.test(raw)) {
    const [dd, mm, yyyy] = raw.split("/").map(Number)
    const t = Date.UTC(yyyy, mm - 1, dd)
    if (!Number.isNaN(t)) return t
  }
  // 3) "DD de <mês> de YYYY"
  if (raw) {
    const m = raw.toLowerCase().match(/^(\d{1,2})\s+de\s+([a-zçáéíóúãõ]+)\s+de\s+(\d{4})$/i)
    if (m) {
      const dd = Number(m[1])
      const monthName = m[2]
      const yyyy = Number(m[3])
      const mm = PT_MONTHS.indexOf(monthName)
      if (mm >= 0) {
        const t = Date.UTC(yyyy, mm, dd)
        if (!Number.isNaN(t)) return t
      }
    }
  }
  // 4) fallback: mtime
  try {
    return fs.statSync(fullPath).mtimeMs
  } catch {
    return 0
  }
}

/* ---------- parse de um arquivo ---------- */
function parseMDXFile(fullPath: string): (BlogPost & { _ts: number }) {
  const source = fs.readFileSync(fullPath, "utf8")
  const { data, content } = matter(source)

  const fileSlug = path.basename(fullPath, ".mdx")
  const rawSlug = (data.slug as string | undefined) ?? fileSlug
  const slug = slugify(rawSlug)

  const title =
    (data.title as string | undefined) ??
    fileSlug.split("-").map(capitalize).join(" ")

  const dateStr = (data.date as string | undefined) // guardamos a string
  const ts = parseDateSmart(dateStr, fullPath)

  const description = (data.description as string | undefined) ?? ""
  const tags = (data.tags as string[] | undefined) ?? []

  return {
    slug,
    title,
    date: dateStr ?? "1970-01-01",
    description,
    tags,
    content,
    _ts: ts, // só para ordenar (será removido ao retornar)
  }
}

/* ---------- API ---------- */
export function getAllPosts(): BlogPost[] {
  const dir = getPostsDir()
  const files = fs.readdirSync(dir).filter((f) => f.toLowerCase().endsWith(".mdx"))

  const posts = files.map((file) => parseMDXFile(path.join(dir, file)))

  // mais novo primeiro
  posts.sort((a, b) => b._ts - a._ts)

  // remove o campo interno
  return posts.map(({ _ts, ...rest }) => rest)
}

export function getPostBySlug(slug: string): BlogPost | null {
  const dir = getPostsDir()
  const files = fs.readdirSync(dir).filter((f) => f.toLowerCase().endsWith(".mdx"))

  for (const file of files) {
    const fullPath = path.join(dir, file)
    const parsed = parseMDXFile(fullPath)
    if (parsed.slug === slug) {
      const { _ts, ...post } = parsed
      return post
    }
  }
  return null
}

export function getRecentPosts(limit = 2): BlogPost[] {
  return getAllPosts().slice(0, limit)
}