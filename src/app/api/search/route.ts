import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import type { Prisma } from "@prisma/client";
import { cache } from "@/lib/cache";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";

const CACHE_TTL = 30_000;

const suggestions = [
  "TypeScript", "React", "Python", "머신러닝", "AWS",
  "Vue", "Node", "Flutter", "Kotlin", "Docker", "Kubernetes",
  "보안", "CSRF", "CSS Grid", "GraphQL", "REST API"
];

export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
  const rl = checkRateLimit(`search:${ip}`, RATE_LIMITS.search.limit, RATE_LIMITS.search.windowMs);
  if (!rl.allowed) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim();
    const category = searchParams.get("category");
    const sort = searchParams.get("sort") || "newest";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "12")));

    const cacheKey = `search:${JSON.stringify({ q, category, sort, page, limit })}`;
    const cached = cache.get(cacheKey);
    if (cached) return NextResponse.json(cached);

    const where: Prisma.ArticleWhereInput = { status: "approved" };

    if (category) {
      const cat = await db.category.findUnique({ where: { slug: category } });
      if (cat) where.category = cat.name;
    }

    let orderBy: Prisma.ArticleOrderByWithRelationInput = {};
    switch (sort) {
      case "popular":
      case "views":
        orderBy = { viewCount: "desc" };
        break;
      case "newest":
      default:
        orderBy = { publishedAt: "desc" };
        break;
    }

    if (q) {
      const containsQ = { contains: q };
      where.OR = [
        { title: containsQ },
        { aiSummary: containsQ },
        { content: containsQ },
      ];
    }

    const [articles, total] = await Promise.all([
      db.article.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.article.count({ where }),
    ]);

    const hitSuggestions = suggestions
      .filter(s => s.toLowerCase().includes((q || "").toLowerCase()))
      .slice(0, 5);

    const result = {
      articles,
      total,
      page,
      limit,
      suggestions: q ? hitSuggestions : suggestions.slice(0, 8),
    };

    cache.set(cacheKey, result, CACHE_TTL);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Failed to search" }, { status: 500 });
  }
}
