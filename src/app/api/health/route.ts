import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { trackPerformance } from "@/lib/monitoring";

export async function GET() {
  const overallStart = Date.now();

  const mem = process.memoryUsage();

  const dbStart = Date.now();
  let dbConnected = false;
  try {
    await db.$queryRaw`SELECT 1`;
    dbConnected = true;
  } catch {}
  const dbLatencyMs = Date.now() - dbStart;

  const responseTimeMs = Date.now() - overallStart;
  trackPerformance("health-check", responseTimeMs);

  return NextResponse.json({
    status: dbConnected ? "ok" : "degraded",
    timestamp: new Date().toISOString(),
    dbConnected,
    dbLatencyMs,
    responseTimeMs,
    memory: {
      heapUsedMB: Math.round(mem.heapUsed / 1024 / 1024),
      heapTotalMB: Math.round(mem.heapTotal / 1024 / 1024),
      rssMB: Math.round(mem.rss / 1024 / 1024),
    },
  });
}
