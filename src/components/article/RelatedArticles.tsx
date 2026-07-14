"use client";

import { useState, useEffect } from "react";
import Card from "@/components/shared/Card";
import Badge from "@/components/shared/Badge";
import { Eye } from "lucide-react";

interface RelatedArticle {
  id: number;
  title: string;
  aiSummary: string;
  difficultyLevel: string;
  tags: string;
  viewCount: number;
}

interface RelatedArticlesProps {
  articleId: number;
  tags: string;
}

export default function RelatedArticles({ articleId, tags }: RelatedArticlesProps) {
  const [articles, setArticles] = useState<RelatedArticle[]>([]);

  useEffect(() => {
    if (!tags) return;
    const parsedTags = JSON.parse(tags || "[]") as string[];
    if (!parsedTags.length) return;

    const params = new URLSearchParams({
      exclude: String(articleId),
      tags: parsedTags.join(","),
      limit: "3",
      status: "approved",
    });

    fetch(`/api/articles?${params}`)
      .then((r) => r.json())
      .then((data) => setArticles(data.articles?.slice(0, 3) ?? []))
      .catch(() => {});
  }, [articleId, tags]);

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
            <p className="mt-1 text-xs text-text-secondary line-clamp-2">
              {article.aiSummary.slice(0, 100)}
            </p>
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
