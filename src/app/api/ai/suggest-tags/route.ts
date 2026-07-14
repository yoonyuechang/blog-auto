import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

const TECH_KEYWORDS: Record<string, string[]> = {
  React: ["react", "jsx", "tsx", "hooks", "useState", "useEffect", "next.js", "nextjs", "vue", "svelte"],
  JavaScript: ["javascript", "js", "es6", "es20", "typescript", "ts", "node", "deno", "bun"],
  Python: ["python", "django", "flask", "fastapi", "pytorch", "tensorflow", "pandas"],
  AI: ["ai", "llm", "gpt", "claude", "gemini", "machine learning", "deep learning", "neural", "transformer", "openai", "anthropic"],
  DevOps: ["docker", "kubernetes", "k8s", "ci/cd", "terraform", "aws", "gcp", "azure", "deploy", "pipeline"],
  Frontend: ["css", "tailwind", "html", "dom", "browser", "responsive", "ui", "ux", "figma", "design"],
  Backend: ["api", "rest", "graphql", "database", "sql", "redis", "microservice", "server", "auth"],
  "Web3": ["blockchain", "web3", "crypto", "nft", "defi", "solidity", "ethereum"],
  Mobile: ["mobile", "ios", "android", "react native", "flutter", "swift", "kotlin"],
  Performance: ["performance", "optimization", "speed", "cache", "lazy", "bundle", "lighthouse", "core web vitals"],
  Security: ["security", "auth", "oauth", "jwt", "encryption", "xss", "csrf", "vulnerability"],
  Testing: ["test", "jest", "cypress", "playwright", "vitest", "unit test", "e2e", "tdd"],
  Data: ["data", "analytics", "etl", "pipeline", "streaming", "kafka", "elasticsearch"],
};

export async function POST(req: NextRequest) {
  const { title, summary } = await req.json();
  if (!title) return NextResponse.json({ error: "title required" }, { status: 400 });

  const text = `${title} ${summary || ""}`.toLowerCase();

  // Get existing tags from DB
  const existingTags = await db.tag.findMany({ select: { name: true } });
  const tagNames = existingTags.map((t) => t.name);

  // Score each existing tag
  const scored: { tag: string; confidence: number }[] = [];

  for (const tag of tagNames) {
    const tagLower = tag.toLowerCase();
    let confidence = 0;

    // Direct match in text
    if (text.includes(tagLower)) {
      confidence = 0.95;
    } else {
      // Check keyword mappings
      for (const [, keywords] of Object.entries(TECH_KEYWORDS)) {
        if (keywords.some((k) => tagLower.includes(k) || k.includes(tagLower))) {
          if (keywords.some((k) => text.includes(k))) {
            confidence = Math.max(confidence, 0.7);
          }
        }
      }
    }

    if (confidence > 0) {
      scored.push({ tag, confidence });
    }
  }

  scored.sort((a, b) => b.confidence - a.confidence);

  return NextResponse.json({ suggestions: scored.slice(0, 8) });
}
