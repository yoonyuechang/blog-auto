import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { analyzeArticle } from "@/lib/llm";
import { calculateQualityScore } from "@/lib/content-quality";

async function analyzeOne(articleId: number) {
  const article = await db.article.findUnique({ where: { id: articleId } });
  if (!article) return null;
  const result = await analyzeArticle(article.title, article.content);
  if (result) {
    const quality = calculateQualityScore({
      content: article.content,
      aiSummary: result.aiSummary,
      tags: article.tags,
      source: article.source,
    });
    await db.article.update({
      where: { id: article.id },
      data: {
        aiSummary: result.aiSummary,
        keyPoints: JSON.stringify(result.keyPoints),
        difficultyLevel: result.difficultyLevel,
      },
    });
    return { id: article.id, qualityScore: quality.score, grade: quality.grade };
  }
  return null;
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));

  // Single article analysis
  if (body.articleId) {
    const result = await analyzeOne(body.articleId);
    if (!result) return NextResponse.json({ error: "Article not found or analysis failed" }, { status: 404 });
    return NextResponse.json({ analyzed: 1, ids: [result.id], quality: { score: result.qualityScore, grade: result.grade } });
  }

  // Bulk: analyze all pending with empty summary
  const pendingArticles = await db.article.findMany({
    where: { status: "pending_approval", aiSummary: "" },
    take: 50,
  });

  const analyzed: number[] = [];
  const qualities: { id: number; score: number; grade: string }[] = [];
  for (const article of pendingArticles) {
    const result = await analyzeOne(article.id);
    if (result) {
      analyzed.push(result.id);
      qualities.push({ id: result.id, score: result.qualityScore, grade: result.grade });
    }
  }

  return NextResponse.json({ analyzed: analyzed.length, ids: analyzed, qualities });
}
