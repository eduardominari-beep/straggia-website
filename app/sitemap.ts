// app/sitemap.ts
import type { MetadataRoute } from "next"
import { getAllPosts } from "@/lib/blog"

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://www.straggia.com"

  const posts = getAllPosts().map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: new Date(p.date),
  }))
   
   return [
    { url: `${base}/`, lastModified: new Date() },
    { url: `${base}/quem-somos`, lastModified: new Date() },
    { url: `${base}/blog`, lastModified: new Date() },
    ...getAllPosts().map(p => ({
      url: `${base}/blog/${p.slug}`,
      lastModified: new Date(p.date),
    })),
  ]
}