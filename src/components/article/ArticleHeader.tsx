import Badge from "@/components/shared/Badge";
import { ExternalLink, Calendar, Clock, RotateCcw } from "lucide-react";

interface ArticleHeaderProps {
  title: string;
  category: string;
  source: string;
  sourceUrl: string;
  difficultyLevel: string;
  publishedAt: string;
  updatedAt?: string;
  viewCount?: number;
}

const CATEGORY_COLORS: Record<string, string> = {
  프론트엔드: "bg-blue-950 text-blue-400",
  백엔드: "bg-violet-950 text-violet-400",
  "AI/ML": "bg-amber-950 text-amber-400",
  인프라: "bg-rose-950 text-rose-400",
  개발문화: "bg-cyan-950 text-cyan-400",
};

function estimateReadingTime(content: string): number {
  const charsPerMin = 1200;
  return Math.max(1, Math.ceil(content.length / charsPerMin));
}

export default function ArticleHeader({
  title,
  category,
  source,
  sourceUrl,
  difficultyLevel,
  publishedAt,
  updatedAt,
  viewCount,
}: ArticleHeaderProps) {
  const catColor = CATEGORY_COLORS[category] || "bg-cyan-950 text-cyan-400";

  return (
    <div className="mb-8">
      {/* Breadcrumb */}
      <nav className="mb-4 text-sm text-text-muted" aria-label="breadcrumb">
        <a href="/" className="hover:text-text-primary">홈</a>
        <span className="mx-1.5">/</span>
        <a href={`/category/${category}`} className="hover:text-text-primary">{category}</a>
        <span className="mx-1.5">/</span>
        <span className="text-text-secondary line-clamp-1 inline-block max-w-[200px] align-bottom">{title}</span>
      </nav>

      {/* Category + Difficulty */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <a
          href={`/category/${category}`}
          className={`rounded-full px-3 py-1 text-xs font-medium ${catColor}`}
        >
          {category}
        </a>
        <Badge level={difficultyLevel as "입문/초급" | "중급" | "고급"} size="md" />
        {viewCount != null && viewCount > 0 && (
          <span className="text-xs text-text-muted">{viewCount.toLocaleString()}회 조회</span>
        )}
      </div>

      {/* Title */}
      <h1 className="mb-5 text-2xl font-extrabold leading-snug text-text-primary md:text-3xl lg:text-4xl">
        {title}
      </h1>

      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-text-muted">
        <span className="flex items-center gap-1.5">
          <Calendar size={14} className="text-emerald-400" />
          {publishedAt}
        </span>
        {updatedAt && updatedAt !== publishedAt && (
          <span className="flex items-center gap-1.5">
            <RotateCcw size={14} className="text-emerald-400" />
            수정: {updatedAt}
          </span>
        )}
        <span className="flex items-center gap-1.5">
          <Clock size={14} className="text-emerald-400" />
          약 3분 읽기
        </span>
        <span>{source}</span>
        <a
          href={sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-emerald-400 hover:underline"
        >
          원문 <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
}
