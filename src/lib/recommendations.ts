import { db } from "@/lib/db";

export interface RecommendedArticle {
  id: number;
  title: string;
  category: string;
  tags: string;
  viewCount: number;
  difficultyLevel: string;
  publishedAt: Date;
}

export async function getRelatedArticles(articleId: number, limit = 5): Promise<RecommendedArticle[]> {
  const article = await db.article.findUnique({ where: { id: articleId }, select: { tags: true, category: true } });
  if (!article) return [];

  const parsedTags = JSON.parse(article.tags || "[]") as string[];
  if (!parsedTags.length) return getTrendingArticles(limit);

  const results = await db.article.findMany({
    where: {
      id: { not: articleId },
      status: "approved",
      OR: [
        ...parsedTags.map((t) => ({ tags: { contains: t } })),
        { category: article.category },
      ],
    },
    orderBy: { viewCount: "desc" },
    take: limit * 2,
    select: { id: true, title: true, category: true, tags: true, viewCount: true, difficultyLevel: true, publishedAt: true },
  });

  // Score by tag overlap
  const scored = results
    .map((a) => {
      const aTags = JSON.parse(a.tags || "[]") as string[];
      const overlap = aTags.filter((t) => parsedTags.includes(t)).length;
      return { ...a, score: overlap * 10 + (a.category === article.category ? 5 : 0) };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scored;
}

export async function getTrendingArticles(limit = 5): Promise<RecommendedArticle[]> {
  const sevenDaysAgo = new Date(Date.now() - 7 * 86400000);
  return db.article.findMany({
    where: { status: "approved", publishedAt: { gte: sevenDaysAgo } },
    orderBy: { viewCount: "desc" },
    take: limit,
    select: { id: true, title: true, category: true, tags: true, viewCount: true, difficultyLevel: true, publishedAt: true },
  });
}

export async function getPersonalizedFeed(
  history: { category: string }[],
  limit = 5
): Promise<RecommendedArticle[]> {
  if (!history.length) return getTrendingArticles(limit);

  const categoryCounts = new Map<string, number>();
  for (const h of history) {
    categoryCounts.set(h.category, (categoryCounts.get(h.category) || 0) + 1);
  }
  const topCategories = Array.from(categoryCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([c]) => c);

  return db.article.findMany({
    where: { status: "approved", category: { in: topCategories } },
    orderBy: { viewCount: "desc" },
    take: limit,
    select: { id: true, title: true, category: true, tags: true, viewCount: true, difficultyLevel: true, publishedAt: true },
  });
}
