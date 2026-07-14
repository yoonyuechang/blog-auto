import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { renderWelcomeEmail } from "@/lib/email-templates";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = String(body.email || "").trim();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const existing = await db.newsletter.findUnique({ where: { email } });
    if (existing) {
      if (!existing.isActive) {
        await db.newsletter.update({ where: { email }, data: { isActive: true } });
        const html = renderWelcomeEmail({ email });
        console.log("[Newsletter] Re-subscribed, welcome email ready:", email);
        console.log("[Newsletter] Email HTML length:", html.length);
        return NextResponse.json({ message: "Re-subscribed successfully" }, { status: 200 });
      }
      return NextResponse.json({ message: "Already subscribed" }, { status: 200 });
    }

    const subscriber = await db.newsletter.create({
      data: { email, preferences: JSON.stringify(body.preferences || []) },
    });

    const html = renderWelcomeEmail({ email });
    console.log("[Newsletter] New subscriber:", email);
    console.log("[Newsletter] Welcome email HTML length:", html.length);

    return NextResponse.json(subscriber, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = String(searchParams.get("email") || "").trim();

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const subscriber = await db.newsletter.findUnique({ where: { email } });
    if (!subscriber) {
      return NextResponse.json({ error: "Subscriber not found" }, { status: 404 });
    }

    await db.newsletter.update({ where: { email }, data: { isActive: false } });
    return NextResponse.json({ message: "Unsubscribed successfully" });
  } catch {
    return NextResponse.json({ error: "Failed to unsubscribe" }, { status: 500 });
  }
}
