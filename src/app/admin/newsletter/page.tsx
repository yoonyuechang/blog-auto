import { db } from "@/lib/db";
import NewsletterClient from "./NewsletterClient";

export const dynamic = "force-dynamic";

export default async function NewsletterPage() {
  const [subscribers, total, weeklySubscribers, articles] = await Promise.all([
    db.newsletter.findMany({
      orderBy: { subscribedAt: "desc" },
      take: 20,
    }),
    db.newsletter.count({ where: { isActive: true } }),
    db.newsletter.findMany({
      where: {
        subscribedAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      },
      orderBy: { subscribedAt: "desc" },
      select: { subscribedAt: true },
    }),
    db.article.findMany({
      where: { status: "approved" },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        title: true,
        summary: true,
        category: true,
        source: true,
        sourceUrl: true,
      },
    }),
  ]);

  const now = new Date();
  const dailyGrowth: Record<string, number> = {};
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    dailyGrowth[d.toISOString().split("T")[0]] = 0;
  }
  weeklySubscribers.forEach((s) => {
    const key = s.subscribedAt.toISOString().split("T")[0];
    if (key in dailyGrowth) dailyGrowth[key]++;
  });

  return (
    <NewsletterClient
      data={{
        subscribers: subscribers.map((s) => ({
          id: s.id,
          email: s.email,
          subscribedAt: s.subscribedAt.toISOString(),
          isActive: s.isActive,
        })),
        totalActive: total,
        growthData: Object.entries(dailyGrowth).map(([date, count]) => ({ date, count })),
        articles: articles.map((a) => ({
          id: a.id,
          title: a.title,
          summary: a.summary,
          category: a.category,
          source: a.source,
          sourceUrl: a.sourceUrl,
        })),
      }}
    />
  );
}
