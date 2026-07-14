import { MetadataRoute } from "next";
import { db } from "@/lib/db";

const BASE = "https://blog-auto-woad.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, categories] = await Promise.all([
    db.article.findMany({
      where: { status: "approved" },
      select: { id: true, updatedAt: true, category: true },
    }),
    db.category.findMany({
      select: { slug: true },
    }),
  ]);

  const categoryUrls = categories.map((c) => ({
    url: `${BASE}/category/${encodeURIComponent(c.slug)}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const articleUrls = articles.map((a) => ({
    url: `${BASE}/article/${a.id}`,
    lastModified: a.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    { url: BASE, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${BASE}/tags`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/subscribe`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    ...categoryUrls,
    ...articleUrls,
  ];
}
