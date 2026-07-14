"use client";

import { useCallback } from "react";
import Card from "@/components/shared/Card";
import GlowCard from "@/components/shared/GlowCard";
import Badge from "@/components/shared/Badge";
import Skeleton from "@/components/shared/Skeleton";
import DateFormatter from "@/components/shared/DateFormatter";
import InfiniteScroll from "@/components/shared/InfiniteScroll";
import { Eye, Clock } from "lucide-react";
import QualityBadge from "@/components/shared/QualityBadge";
import { calculateQualityScore } from "@/lib/content-quality";

interface Article {
  id: number;
  title: string;
  aiSummary: string;
  category: string;
  difficultyLevel: string;
  source: string;
  tags: string;
  publishedAt: string;
  viewCount?: number;
  content?: string;
}

interface ArticleGridProps {
  articles: Article[];
  loading?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

const CATEGORY_DOT: Record<string, string> = {
  프론트엔드: "bg-blue-400",
  백엔드: "bg-violet-400",
  "AI/ML": "bg-amber-400",
  인프라: "bg-rose-400",
  개발문화: "bg-cyan-400",
};

function estimateReadingTime(content?: string): string {
  if (!content) return "3분";
  return Math.max(1, Math.ceil(content.length / 200)) + "분";
}

export default function ArticleGrid({ articles, loading, onLoadMore, hasMore }: ArticleGridProps) {
  const stableLoadMore = useCallback(() => { onLoadMore?.(); }, [onLoadMore]);

  if (loading && articles.length === 0) {
    return (
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 px-4 py-8 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="relative overflow-hidden rounded-xl border border-border bg-card p-5">
            <span className="absolute left-0 top-0 h-full w-1 rounded-l-xl bg-border" />
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-10" />
            </div>
            <Skeleton className="mt-3 mb-2 h-5 w-full" />
            <Skeleton className="mb-2 h-4 w-full" />
            <Skeleton className="mb-3 h-4 w-2/3" />
            <div className="flex gap-1">
              <Skeleton className="h-5 w-12 rounded-full" />
              <Skeleton className="h-5 w-14 rounded-full" />
              <Skeleton className="h-5 w-10 rounded-full" />
            </div>
            <div className="mt-3 flex items-center gap-3">
              <Skeleton className="h-3 w-10" />
              <Skeleton className="h-3 w-10" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <h2 className="mb-4 text-lg font-bold text-text-primary">최신 뉴스</h2>
      <InfiniteScroll onLoadMore={stableLoadMore} hasMore={!!hasMore} loading={!!loading}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <GlowCard key={article.id} className="card-hover">
              <Card href={`/article/${article.id}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className={`h-2 w-2 rounded-full ${CATEGORY_DOT[article.category] || "bg-cyan-400"}`} />
                  <span className="text-xs text-text-muted">{article.category}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Badge level={article.difficultyLevel as "입문/초급" | "중급" | "고급"} />
                  <QualityBadge
                    score={calculateQualityScore({
                      content: article.content || "",
                      aiSummary: article.aiSummary,
                      tags: article.tags,
                      source: article.source,
                    }).score}
                  />
                </div>
              </div>

              <h3 className="mt-3 mb-2 text-sm font-bold leading-tight text-text-primary line-clamp-2">
                {article.title}
              </h3>

              <p className="mb-3 text-xs leading-relaxed text-text-secondary line-clamp-2">
                {article.aiSummary}
              </p>

              <div className="flex flex-wrap gap-1">
                {JSON.parse(article.tags || "[]")
                  .slice(0, 3)
                  .map((tag: string) => (
                    <Badge key={tag} variant="cyan" size="sm">{tag}</Badge>
                  ))}
              </div>

              <div className="mt-3 flex items-center gap-3 text-[10px] text-text-muted">
                <span className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {article.viewCount ?? 0}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {estimateReadingTime(article.content)}
                </span>
                <span><DateFormatter date={article.publishedAt} /></span>
              </div>
            </Card>
            </GlowCard>
          ))}
        </div>
      </InfiniteScroll>
    </section>
  );
}
