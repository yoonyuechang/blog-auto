import { NextResponse } from "next/server";
import { getSystemHealth, getRecentMetrics } from "@/lib/monitoring";
import { getRecentErrors } from "@/lib/error-logger";
import { db } from "@/lib/db";

// ponytail: simple in-memory rate limiter, sufficient for single-instance
const hits = new Map<string, number[]>();
function isRateLimited(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const timestamps = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (timestamps.length >= limit) return true;
  timestamps.push(now);
  hits.set(key, timestamps);
  return false;
}

export async function GET(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  if (isRateLimited(ip, 10, 60_000)) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const health = await getSystemHealth();
  const metrics = getRecentMetrics(10);
  const errors = getRecentErrors(5);

  // Source connectivity check
  let sourceCount = 0;
  let activeSourceCount = 0;
  try {
    const sources = await db.source.findMany({ select: { isActive: true } });
    sourceCount = sources.length;
    activeSourceCount = sources.filter((s) => s.isActive).length;
  } catch {}

  return NextResponse.json({
    ...health,
    sourceStats: { total: sourceCount, active: activeSourceCount },
    recentMetrics: metrics,
    recentErrors: errors,
    timestamp: new Date().toISOString(),
  });
}
