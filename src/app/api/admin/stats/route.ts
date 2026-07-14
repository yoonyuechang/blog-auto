import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [totalArticles, totalViews, totalSubscribers, sourcesCount, topCategories, topArticles, weeklyTrend] =
      await Promise.all([
        db.article.count({ where: { status: "approved" } }),
        db.article.aggregate({ _sum: { viewCount: true }, where: { status: "approved" } }),
        db.newsletter.count({ where: { isActive: true } }),
        db.source.count(),
        db.article.groupBy({
          by: ["category"],
          _count: { id: true },
          where: { status: "approved" },
          orderBy: { _count: { id: "desc" } },
          take: 6,
        }),
        db.article.findMany({
          where: { status: "approved" },
          orderBy: { createdAt: "desc" },
          take: 10,
          select: {
            id: true,
            title: true,
            category: true,
            viewCount: true,
            createdAt: true,
          },
        }),
        db.article.findMany({
          where: { status: "approved", createdAt: { gte: weekAgo } },
          select: { createdAt: true },
        }),
      ]);

    const dailyCounts: Record<string, number> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      dailyCounts[d.toISOString().split("T")[0]] = 0;
    }
    weeklyTrend.forEach((a) => {
      const key = a.createdAt.toISOString().split("T")[0];
      if (key in dailyCounts) dailyCounts[key]++;
    });

    return NextResponse.json({
      totalArticles,
      totalViews: totalViews._sum.viewCount ?? 0,
      totalSubscribers,
      sourcesCount,
      topCategories: topCategories.map((c) => ({ category: c.category, count: c._count.id })),
      topArticles: topArticles.map((a) => ({
        id: a.id,
        title: a.title,
        category: a.category,
        viewCount: a.viewCount,
        createdAt: a.createdAt.toISOString().split("T")[0],
      })),
      weeklyTrend: Object.entries(dailyCounts).map(([date, count]) => ({ date, count })),
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
