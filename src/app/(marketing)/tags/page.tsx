import { db } from "@/lib/db";
import type { Metadata } from "next";
import TagsClient from "./TagsClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "태그 | DevPulse",
  description: "DevPulse의 모든 태그를 한눈에 확인하세요. 관심 분야별 아티클을 빠르게 찾아보세요.",
  openGraph: {
    title: "태그 | DevPulse",
    description: "관심 분야별 아티클 태그 모아보기",
    type: "website",
  },
};

export default async function TagsPage() {
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

  const tags = Object.entries(tagCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "태그",
    description: "DevPulse의 모든 태그 목록",
    url: "/tags",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-text-primary">태그</h1>
          <p className="mt-2 text-sm text-text-muted">
            관심 분야를 태그로 찾아보세요
          </p>
        </div>
        <TagsClient tags={tags} />
      </div>
    </>
  );
}
