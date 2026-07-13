"use client";

import { Eye, Clock, ArrowRight } from "lucide-react";
import Badge from "@/components/shared/Badge";

interface FeaturedArticleProps {
  id: number;
  title: string;
  aiSummary: string;
  category: string;
  difficultyLevel: string;
  tags: string;
  viewCount: number;
  publishedAt: string;
}

const CATEGORY_GRADIENT: Record<string, string> = {
  프론트엔드: "from-blue-500/20 via-blue-600/10 to-transparent",
  백엔드: "from-violet-500/20 via-violet-600/10 to-transparent",
  "AI/ML": "from-amber-500/20 via-amber-600/10 to-transparent",
  인프라: "from-rose-500/20 via-rose-600/10 to-transparent",
  개발문화: "from-cyan-500/20 via-cyan-600/10 to-transparent",
};

function estimateReadingTime(content?: string): string {
  if (!content) return "3분";
  return Math.max(1, Math.ceil(content.length / 300)) + "분";
}

export default function FeaturedArticle(props: FeaturedArticleProps) {
  const gradient = CATEGORY_GRADIENT[props.category] || "from-emerald-500/20 via-emerald-600/10 to-transparent";

  return (
    <a href={`/article/${props.id}`} className="group block mx-auto max-w-6xl px-4 pt-4 pb-2">
      <div className={`relative overflow-hidden rounded-2xl border border-border bg-gradient-to-r ${gradient} p-8 md:p-12 transition-all hover:border-emerald-400/30 hover:shadow-lg hover:shadow-emerald-500/5`}>
        <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-400">
          ⭐ 인기 글
        </span>

        <h2 className="mb-3 text-2xl font-bold text-text-primary md:text-3xl leading-tight group-hover:text-emerald-300 transition-colors">
          {props.title}
        </h2>

        <p className="mb-5 max-w-2xl text-sm leading-relaxed text-text-secondary md:text-base line-clamp-2">
          {props.aiSummary}
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <Badge level={props.difficultyLevel as "입문/초급" | "중급" | "고급"} size="md" />
          <span className="text-sm text-text-muted">{props.category}</span>
        </div>

        <div className="mt-5 flex items-center gap-4 text-xs text-text-muted">
          <span className="flex items-center gap-1">
            <Eye size={14} />
            {props.viewCount.toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={14} />
            {estimateReadingTime()} 읽기
          </span>
          <span>{props.publishedAt}</span>
        </div>

        <div className="mt-6 inline-flex items-center gap-1.5 rounded-lg border border-border bg-card/60 px-4 py-2 text-sm font-medium text-text-primary transition-all group-hover:border-emerald-400/50 group-hover:bg-emerald-500/10 group-hover:text-emerald-400 group-hover:shadow-[0_0_12px_rgba(52,211,153,0.15)]">
          읽기 <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
        </div>
      </div>
    </a>
  );
}
