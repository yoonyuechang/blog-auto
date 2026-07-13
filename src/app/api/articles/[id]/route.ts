import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

const ARTICLE_FIELDS = [
  "title", "summary", "content", "source", "sourceUrl",
  "category", "tags", "difficultyLevel", "publishedAt", "status",
  "aiSummary", "keyPoints", "viewCount",
] as const;

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

    const article = await db.article.findUnique({ where: { id } });
    if (!article) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json(article);
  } catch {
    return NextResponse.json({ error: "Failed to fetch article" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

    const body = await req.json();
    const data: Record<string, unknown> = {};
    for (const key of ARTICLE_FIELDS) {
      if (key in body) data[key] = body[key];
    }
    const article = await db.article.update({ where: { id }, data: data as any });
    return NextResponse.json(article);
  } catch {
    return NextResponse.json({ error: "Failed to update article" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

    await db.article.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete article" }, { status: 500 });
  }
}
