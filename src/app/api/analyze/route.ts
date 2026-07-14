import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { analyzeArticle } from "@/lib/llm";

async function analyzeOne(articleId: number) {
  const article = await db.article.findUnique({ where: { id: articleId } });
  if (!article) return null;
  const result = await analyzeArticle(article.title, article.content);
  if (result) {
    await db.article.update({
      where: { id: article.id },
      data: {
        aiSummary: result.aiSummary,
        keyPoints: JSON.stringify(result.keyPoints),
        difficultyLevel: result.difficultyLevel,
      },
    });
    return article.id;
  }
  return null;
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));

  // Single article analysis
  if (body.articleId) {
    const id = await analyzeOne(body.articleId);
    if (!id) return NextResponse.json({ error: "Article not found or analysis failed" }, { status: 404 });
    return NextResponse.json({ analyzed: 1, ids: [id] });
  }

  // Bulk: analyze all pending with empty summary
  const pendingArticles = await db.article.findMany({
    where: { status: "pending_approval", aiSummary: "" },
    take: 50,
  });

  const analyzed: number[] = [];
  for (const article of pendingArticles) {
    const id = await analyzeOne(article.id);
    if (id) analyzed.push(id);
  }

  return NextResponse.json({ analyzed: analyzed.length, ids: analyzed });
}
