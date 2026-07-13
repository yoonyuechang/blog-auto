import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const subscribers = await db.newsletter.findMany({ orderBy: { subscribedAt: "desc" } });
    return NextResponse.json(subscribers);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch subscribers" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.email || typeof body.email !== "string") {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }
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
  } catch (error) {
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
