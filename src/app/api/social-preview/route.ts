import { NextRequest, NextResponse } from "next/server";

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 30;
const RATE_WINDOW = 60_000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

export async function GET(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const url = request.nextUrl.searchParams.get("url");
  if (!url) {
    return NextResponse.json({ error: "Missing url param" }, { status: 400 });
  }

  try {
    const parsed = new URL(url);
    const domain = parsed.hostname;

    const SITE_URL = "https://blog-auto-woad.vercel.app";
    if (parsed.origin !== SITE_URL) {
      return NextResponse.json({ error: "Unsupported domain" }, { status: 400 });
    }

    const pathParts = parsed.pathname.split("/").filter(Boolean);
    if (pathParts[0] !== "article" || !pathParts[1]) {
      return NextResponse.json({ error: "Invalid path" }, { status: 400 });
    }

    const { db } = await import("@/lib/db");
    const id = parseInt(pathParts[1]);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const article = await db.article.findUnique({
      where: { id },
      select: { title: true, aiSummary: true, category: true, tags: true },
    });

    if (!article) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({
      title: article.title,
      description: article.aiSummary?.substring(0, 200) || article.category,
      image: `${SITE_URL}/api/og?title=${encodeURIComponent(article.title)}&category=${encodeURIComponent(article.category)}`,
      domain,
    });
  } catch {
    return NextResponse.json({ error: "Invalid url" }, { status: 400 });
  }
}
