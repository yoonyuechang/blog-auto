import { db } from "@/lib/db";
import HeroSection from "@/components/home/HeroSection";
import HomeClient from "./HomeClient";
import NewsletterInline from "@/components/shared/NewsletterInline";
import PullToRefresh from "@/components/shared/PullToRefresh";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = {
  keywords: "기술블로그, IT트렌드, 개발자, AI, 프로그래밍, 주니어개발자",
};

export default async function HomePage() {
  const totalArticles = await db.article.count({ where: { status: "approved" } });

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayArticles = await db.article.count({
    where: { status: "approved", createdAt: { gte: today } },
  });

  const trending = await db.article.findMany({
    where: {
      status: "approved",
      publishedAt: { gte: new Date(Date.now() - 7 * 86400000) },
    },
    orderBy: { viewCount: "desc" },
    take: 3,
  });

  const featured = await db.article.findFirst({
    where: { status: "approved" },
    orderBy: { viewCount: "desc" },
  });

  const weeklyTop = await db.article.findMany({
    where: { status: "approved" },
    orderBy: { viewCount: "desc" },
    take: 5,
    select: {
      id: true,
      title: true,
      category: true,
      difficultyLevel: true,
      viewCount: true,
    },
  });

  const categories = await db.category.findMany();

  const categoryCountsRows = await db.article.groupBy({
    by: ["category"],
    where: { status: "approved" },
    _count: true,
  });
  const categoryCounts: Record<string, number> = {};
  for (const row of categoryCountsRows) {
    categoryCounts[row.category] = row._count;
  }

  const allArticles = await db.article.findMany({
    where: { status: "approved" },
    select: { tags: true },
  });
  const tagCounts: Record<string, number> = {};
  for (const a of allArticles) {
    if (a.tags) {
      try {
        const parsed = JSON.parse(a.tags);
        if (Array.isArray(parsed)) {
          for (const t of parsed) tagCounts[t] = (tagCounts[t] || 0) + 1;
        }
      } catch {}
    }
  }

  return (
    <PullToRefresh>
      <HeroSection totalArticles={totalArticles} todayArticles={todayArticles} />
      <HomeClient
        initialTrending={trending.map((a) => ({
          ...a,
          tags: a.tags,
          publishedAt: a.publishedAt.toISOString().split("T")[0],
        }))}
        featuredArticle={featured ? {
          ...featured,
          tags: featured.tags,
          publishedAt: featured.publishedAt.toISOString().split("T")[0],
        } : null}
        weeklyTop={weeklyTop}
        categories={categories.map((c) => c.name)}
        categoryCounts={categoryCounts}
        tagCounts={tagCounts}
      />
      <NewsletterInline />
      <div className="mx-auto max-w-6xl px-4 pb-12">
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/tags"
            className="rounded-lg border border-border bg-card px-5 py-2.5 text-sm text-text-secondary transition-colors hover:text-text-primary"
          >
            전체 태그 보기 →
          </Link>
          <Link
            href="/about"
            className="rounded-lg border border-border bg-card px-5 py-2.5 text-sm text-text-secondary transition-colors hover:text-text-primary"
          >
            DevPulse 소개 →
          </Link>
        </div>
      </div>
    </PullToRefresh>
  );
}
