import { db } from "@/lib/db";
import HeroSection from "@/components/home/HeroSection";
import HomeClient from "./HomeClient";

export const dynamic = "force-dynamic";

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

  const categories = await db.category.findMany();

  return (
    <>
      <HeroSection totalArticles={totalArticles} todayArticles={todayArticles} />
      <HomeClient
        initialTrending={trending.map((a) => ({
          ...a,
          tags: a.tags,
          publishedAt: a.publishedAt.toISOString().split("T")[0],
        }))}
        categories={categories.map((c) => c.name)}
      />
    </>
  );
}
