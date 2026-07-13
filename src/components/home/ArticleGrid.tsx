"use client";

import Card from "@/components/shared/Card";
import Badge from "@/components/shared/Badge";
import Skeleton from "@/components/shared/Skeleton";
import Button from "@/components/shared/Button";

interface Article {
  id: number;
  title: string;
  aiSummary: string;
  category: string;
  difficultyLevel: string;
  source: string;
  tags: string;
  publishedAt: string;
}

interface ArticleGridProps {
  articles: Article[];
  loading?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

export default function ArticleGrid({ articles, loading, onLoadMore, hasMore }: ArticleGridProps) {
  if (loading && articles.length === 0) {
    return (
      <div className="mx-auto grid max-w-6xl gap-4 px-4 py-8 md:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-border bg-card p-5">
            <Skeleton className="mb-2 h-5 w-20" />
            <Skeleton className="mb-2 h-6 w-full" />
            <Skeleton className="mb-2 h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <h2 className="mb-4 text-lg font-bold text-text-primary">📰 최신 뉴스</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {articles.map((article) => (
          <Card key={article.id} href={`/article/${article.id}`}>
            <div className="mb-2 flex items-center gap-2">
              <span className="text-xs text-text-muted">{article.source}</span>
              <Badge level={article.difficultyLevel as "입문/초급" | "중급" | "고급"} />
            </div>
            <h3 className="mb-2 text-sm font-bold leading-tight text-text-primary line-clamp-2">
              {article.title}
            </h3>
            <p className="mb-3 text-xs text-text-secondary line-clamp-2">
              {article.aiSummary}
            </p>
            <div className="flex flex-wrap gap-1">
              {JSON.parse(article.tags || "[]")
                .slice(0, 3)
                .map((tag: string) => (
                  <span key={tag} className="rounded-full bg-border px-2 py-0.5 text-[10px] text-text-muted">
                    {tag}
                  </span>
                ))}
            </div>
            <p className="mt-2 text-[10px] text-text-muted">{article.publishedAt}</p>
          </Card>
        ))}
      </div>
      {hasMore && (
        <div className="mt-6 text-center">
          <Button variant="secondary" onClick={onLoadMore}>더보기</Button>
        </div>
      )}
    </section>
  );
}
