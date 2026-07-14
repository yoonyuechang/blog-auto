"use client";

import { useState, useEffect } from "react";
import Card from "@/components/shared/Card";
import Badge from "@/components/shared/Badge";
import { Eye } from "lucide-react";

interface RecArticle {
  id: number;
  title: string;
  aiSummary: string;
  difficultyLevel: string;
  tags: string;
  viewCount: number;
  category: string;
}

interface RelatedArticlesProps {
  articleId: number;
  tags: string;
}

function SkeletonCard() {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <div className="h-5 w-16 animate-pulse rounded bg-surface" />
        <div className="h-4 w-12 animate-pulse rounded bg-surface" />
      </div>
      <div className="mt-3 h-4 w-full animate-pulse rounded bg-surface" />
      <div className="mt-2 h-3 w-3/4 animate-pulse rounded bg-surface" />
    </div>
  );
}

export default function RelatedArticles({ articleId, tags }: RelatedArticlesProps) {
  const [articles, setArticles] = useState<RecArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/recommendations?articleId=${articleId}&limit=3&strategy=related`)
      .then((r) => r.json())
      .then((d) => setArticles(d.articles || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [articleId, tags]);

  if (loading) {
    return (
      <section className="mt-12 border-t border-border pt-8">
        <h2 className="mb-4 text-lg font-bold text-text-primary">관련 글</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </section>
    );
  }

  if (!articles.length) return null;

  return (
    <section className="mt-12 border-t border-border pt-8">
      <h2 className="mb-4 text-lg font-bold text-text-primary">관련 글</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {articles.map((article) => (
          <Card key={article.id} href={`/article/${article.id}`}>
            <div className="flex items-center justify-between">
              <Badge level={article.difficultyLevel as "입문/초급" | "중급" | "고급"} />
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <Eye size={12} />
                {article.viewCount.toLocaleString()}
              </span>
            </div>
            <h3 className="mt-2 text-sm font-bold text-text-primary line-clamp-2">
              {article.title}
            </h3>
            {article.aiSummary && (
              <p className="mt-1 text-xs text-text-secondary line-clamp-2">
                {article.aiSummary.slice(0, 100)}
              </p>
            )}
            {article.tags && (
              <div className="mt-2 flex flex-wrap gap-1">
                {(() => {
                  const parsed = JSON.parse(article.tags || "[]") as string[];
                  return parsed.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="rounded bg-emerald-950/50 px-1.5 py-0.5 text-[10px] text-emerald-400"
                    >
                      #{tag}
                    </span>
                  ));
                })()}
              </div>
            )}
          </Card>
        ))}
      </div>
    </section>
  );
}
