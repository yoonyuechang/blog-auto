import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { articleId, type } = await request.json();
  return NextResponse.json({ success: true });
}
