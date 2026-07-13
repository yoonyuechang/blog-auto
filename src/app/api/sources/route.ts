import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

const SOURCE_FIELDS = ["name", "type", "url", "fetchInterval", "isActive", "category"] as const;

export async function GET() {
  const sources = await db.source.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(sources);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data: Record<string, unknown> = {};
    for (const key of SOURCE_FIELDS) {
      if (key in body) data[key] = body[key];
    }
    if (!data.name || !data.type || !data.url) {
      return NextResponse.json({ error: "name, type, url required" }, { status: 400 });
    }
    const source = await db.source.create({ data: data as any });
    return NextResponse.json(source, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create source" }, { status: 500 });
  }
}
