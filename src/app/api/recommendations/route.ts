import { NextRequest, NextResponse } from "next/server";
import { getRelatedArticles, getTrendingArticles, getPersonalizedFeed } from "@/lib/recommendations";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const articleId = parseInt(searchParams.get("articleId") || "0");
    const limit = Math.min(20, Math.max(1, parseInt(searchParams.get("limit") || "5")));
    const strategy = (searchParams.get("strategy") || "related") as "related" | "trending" | "personalized";

    let articles;
    if (strategy === "trending" || (!articleId && strategy === "related")) {
      articles = await getTrendingArticles(limit);
    } else if (strategy === "personalized") {
      const historyParam = searchParams.get("history");
      const history = historyParam ? JSON.parse(historyParam) : [];
      articles = await getPersonalizedFeed(history, limit);
    } else {
      articles = await getRelatedArticles(articleId, limit);
    }

    return NextResponse.json({ articles }, {
      headers: { "Cache-Control": "public, max-age=300, s-maxage=300" },
    });
  } catch {
    return NextResponse.json({ articles: [] }, { status: 500 });
  }
}
