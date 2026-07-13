import Badge from "@/components/shared/Badge";
import { ExternalLink, Calendar } from "lucide-react";

interface ArticleHeaderProps {
  title: string;
  category: string;
  source: string;
  sourceUrl: string;
  difficultyLevel: string;
  publishedAt: string;
}

export default function ArticleHeader({ title, category, source, sourceUrl, difficultyLevel, publishedAt }: ArticleHeaderProps) {
  return (
    <div className="mb-8">
      <div className="mb-4 flex items-center gap-2">
        <a href={`/category/${category}`} className="rounded bg-cyan-950 px-2 py-0.5 text-xs text-cyan-400 hover:bg-cyan-900">
          {category}
        </a>
        <Badge level={difficultyLevel as "입문/초급" | "중급" | "고급"} size="md" />
      </div>
      <h1 className="mb-4 text-2xl font-extrabold leading-tight text-text-primary md:text-3xl">{title}</h1>
      <div className="flex items-center gap-4 text-sm text-text-muted">
        <span className="flex items-center gap-1"><Calendar size={14} />{publishedAt}</span>
        <span>{source}</span>
        <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-emerald-400 hover:underline">
          원문 보러가기 <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
}
