import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const [totalArticles, viewAgg, totalSubscribers, topCategories, recentArticles] =
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
      ]);

    return NextResponse.json({
      totalArticles,
      totalViews: viewAgg._sum.viewCount ?? 0,
      totalSubscribers,
      topCategories: topCategories.map((c) => ({
        category: c.category,
        count: c._count.id,
      })),
      recentArticles,
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
