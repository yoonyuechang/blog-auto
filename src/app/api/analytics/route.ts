import { NextRequest, NextResponse } from 'next/server';

const rateMap = new Map<string, number[]>();
const WINDOW = 60_000;
const LIMIT = 30;

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const hits = rateMap.get(ip) ?? [];
  const recent = hits.filter((t) => now - t < WINDOW);
  if (recent.length >= LIMIT) return false;
  recent.push(now);
  rateMap.set(ip, recent);
  return true;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown';
  if (!rateLimit(ip)) {
    return NextResponse.json({ error: 'rate limited' }, { status: 429 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
  }

  const { page, metric, value, timestamp } = body;
  if (!page || !metric || typeof value !== 'number') {
    return NextResponse.json({ error: 'missing fields' }, { status: 400 });
  }

  console.log(`[Analytics] ${metric}=${value}ms page=${page} ts=${timestamp ?? Date.now()}`);

  return NextResponse.json({ ok: true });
}
