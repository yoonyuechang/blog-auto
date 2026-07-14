import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const articles = await db.article.findMany({
      where: { status: "approved" },
      orderBy: { publishedAt: "desc" },
      take: 20,
    });

    const siteUrl = "https://blog-auto-woad.vercel.app";

    const items = articles
      .map(
        (a) => `    <item>
      <title><![CDATA[${a.title}]]></title>
      <description><![CDATA[${a.aiSummary || a.summary}]]></description>
      <link>${siteUrl}/article/${a.id}</link>
      <guid isPermaLink="false">${siteUrl}/article/${a.id}</guid>
      <pubDate>${new Date(a.publishedAt).toUTCString()}</pubDate>
      <category>${a.category}</category>
    </item>`
      )
      .join("\n");

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>DevPulse</title>
    <description>AI가 요약한 최신 기술 트렌드를 매일 받아보세요</description>
    <link>${siteUrl}</link>
    <atom:link href="${siteUrl}/api/feed" rel="self" type="application/rss+xml" />
    <language>ko</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;

    return new NextResponse(rss, {
      headers: {
        "Content-Type": "application/rss+xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    return new NextResponse("Failed to generate feed", { status: 500 });
  }
}
