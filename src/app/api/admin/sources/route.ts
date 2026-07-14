import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const sources = await db.source.findMany({ orderBy: { createdAt: "desc" } });
    const sourcesWithCounts = await Promise.all(
      sources.map(async (source) => {
        const articleCount = await db.article.count({ where: { source: source.name } });
        return { ...source, articleCount };
      })
    );
    return NextResponse.json(sourcesWithCounts);
  } catch {
    return NextResponse.json({ error: "Failed to fetch sources" }, { status: 500 });
  }
}

const SOURCE_FIELDS = ["name", "type", "url", "fetchInterval", "isActive", "category"] as const;

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

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    const data: Record<string, unknown> = {};
    for (const key of SOURCE_FIELDS) {
      if (key in updates) data[key] = updates[key];
    }
    const source = await db.source.update({ where: { id }, data: data as any });
    return NextResponse.json(source);
  } catch {
    return NextResponse.json({ error: "Failed to update source" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = parseInt(searchParams.get("id") || "");
    if (isNaN(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    await db.source.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete source" }, { status: 500 });
  }
}
