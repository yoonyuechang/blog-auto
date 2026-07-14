import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

const viewLog = new Map<string, number>();
const RATE_LIMIT_MS = 60_000;

setInterval(() => {
  const now = Date.now();
  viewLog.forEach((ts, key) => {
    if (now - ts > RATE_LIMIT_MS * 2) viewLog.delete(key);
  });
}, RATE_LIMIT_MS * 2);

export async function POST(req: NextRequest) {
  const { articleId } = await req.json();
  if (typeof articleId !== "number") {
    return NextResponse.json({ error: "Invalid articleId" }, { status: 400 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "anon";
  const key = `${ip}:${articleId}`;
  const now = Date.now();

  if (viewLog.has(key) && now - viewLog.get(key)! < RATE_LIMIT_MS) {
    const article = await db.article.findUnique({ where: { id: articleId }, select: { viewCount: true } });
    return NextResponse.json({ viewCount: article?.viewCount ?? 0, rateLimited: true });
  }

  viewLog.set(key, now);
  const updated = await db.article.update({ where: { id: articleId }, data: { viewCount: { increment: 1 } }, select: { viewCount: true } });
  return NextResponse.json({ viewCount: updated.viewCount });
}
