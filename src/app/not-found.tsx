import Link from "next/link";
import { db } from "@/lib/db";

export default async function NotFoundPage() {
  let suggestions: { id: number; title: string; category: string }[] = [];
  try {
    suggestions = await db.article.findMany({
      where: { status: "approved" },
      orderBy: { publishedAt: "desc" },
      take: 3,
      select: { id: true, title: true, category: true },
    });
  } catch {
    // DB might be down — just show empty suggestions
  }

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-8xl font-extrabold text-transparent">
        404
      </h1>
      <p className="mt-4 text-lg text-text-secondary">페이지를 찾을 수 없습니다</p>
      <Link
        href="/"
        className="mt-8 rounded-lg bg-emerald-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-emerald-600"
      >
        홈으로 돌아가기
      </Link>

      {suggestions.length > 0 && (
        <div className="mt-14 w-full max-w-lg">
          <p className="mb-4 text-sm font-medium text-text-muted">최신 글</p>
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
