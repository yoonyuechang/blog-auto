import { db } from "@/lib/db";
import AdminClient from "./AdminClient";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [totalArticles, pendingArticles, totalSubscribers, sources, subscribers, viewsResult] = await Promise.all([
    db.article.count(),
    db.article.count({ where: { status: "pending_approval" } }),
    db.newsletter.count({ where: { isActive: true } }),
    db.source.findMany(),
    db.newsletter.findMany(),
    db.article.aggregate({ _sum: { viewCount: true } }),
  ]);

  return (
    <AdminClient
      data={{
        kpi: { totalArticles, pendingArticles, totalSubscribers, totalViews: viewsResult._sum.viewCount || 0 },
        pendingArticles: [],
        sources: sources.map((s) => ({ ...s, isActive: s.isActive })),
        subscribers: subscribers.map((s) => ({ ...s, subscribedAt: s.subscribedAt.toISOString().split("T")[0] })),
      }}
    />
  );
}
