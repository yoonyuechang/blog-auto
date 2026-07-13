import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { fetchHackerNews, fetchDevto, fetchGitHubTrending, fetchArxiv } from "@/lib/fetchers";

export async function POST() {
  const sources = await db.source.findMany({ where: { isActive: true } });
  let fetched = 0;

  for (const source of sources) {
    let items: any[] = [];

    if (source.name.includes("HackerNews")) items = await fetchHackerNews();
    else if (source.name.includes("Dev.to")) items = await fetchDevto();
    else if (source.name.includes("GitHub")) items = await fetchGitHubTrending();
    else if (source.name.includes("arXiv")) items = await fetchArxiv();

    for (const item of items) {
      const existing = await db.article.findFirst({ where: { sourceUrl: item.url } });
      if (!existing && item.title) {
        await db.article.create({
          data: {
            title: item.title,
            summary: item.summary,
            content: item.summary,
            source: item.source,
            sourceUrl: item.url,
            category: source.category,
            tags: "[]",
            difficultyLevel: "입문/초급",
            publishedAt: item.publishedAt,
            status: "pending_approval",
          },
        });
        fetched++;
      }
    }

    await db.source.update({ where: { id: source.id }, data: { lastFetched: new Date() } });
  }

  return NextResponse.json({ fetched, message: `${fetched}개 글 수집 완료` });
}
