import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import ArticleHeader from "@/components/article/ArticleHeader";
import AISummary from "@/components/article/AISummary";
import MarkdownBody from "@/components/article/MarkdownBody";
import RelatedArticles from "@/components/article/RelatedArticles";
import ReadingProgress from "@/components/article/ReadingProgress";
import ArticleFeedback from "@/components/feedback/ArticleFeedback";
import AdSense from "@/components/shared/AdSense";

export const dynamic = "force-dynamic";

interface PageProps {
  params: { id: string };
}

export default async function ArticlePage({ params }: PageProps) {
  const id = parseInt(params.id);
  if (isNaN(id)) notFound();

  const article = await db.article.findUnique({ where: { id } });
  if (!article || article.status !== "approved") notFound();

  await db.article.update({ where: { id }, data: { viewCount: { increment: 1 } } });

  const related = await db.article.findMany({
    where: { category: article.category, status: "approved", id: { not: id } },
    orderBy: { publishedAt: "desc" },
    take: 3,
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.aiSummary,
    author: { "@type": "Organization", name: "DevPulse" },
    datePublished: article.publishedAt.toISOString(),
    dateModified: article.updatedAt.toISOString(),
    publisher: { "@type": "Organization", name: "DevPulse" },
  };

  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <ReadingProgress />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ArticleHeader
        title={article.title}
        category={article.category}
        source={article.source}
        sourceUrl={article.sourceUrl}
        difficultyLevel={article.difficultyLevel}
        publishedAt={article.publishedAt.toISOString().split("T")[0]}
      />
      <AISummary aiSummary={article.aiSummary} keyPoints={article.keyPoints} />
      <MarkdownBody content={article.content} />
      <AdSense slot="0000000000" format="auto" />
      <div className="mt-8">
        <ArticleFeedback articleId={article.id} />
      </div>
      <RelatedArticles articles={related.map((r) => ({ id: r.id, title: r.title, aiSummary: r.aiSummary, difficultyLevel: r.difficultyLevel }))} />
    </article>
  );
}
