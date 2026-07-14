import Link from "next/link";
import { db } from "@/lib/db";
import { Search } from "lucide-react";

export default async function MarketingNotFound() {
  let suggestions: { id: number; title: string; category: string }[] = [];
  try {
    suggestions = await db.article.findMany({
      where: { status: "approved" },
      orderBy: { publishedAt: "desc" },
      take: 3,
      select: { id: true, title: true, category: true },
    });
  } catch {
    // DB down — show empty
  }

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-8xl font-extrabold text-transparent">
        404
      </h1>
      <p className="mt-4 text-lg text-text-secondary">페이지를 찾을 수 없습니다</p>

      <Link
        href="/search"
        className="mt-6 flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-text-secondary transition-colors hover:border-emerald-400/40"
      >
        <Search size={16} />
        검색어로 글 찾기
      </Link>

      {suggestions.length > 0 && (
        <div className="mt-14 w-full max-w-lg">
          <p className="mb-4 text-sm font-medium text-text-muted">인기 글</p>
          <div className="flex flex-col gap-3">
            {suggestions.map((a) => (
              <Link
                key={a.id}
                href={`/article/${a.id}`}
                className="rounded-lg border border-border bg-card p-4 text-left transition-colors hover:border-emerald-400/40"
              >
                <span className="mb-1 block text-xs text-text-muted">{a.category}</span>
                <span className="text-sm font-medium text-text-primary">{a.title}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
