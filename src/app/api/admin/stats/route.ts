import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const range = searchParams.get("range") ?? "30d";

    const now = new Date();
    const rangeDays = range === "7d" ? 7 : range === "90d" ? 90 : range === "all" ? 3650 : 30;
    const startDate = new Date(now.getTime() - rangeDays * 24 * 60 * 60 * 1000);

    const [
      totalArticles,
      totalViews,
      totalSubscribers,
      sourcesCount,
      topCategories,
      topArticles,
      weeklyTrend,
      allApprovedArticles,
      tags,
      subscriberRows,
    ] = await Promise.all([
      db.article.count({ where: { status: "approved" } }),
      db.article.aggregate({ _sum: { viewCount: true }, where: { status: "approved" } }),
      db.newsletter.count({ where: { isActive: true } }),
      db.source.count(),
      db.article.groupBy({
        by: ["category"],
        _count: { id: true },
        _sum: { viewCount: true },
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
        where: { status: "approved", createdAt: { gte: startDate } },
        select: { createdAt: true },
      }),
      db.article.findMany({
        where: { status: "approved", createdAt: { gte: startDate } },
        select: { tags: true, viewCount: true },
      }),
      db.tag.findMany({ orderBy: { articleCount: "desc" }, take: 15 }),
      db.newsletter.findMany({
        where: { isActive: true },
        select: { subscribedAt: true },
        orderBy: { subscribedAt: "asc" },
      }),
    ]);

    // Views per day
    const dailyCounts: Record<string, number> = {};
    const dailyViews: Record<string, number> = {};
    for (let i = rangeDays - 1; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const key = d.toISOString().split("T")[0];
      dailyCounts[key] = 0;
      dailyViews[key] = 0;
    }
    weeklyTrend.forEach((a) => {
      const key = a.createdAt.toISOString().split("T")[0];
      if (key in dailyCounts) dailyCounts[key]++;
    });

    // Views per article for top articles by viewCount in range
    const topByViews = await db.article.findMany({
      where: { status: "approved" },
      orderBy: { viewCount: "desc" },
      take: 10,
      select: { id: true, title: true, viewCount: true, category: true },
    });

    // Tag frequency from JSON tags field
    const tagFreq: Record<string, number> = {};
    allApprovedArticles.forEach((a) => {
      try {
        const arr: string[] = JSON.parse(a.tags);
        if (Array.isArray(arr)) {
          arr.forEach((t) => {
            tagFreq[t] = (tagFreq[t] ?? 0) + 1;
          });
        }
      } catch {}
    });
    const tagFrequency = Object.entries(tagFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
      .map(([tag, count]) => ({ tag, count }));

    // Category view distribution
    const categoryViewDist = topCategories.map((c) => ({
      category: c.category,
      count: c._count.id,
      totalViews: c._sum.viewCount ?? 0,
    }));

    // Subscriber growth (cumulative)
    const subGrowth: Record<string, number> = {};
    let cumSubs = 0;
    const subCounts: Record<string, number> = {};
    subscriberRows.forEach((s) => {
      const key = s.subscribedAt.toISOString().split("T")[0];
      subCounts[key] = (subCounts[key] ?? 0) + 1;
    });
    Object.keys(dailyCounts)
      .sort()
      .forEach((d) => {
        cumSubs += subCounts[d] ?? 0;
        subGrowth[d] = cumSubs;
      });

    return NextResponse.json({
      totalArticles,
      totalViews: totalViews._sum.viewCount ?? 0,
      totalSubscribers,
      sourcesCount,
      topCategories: categoryViewDist.map((c) => ({ category: c.category, count: c.count, totalViews: c.totalViews })),
      topArticles: topArticles.map((a) => ({
        id: a.id,
        title: a.title,
        category: a.category,
        viewCount: a.viewCount,
        createdAt: a.createdAt.toISOString().split("T")[0],
      })),
      weeklyTrend: Object.entries(dailyCounts).map(([date, count]) => ({ date, count })),
      topByViews: topByViews.map((a) => ({
        id: a.id,
        title: a.title.length > 30 ? a.title.slice(0, 30) + "…" : a.title,
        fullTitle: a.title,
        viewCount: a.viewCount,
        category: a.category,
      })),
      tagFrequency,
      subscriberGrowth: Object.entries(subGrowth).map(([date, count]) => ({ date, count })),
      totalTaggedArticles: allApprovedArticles.length,
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
