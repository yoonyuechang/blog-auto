"use client";

import { useState, useMemo } from "react";
import { Clock, TrendingUp, FileX } from "lucide-react";
import Card from "@/components/shared/Card";
import Badge from "@/components/shared/Badge";

interface Article {
  id: number;
  title: string;
  aiSummary: string;
  difficultyLevel: string;
  source: string;
  tags: string;
  publishedAt: string;
  viewCount: number;
}

const difficulties = ["전체", "입문/초급", "중급", "고급"];
const sortOptions = [
  { key: "latest" as const, label: "최신순", icon: Clock },
  { key: "popular" as const, label: "인기순", icon: TrendingUp },
];

export default function CategoryClient({
  initialArticles,
  categoryColor,
}: {
  initialArticles: Article[];
  categoryColor?: string;
}) {
  const [difficulty, setDifficulty] = useState("전체");
  const [sortKey, setSortKey] = useState<"latest" | "popular">("latest");

  const filtered = useMemo(() => {
    const list = difficulty === "전체" ? initialArticles : initialArticles.filter((a) => a.difficultyLevel === difficulty);
    if (sortKey === "popular") return [...list].sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
    return list;
  }, [initialArticles, difficulty, sortKey]);

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="flex gap-1.5">
          {difficulties.map((d) => (
            <button key={d} onClick={() => setDifficulty(d)}
              className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${difficulty === d ? "bg-emerald-500 text-white" : "bg-card text-text-muted hover:text-text-primary"}`}>
              {d}
            </button>
          ))}
        </div>
        <span className="h-4 w-px bg-border" />
        <div className="flex gap-1.5">
          {sortOptions.map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setSortKey(key)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition-colors ${sortKey === key ? "bg-card text-text-primary border border-border" : "text-text-muted hover:text-text-primary"}`}>
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-20 text-center">
          <FileX size={40} className="mb-3 text-text-muted" />
          <p className="text-lg font-medium text-text-primary">아티클이 없습니다</p>
          <p className="mt-1 text-sm text-text-muted">다른 난이도 필터를 시도해 보세요</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((article) => (
            <Card key={article.id} href={`/article/${article.id}`} accentColor={categoryColor}>
              <Badge level={article.difficultyLevel as "입문/초급" | "중급" | "고급"} />
              <h3 className="mt-2 text-sm font-bold text-text-primary line-clamp-2">{article.title}</h3>
              <p className="mt-1 text-xs text-text-secondary line-clamp-2">{article.aiSummary}</p>
              <div className="mt-3 flex items-center justify-between text-[10px] text-text-muted">
                <span>{article.publishedAt}</span>
                {article.viewCount > 0 && (
                  <span className="flex items-center gap-1">
                    <TrendingUp size={10} />
                    {article.viewCount.toLocaleString()}
                  </span>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
