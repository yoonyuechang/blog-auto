import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  let dbConnected = false;
  try {
    await db.$queryRaw`SELECT 1`;
    dbConnected = true;
  } catch {}

  return NextResponse.json({
    status: dbConnected ? "ok" : "degraded",
    timestamp: new Date().toISOString(),
    dbConnected,
  });
}
