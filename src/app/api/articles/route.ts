import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { cache } from "@/lib/cache";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";

const CACHE_TTL = 60_000;

export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
  const rl = checkRateLimit(`articles:${ip}`, RATE_LIMITS.articles.limit, RATE_LIMITS.articles.windowMs);
  if (!rl.allowed) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "12")));
    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const difficulty = searchParams.get("difficulty");
    const q = searchParams.get("q");
    const exclude = searchParams.get("exclude");
    const tags = searchParams.get("tags");

    const cacheKey = `articles:${JSON.stringify({ page, limit, category, status, difficulty, q, exclude, tags })}`;
    const cached = cache.get<{ articles: any[]; total: number; page: number; limit: number }>(cacheKey);
    if (cached) return NextResponse.json(cached);

    const where: Prisma.ArticleWhereInput = {};
    if (status) where.status = status;
    if (category) where.category = category;
    if (difficulty) where.difficultyLevel = difficulty;
    if (exclude) where.id = { not: parseInt(exclude) };
    if (tags) {
      const tagList = tags.split(",").filter(Boolean);
      if (tagList.length) {
        where.OR = tagList.map((t) => ({ tags: { contains: t.trim() } }));
      }
    } else if (q) {
      where.OR = [
        { title: { contains: q } },
        { aiSummary: { contains: q } },
        { tags: { contains: q } },
      ];
    }

    const [articles, total] = await Promise.all([
      db.article.findMany({
        where,
        orderBy: { publishedAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.article.count({ where }),
    ]);

    const result = { articles, total, page, limit };
    cache.set(cacheKey, result, CACHE_TTL);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 });
  }
}

const ARTICLE_FIELDS = [
  "title", "summary", "content", "source", "sourceUrl",
  "category", "tags", "difficultyLevel", "publishedAt", "status",
] as const;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data: Record<string, unknown> = {};
    for (const key of ARTICLE_FIELDS) {
      if (key in body) data[key] = body[key];
    }
    if (!data.title || !data.source || !data.sourceUrl) {
      return NextResponse.json({ error: "title, source, sourceUrl required" }, { status: 400 });
    }
    const article = await db.article.create({ data: data as any });
    cache.sweep(); // invalidate stale article caches on mutation
    return NextResponse.json(article, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create article" }, { status: 500 });
  }
}
