import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { articleId, type } = await request.json();
    // ponytail: stub — no Feedback model in schema yet, persist when added
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to submit feedback" }, { status: 500 });
  }
}
