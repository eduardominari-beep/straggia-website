// lib/blog.ts
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { execSync } from "node:child_process";

export interface BlogPost {
  slug: string;
  title: string;
  date: string;        // continua igual (vem do front-matter se existir)
  description: string;
  tags: string[];
  content: string;
}

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

function readMdx(slug: string) {
  const file = path.join(POSTS_DIR, `${slug}.mdx`);
  if (!fs.existsSync(file)) return null;
  const raw = fs.readFileSync(file, "utf8");
  const { data, content } = matter(raw);
  return { data, content, fullPath: file };
}

// pega o timestamp do último commit do arquivo (em ms). fallback: mtime
function getFileTimeMs(fullPath: string): number {
  try {
    const out = execSync(`git log -1 --pretty=%ct -- "${fullPath}"`, {
      stdio: ["ignore", "pipe", "ignore"],
    })
      .toString()
      .trim();
    const sec = Number(out);
    if (Number.isFinite(sec)) return sec * 1000;
  } catch {
    // ignora: pode não estar em repositório git no ambiente
  }
  // fallback: mtime do arquivo
  try {
    return fs.statSync(fullPath).mtimeMs;
  } catch {
    return 0;
  }
}

export function getAllPosts(): BlogPost[] {
  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".mdx"));

  type PostWithSort = BlogPost & { _sortTime: number };

  const posts: PostWithSort[] = files.map((file) => {
    const slug = file.replace(/\.mdx$/, "");
    const parsed = readMdx(slug)!;
    const data = parsed.data as Record<string, any>;

    const base: BlogPost = {
      slug,
      title: data.title ?? slug,
      date: data.date ?? "",            // exibição continua como antes
      description: data.description ?? "",
      tags: Array.isArray(data.tags) ? data.tags : [],
      content: parsed.content,
    };

    return { ...base, _sortTime: getFileTimeMs(parsed.fullPath) };
  });

  // ordena do mais novo pro mais antigo pela última modificação/commit
  posts.sort((a, b) => b._sortTime - a._sortTime);

  // remove o campo interno de ordenação
  return posts.map(({ _sortTime, ...p }) => p);
}

export function getPostBySlug(slug: string): BlogPost | null {
  const parsed = readMdx(slug);
  if (!parsed) return null;
  const data = parsed.data as Record<string, any>;

  return {
    slug,
    title: data.title ?? slug,
    date: data.date ?? "",
    description: data.description ?? "",
    tags: Array.isArray(data.tags) ? data.tags : [],
    content: parsed.content,
  };
}

export function getRecentPosts(limit = 2): BlogPost[] {
  return getAllPosts().slice(0, limit);
}