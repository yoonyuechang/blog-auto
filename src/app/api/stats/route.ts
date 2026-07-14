import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cache } from "@/lib/cache";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";

const CACHE_TTL = 5 * 60_000;

export async function GET() {
  const rl = checkRateLimit("stats:global", RATE_LIMITS.stats.limit, RATE_LIMITS.stats.windowMs);
  if (!rl.allowed) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const cached = cache.get("stats:dashboard");
  if (cached) return NextResponse.json(cached);

  try {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [totalArticles, viewAgg, totalSubscribers, topCategories, recentArticles, articlesThisWeek, avgViews] =
      await Promise.all([
        db.article.count({ where: { status: "approved" } }),
        db.article.aggregate({ _sum: { viewCount: true }, where: { status: "approved" } }),
        db.newsletter.count({ where: { isActive: true } }),
        db.article.groupBy({
          by: ["category"],
          _count: { id: true },
          where: { status: "approved" },
          orderBy: { _count: { id: "desc" } },
          take: 10,
        }),
        db.article.findMany({
          where: { status: "approved" },
          orderBy: { publishedAt: "desc" },
          take: 5,
          select: {
            id: true,
            title: true,
            viewCount: true,
            category: true,
            publishedAt: true,
            createdAt: true,
          },
        }),
        db.article.count({
          where: { status: "approved", createdAt: { gte: weekAgo } },
        }),
        db.article.aggregate({
          _avg: { viewCount: true },
          where: { status: "approved" },
        }),
      ]);

    const topCategory = topCategories.length > 0 ? topCategories[0].category : null;

    const result = {
      totalArticles,
      totalViews: viewAgg._sum.viewCount ?? 0,
      totalSubscribers,
      topCategories: topCategories.map((c) => ({
        category: c.category,
        count: c._count.id,
      })),
      recentArticles,
      articlesThisWeek,
      topCategory,
      avgViewsPerArticle: Math.round(avgViews._avg.viewCount ?? 0),
    };

    cache.set("stats:dashboard", result, CACHE_TTL);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
