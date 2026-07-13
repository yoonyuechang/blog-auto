import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

const SOURCE_FIELDS = ["name", "type", "url", "fetchInterval", "isActive", "category"] as const;

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  if (isNaN(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  try {
    const body = await req.json();
    const data: Record<string, unknown> = {};
    for (const key of SOURCE_FIELDS) {
      if (key in body) data[key] = body[key];
    }
    const source = await db.source.update({ where: { id }, data: data as any });
    return NextResponse.json(source);
  } catch {
    return NextResponse.json({ error: "Failed to update source" }, { status: 500 });
  }
}
