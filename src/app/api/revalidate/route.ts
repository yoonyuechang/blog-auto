import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-revalidate-secret");
  const expected = process.env.REVALIDATE_SECRET;

  if (!expected || secret !== expected) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  const { articleId } = await req.json();

  if (articleId) {
    revalidatePath(`/article/${articleId}`);
  }
  revalidatePath("/");

  return NextResponse.json({ revalidated: true, now: Date.now() });
}
