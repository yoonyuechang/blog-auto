import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const sources = await db.source.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(sources);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const source = await db.source.create({ data: body });
  return NextResponse.json(source, { status: 201 });
}
