import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const subscribers = await db.newsletter.findMany({ orderBy: { subscribedAt: "desc" } });
  return NextResponse.json(subscribers);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const existing = await db.newsletter.findUnique({ where: { email: body.email } });
  if (existing) {
    return NextResponse.json({ message: "Already subscribed" }, { status: 200 });
  }
  const subscriber = await db.newsletter.create({
    data: {
      email: body.email,
      preferences: JSON.stringify(body.preferences || []),
    },
  });
  return NextResponse.json(subscriber, { status: 201 });
}
