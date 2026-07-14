import { db } from "@/lib/db";
import AdminClient from "./AdminClient";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [
    approvedArticles,
    pendingArticles,
    totalSubscribers,
    sources,
    subscribers,
    viewsResult,
    articlesThisWeek,
    recentArticles,
  ] = await Promise.all([
    db.article.count({ where: { status: "approved" } }),
    db.article.findMany({ where: { status: "pending_approval" }, orderBy: { createdAt: "desc" } }),
    db.newsletter.count({ where: { isActive: true } }),
    db.source.findMany({ orderBy: { createdAt: "desc" } }),
    db.newsletter.findMany({ orderBy: { subscribedAt: "desc" } }),
    db.article.aggregate({ _sum: { viewCount: true } }),
    db.article.count({ where: { status: "approved", createdAt: { gte: weekAgo } } }),
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
  ]);

  return (
    <AdminClient
      data={{
        kpi: {
          totalArticles: approvedArticles,
          pendingArticles: pendingArticles.length,
          totalSubscribers,
          totalViews: viewsResult._sum.viewCount || 0,
          sourcesCount: sources.length,
          articlesThisWeek,
        },
        pendingArticles: pendingArticles.map((a) => ({
          id: a.id,
          title: a.title,
          source: a.source,
          difficultyLevel: a.difficultyLevel,
          aiSummary: a.aiSummary,
          createdAt: a.createdAt.toISOString().split("T")[0],
        })),
        sources: sources.map((s) => ({
          id: s.id,
          name: s.name,
          type: s.type,
          url: s.url,
          fetchInterval: s.fetchInterval,
          isActive: s.isActive,
          category: s.category,
          lastFetched: s.lastFetched?.toISOString().split("T")[0] || undefined,
        })),
        subscribers: subscribers.map((s) => ({
          id: s.id,
          email: s.email,
          subscribedAt: s.subscribedAt.toISOString().split("T")[0],
          isActive: s.isActive,
        })),
        recentArticles: recentArticles.map((a) => ({
          id: a.id,
          title: a.title,
          category: a.category,
          viewCount: a.viewCount,
          createdAt: a.createdAt.toISOString().split("T")[0],
        })),
      }}
    />
  );
}
