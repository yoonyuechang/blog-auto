import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const difficulty = searchParams.get("difficulty");
    const q = searchParams.get("q");

    const where: Prisma.ArticleWhereInput = {};
    if (status) where.status = status;
    if (category) where.category = category;
    if (difficulty) where.difficultyLevel = difficulty;
    if (q) {
      where.OR = [
        { title: { contains: q } },
        { aiSummary: { contains: q } },
        { tags: { contains: q } },
      ];
    }

    const [articles, total] = await Promise.all([
      db.article.findMany({
        where,
        orderBy: { publishedAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.article.count({ where }),
    ]);

    return NextResponse.json({ articles, total, page, limit });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const article = await db.article.create({ data: body });
    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create article" }, { status: 500 });
  }
}
