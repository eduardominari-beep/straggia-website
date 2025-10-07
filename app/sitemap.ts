// app/sitemap.ts
import type { MetadataRoute } from "next"
import { getAllPosts } from "@/lib/blog"

export const dynamic = "force-static"

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.straggia.com"
  const now = new Date()

// app/sitemap.ts (trecho)
const staticRoutes = [
  { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
  { url: `${base}/quem-somos`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
  { url: `${base}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
  { url: `${base}/agenda`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
] as const

  const postRoutes = getAllPosts().map(p => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: "monthly",
    priority: 0.7,
  })) satisfies MetadataRoute.Sitemap

  return [...staticRoutes, ...postRoutes]
}