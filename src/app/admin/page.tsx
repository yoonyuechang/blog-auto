import { db } from "@/lib/db";
import AdminClient from "./AdminClient";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [approvedArticles, pendingArticles, totalSubscribers, sources, subscribers, viewsResult] =
    await Promise.all([
      db.article.count({ where: { status: "approved" } }),
      db.article.findMany({ where: { status: "pending_approval" }, orderBy: { createdAt: "desc" } }),
      db.newsletter.count({ where: { isActive: true } }),
      db.source.findMany(),
      db.newsletter.findMany({ orderBy: { subscribedAt: "desc" } }),
      db.article.aggregate({ _sum: { viewCount: true } }),
    ]);

  return (
    <AdminClient
      data={{
        kpi: {
          totalArticles: approvedArticles,
          pendingArticles: pendingArticles.length,
          totalSubscribers,
          totalViews: viewsResult._sum.viewCount || 0,
        },
        pendingArticles: pendingArticles.map((a) => ({
          id: a.id,
          title: a.title,
          source: a.source,
          difficultyLevel: a.difficultyLevel,
          aiSummary: a.aiSummary,
          createdAt: a.createdAt.toISOString().split("T")[0],
        })),
        sources: sources.map((s) => ({ ...s, isActive: s.isActive })),
        subscribers: subscribers.map((s) => ({
          id: s.id,
          email: s.email,
          subscribedAt: s.subscribedAt.toISOString().split("T")[0],
          isActive: s.isActive,
        })),
      }}
    />
  );
}
