import Card from "@/components/shared/Card";
import Badge from "@/components/shared/Badge";

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

export default function TrendingCards({ articles }: TrendingCardsProps) {
  if (articles.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <h2 className="mb-4 text-lg font-bold text-text-primary">🔥 트렌딩</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {articles.map((article) => (
          <Card key={article.id} href={`/article/${article.id}`}>
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded bg-cyan-950 px-2 py-0.5 text-xs text-cyan-400">
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
              <span>{article.source}</span>
              <span>{article.publishedAt}</span>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
