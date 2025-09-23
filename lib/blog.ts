// /lib/blog.ts
import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface BlogPost {
  slug: string;
  title: string;
  date: string; // ISO YYYY-MM-DD
  description: string;
  tags: string[];
  content: string;
}

function exists(p: string) {
  try {
    fs.accessSync(p);
    return true;
  } catch {
    return false;
  }
}

// Usa "content/posts" por padrão, mas funciona com "posts" se for seu caso
function getPostsDir(): string {
  const a = path.join(process.cwd(), "content", "posts");
  const b = path.join(process.cwd(), "posts");
  if (exists(a)) return a;
  if (exists(b)) return b;
  throw new Error(
    'Nenhuma pasta de posts encontrada. Crie "content/posts" (recomendado) ou "posts".'
  );
}

// Slug seguro: minúsculas, sem acentos, espaços/hífens normalizados
function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function parseMDXFile(fullPath: string): BlogPost {
  const source = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(source);

  const fileSlug = path.basename(fullPath, ".mdx");
  // prioridade: slug do front-matter > nome do arquivo
  const rawSlug = (data.slug as string | undefined) ?? fileSlug;
  const safeSlug = slugify(rawSlug);

  const title =
    (data.title as string | undefined) ??
    fileSlug
      .split("-")
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join(" ");

  const date = (data.date as string | undefined) ?? "1970-01-01";
  const description = (data.description as string | undefined) ?? "";
  const tags = (data.tags as string[] | undefined) ?? [];

  return {
    slug: safeSlug,
    title,
    date,
    description,
    tags,
    content,
  };
}

export function getAllPosts(): BlogPost[] {
  const POSTS_DIR = getPostsDir();
  const files = fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.toLowerCase().endsWith(".mdx"));

  const posts = files.map((file) =>
    parseMDXFile(path.join(POSTS_DIR, file))
  );

  // Mais novo -> mais antigo
  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getPostBySlug(slug: string): BlogPost | null {
  const POSTS_DIR = getPostsDir();

  // varremos os arquivos e paramos no primeiro que bater o slug "seguro"
  const files = fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.toLowerCase().endsWith(".mdx"));

  for (const file of files) {
    const fullPath = path.join(POSTS_DIR, file);
    const parsed = parseMDXFile(fullPath);
    if (parsed.slug === slug) return parsed;
  }

  return null;
}

// Opcional: pegar os N mais recentes
export function getRecentPosts(limit = 2): BlogPost[] {
  return getAllPosts().slice(0, limit);
}