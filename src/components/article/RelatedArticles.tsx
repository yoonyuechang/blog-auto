import Card from "@/components/shared/Card";
import Badge from "@/components/shared/Badge";

interface RelatedArticle {
  id: number;
  title: string;
  aiSummary: string;
  difficultyLevel: string;
}

interface RelatedArticlesProps {
  articles: RelatedArticle[];
}

export default function RelatedArticles({ articles }: RelatedArticlesProps) {
  if (articles.length === 0) return null;
  return (
    <section className="mt-12 border-t border-border pt-8">
      <h2 className="mb-4 text-lg font-bold text-text-primary">관련 글</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {articles.map((article) => (
          <Card key={article.id} href={`/article/${article.id}`}>
            <Badge level={article.difficultyLevel as "입문/초급" | "중급" | "고급"} />
            <h3 className="mt-2 text-sm font-bold text-text-primary line-clamp-2">{article.title}</h3>
            <p className="mt-1 text-xs text-text-secondary line-clamp-2">{article.aiSummary}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
