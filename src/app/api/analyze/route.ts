import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { analyzeArticle } from "@/lib/llm";

export async function POST() {
  const pendingArticles = await db.article.findMany({
    where: { status: "pending_approval", aiSummary: "" },
    take: 10,
  });

  let analyzed = 0;
  for (const article of pendingArticles) {
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
      analyzed++;
    }
  }

  return NextResponse.json({ analyzed, message: `${analyzed}개 글 분석 완료` });
}
