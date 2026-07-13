import { MetadataRoute } from "next";
import { db } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await db.article.findMany({
    where: { status: "approved" },
    select: { id: true, updatedAt: true },
  });

  const articleUrls = articles.map((a) => ({
    url: `https://devpulse.vercel.app/article/${a.id}`,
    lastModified: a.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    { url: "https://devpulse.vercel.app", lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: "https://devpulse.vercel.app/subscribe", lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    ...articleUrls,
  ];
}
