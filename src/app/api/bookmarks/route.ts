import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { articleId } = await req.json();
    if (!articleId) {
      return NextResponse.json({ error: "articleId required" }, { status: 400 });
    }

    return NextResponse.json({ bookmarked: true, articleId });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
