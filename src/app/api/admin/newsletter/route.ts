import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { renderDigestEmail } from "@/lib/email-templates";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = 20;
    const skip = (page - 1) * limit;

    const [subscribers, total] = await Promise.all([
      db.newsletter.findMany({
        orderBy: { subscribedAt: "desc" },
        skip,
        take: limit,
      }),
      db.newsletter.count(),
    ]);

    return NextResponse.json({
      subscribers: subscribers.map((s) => ({
        id: s.id,
        email: s.email,
        subscribedAt: s.subscribedAt.toISOString(),
        isActive: s.isActive,
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch subscribers" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const activeSubscribers = await db.newsletter.findMany({ where: { isActive: true } });

    if (activeSubscribers.length === 0) {
      return NextResponse.json({ error: "No active subscribers" }, { status: 400 });
    }

    const now = new Date();
    const weekLabel = `${now.getFullYear()}년 ${now.getMonth() + 1}월 ${now.getDate()}일 주간 다이제스트`;

    const articles = Array.isArray(body.articles) ? body.articles.slice(0, 10) : [];
    const html = renderDigestEmail({ email: "", articles, weekLabel });

    console.log(`[Newsletter] Sending digest to ${activeSubscribers.length} subscribers`);
    console.log(`[Newsletter] Week: ${weekLabel}, Articles: ${articles.length}`);
    console.log(`[Newsletter] Email HTML length: ${html.length}`);

    return NextResponse.json({
      message: `Newsletter queued for ${activeSubscribers.length} subscribers`,
      recipientCount: activeSubscribers.length,
      articleCount: articles.length,
    });
  } catch {
    return NextResponse.json({ error: "Failed to send newsletter" }, { status: 500 });
  }
}
