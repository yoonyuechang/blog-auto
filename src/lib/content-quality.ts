import { db } from "@/lib/db";

interface QualityFactor {
  name: string;
  score: number;
  maxScore: number;
}

interface QualityResult {
  score: number;
  grade: "S" | "A" | "B" | "C" | "D";
  factors: QualityFactor[];
}

function scoreLength(content: string): QualityFactor {
  const len = content.length;
  const score = Math.min(25, Math.floor((len / 4000) * 25));
  return { name: "content_length", score, maxScore: 25 };
}

function scoreSummary(summary: string): QualityFactor {
  if (!summary) return { name: "summary_quality", score: 0, maxScore: 25 };
  const len = summary.length;
  // ideal: 100-300 chars
  let score = 0;
  if (len >= 50) score += 8;
  if (len >= 100) score += 7;
  if (len >= 200) score += 5;
  if (len >= 100 && len <= 400) score += 5;
  return { name: "summary_quality", score: Math.min(25, score), maxScore: 25 };
}

function scoreTagCoverage(tags: string): QualityFactor {
  let parsed: string[] = [];
  try {
    parsed = JSON.parse(tags || "[]");
  } catch {
    parsed = [];
  }
  const count = parsed.length;
  let score = 0;
  if (count >= 1) score += 8;
  if (count >= 2) score += 7;
  if (count >= 3) score += 5;
  if (count >= 4) score += 5;
  return { name: "tag_coverage", score: Math.min(25, score), maxScore: 25 };
}

function scoreSourceReliability(source: string): QualityFactor {
  // Known reliable sources
  const reliable = ["techcrunch", "github", "arxiv", "huggingface", "openai", "anthropic", "google", "vercel", "nextjs"];
  const src = source.toLowerCase();
  let score = 10; // baseline
  if (reliable.some((r) => src.includes(r))) score = 25;
  else if (src.includes("blog")) score = 18;
  else if (src.includes("news")) score = 20;
  else if (src.includes("docs")) score = 22;
  return { name: "source_reliability", score: Math.min(25, score), maxScore: 25 };
}

export function calculateQualityScore(article: {
  content: string;
  aiSummary: string;
  tags: string;
  source: string;
}): QualityResult {
  const factors = [
    scoreLength(article.content),
    scoreSummary(article.aiSummary),
    scoreTagCoverage(article.tags),
    scoreSourceReliability(article.source),
  ];

  const score = factors.reduce((sum, f) => sum + f.score, 0);

  let grade: QualityResult["grade"] = "D";
  if (score >= 90) grade = "S";
  else if (score >= 75) grade = "A";
  else if (score >= 55) grade = "B";
  else if (score >= 35) grade = "C";

  return { score, grade, factors };
}

export async function getQualityDistribution() {
  const articles = await db.article.findMany({
    where: { status: "approved" },
    select: { content: true, aiSummary: true, tags: true, source: true },
  });

  const dist = { S: 0, A: 0, B: 0, C: 0, D: 0 };
  for (const a of articles) {
    const { grade } = calculateQualityScore(a);
    dist[grade]++;
  }
  return { total: articles.length, distribution: dist };
}
