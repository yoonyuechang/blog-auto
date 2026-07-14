"use client";

import { useState, useEffect } from "react";
import Badge from "@/components/shared/Badge";
import { Eye, TrendingUp } from "lucide-react";

interface RecArticle {
  id: number;
  title: string;
  category: string;
  tags: string;
  viewCount: number;
  difficultyLevel: string;
}

interface Props {
  articleId: number;
}

export default function RecommendationSidebar({ articleId }: Props) {
  const [articles, setArticles] = useState<RecArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/recommendations?articleId=${articleId}&limit=5&strategy=related`)
      .then((r) => r.json())
      .then((d) => setArticles(d.articles || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [articleId]);

  if (loading || !articles.length) return null;

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-text-primary">
        <TrendingUp size={14} className="text-emerald-400" />
        이 아티클을 읽은 분들께
      </h3>
      <ul className="space-y-3">
        {articles.map((a) => (
          <li key={a.id}>
            <a href={`/article/${a.id}`} className="group block">
              <p className="text-sm font-medium text-text-primary line-clamp-2 group-hover:text-emerald-400 transition-colors">
                {a.title}
              </p>
              <div className="mt-1 flex items-center gap-2">
                <Badge level={a.difficultyLevel as "입문/초급" | "중급" | "고급"} />
                <span className="flex items-center gap-0.5 text-[10px] text-text-muted">
                  <Eye size={10} />
                  {a.viewCount.toLocaleString()}
                </span>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
