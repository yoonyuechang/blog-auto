import AnimatedSection from "@/components/shared/AnimatedSection";
import Card from "@/components/shared/Card";
import Badge from "@/components/shared/Badge";
import { Eye } from "lucide-react";

interface Article {
  id: number;
  title: string;
  aiSummary: string;
  category: string;
  difficultyLevel: string;
  source: string;
  publishedAt: string;
  viewCount: number;
}

interface TrendingCardsProps {
  articles: Article[];
}

const RANK_STYLES = [
  "from-emerald-950/80 to-card border-emerald-800/40",
  "from-cyan-950/60 to-card border-cyan-800/30",
  "from-violet-950/50 to-card border-violet-800/30",
];

const RANK_BADGE = ["bg-emerald-500 text-bg", "bg-cyan-500 text-bg", "bg-violet-500 text-bg"];

export default function TrendingCards({ articles }: TrendingCardsProps) {
  if (articles.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-8" aria-label="트렌딩 글">
      <h2 className="mb-4 text-lg font-bold text-text-primary">🔥 트렌딩</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {articles.map((article, i) => (
          <AnimatedSection key={article.id} delay={i * 100} direction="up">
            <div className="relative">
              <span
                className={`absolute -left-2 -top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${RANK_BADGE[i] ?? RANK_BADGE[2]}`}
              >
                {i + 1}
              </span>
              <Card
                href={`/article/${article.id}`}
                className={`bg-gradient-to-br ${RANK_STYLES[i] ?? RANK_STYLES[2]} border hover-lift`}
              >
                <div className="mb-2 flex items-center gap-2">
                  <span className="rounded-full bg-cyan-950 px-2.5 py-0.5 text-xs text-cyan-400">
                    {article.category}
                  </span>
                  <Badge level={article.difficultyLevel as "입문/초급" | "중급" | "고급"} />
                </div>
                <h3 className="mb-2 text-base font-bold leading-tight text-text-primary line-clamp-2">
                  {article.title}
                </h3>
                <p className="mb-3 text-sm text-text-secondary line-clamp-2">
                  {article.aiSummary}
                </p>
                <div className="flex items-center justify-between text-xs text-text-muted">
                  <span className="flex items-center gap-1">
                    <Eye size={12} />
                    {article.viewCount.toLocaleString()}
                  </span>
                  <span>{article.publishedAt}</span>
                </div>
              </Card>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </section>
  );
}
