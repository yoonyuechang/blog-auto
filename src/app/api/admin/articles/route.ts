import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20")));
    const sort = searchParams.get("sort") || "createdAt";
    const order = searchParams.get("order") || "desc";
    const category = searchParams.get("category");
    const status = searchParams.get("status");

    const where: Prisma.ArticleWhereInput = {};
    if (category) where.category = category;
    if (status) where.status = status;

    const orderBy: Prisma.ArticleOrderByWithRelationInput = { [sort]: order as "asc" | "desc" };

    const [articles, total] = await Promise.all([
      db.article.findMany({ where, orderBy, skip: (page - 1) * limit, take: limit }),
      db.article.count({ where }),
    ]);

    return NextResponse.json({ articles, total, page, limit });
  } catch {
    return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const secret = searchParams.get("secret");
    if (secret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const id = parseInt(searchParams.get("id") || "");
    if (isNaN(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

    await db.article.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete article" }, { status: 500 });
  }
}
