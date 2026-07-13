import Card from "@/components/shared/Card";
import Badge from "@/components/shared/Badge";
import { Eye, TrendingUp } from "lucide-react";

interface Article {
  id: number;
  title: string;
  category: string;
  difficultyLevel: string;
  viewCount: number;
}

export default function WeeklyDigest({ articles }: { articles: Article[] }) {
  if (articles.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-4 flex items-center gap-2">
        <TrendingUp size={18} className="text-emerald-400" />
        <h2 className="text-lg font-bold text-text-primary">이번 주 인기글 TOP 5</h2>
      </div>
      <div className="grid gap-3">
        {articles.map((article, i) => (
          <a
            key={article.id}
            href={`/article/${article.id}`}
            className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:border-emerald-800/60 hover:bg-card/80"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-950 text-sm font-bold text-emerald-400">
              {i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-sm font-semibold text-text-primary group-hover:text-emerald-400">
                {article.title}
              </h3>
              <div className="mt-1 flex items-center gap-2">
                <span className="rounded-full bg-cyan-950 px-2 py-0.5 text-[10px] text-cyan-400">
                  {article.category}
                </span>
                <Badge level={article.difficultyLevel as "입문/초급" | "중급" | "고급"} />
              </div>
            </div>
            <span className="flex shrink-0 items-center gap-1 text-xs text-text-muted">
              <Eye size={12} />
              {article.viewCount.toLocaleString()}
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
