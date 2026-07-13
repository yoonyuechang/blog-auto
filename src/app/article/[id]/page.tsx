import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import ArticleHeader from "@/components/article/ArticleHeader";
import AISummary from "@/components/article/AISummary";
import MarkdownBody from "@/components/article/MarkdownBody";
import RelatedArticles from "@/components/article/RelatedArticles";
import ReadingProgress from "@/components/article/ReadingProgress";
import ArticleFeedback from "@/components/feedback/ArticleFeedback";
import TableOfContents from "@/components/article/TableOfContents";
import AdSense from "@/components/shared/AdSense";
import {
  generateBreadcrumbSchema,
  generateFAQSchema,
  extractMetaDescription,
  extractHeadingsFromMarkdown,
  extractFAQsFromContent,
} from "@/lib/seo-loop";

export const dynamic = "force-dynamic";

const SITE_URL = "https://blog-auto-woad.vercel.app";

interface PageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const id = parseInt(params.id);
  if (isNaN(id)) return {};
  const article = await db.article.findUnique({ where: { id } });
  if (!article || article.status !== "approved") return {};
  const description = extractMetaDescription(article.aiSummary);
  return {
    title: `${article.title} | DevPulse`,
    description,
    alternates: { canonical: `${SITE_URL}/article/${id}` },
    openGraph: {
      title: article.title,
      description,
      url: `${SITE_URL}/article/${id}`,
      siteName: "DevPulse",
      type: "article",
      publishedTime: article.publishedAt.toISOString(),
      modifiedTime: article.updatedAt.toISOString(),
      locale: "ko_KR",
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description,
    },
  };
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

  const headings = extractHeadingsFromMarkdown(article.content);
  const faqs = extractFAQsFromContent(article.content);
  const description = extractMetaDescription(article.aiSummary);

  const breadcrumbSchema = generateBreadcrumbSchema({
    id,
    title: article.title,
    category: article.category,
  });
  const faqSchema = generateFAQSchema(faqs);

  const updatedDate = article.updatedAt.toISOString().split("T")[0];

  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <ReadingProgress />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchema),
          }}
        />
      )}

      <ArticleHeader
        title={article.title}
        category={article.category}
        source={article.source}
        sourceUrl={article.sourceUrl}
        difficultyLevel={article.difficultyLevel}
        publishedAt={article.publishedAt.toISOString().split("T")[0]}
        updatedAt={updatedDate}
        viewCount={article.viewCount}
      />

      {headings.length > 2 && <TableOfContents headings={headings} />}

      <AISummary aiSummary={article.aiSummary} keyPoints={article.keyPoints} />
      <MarkdownBody content={article.content} />
      <AdSense slot="0000000000" format="auto" />
      <div className="mt-8">
        <ArticleFeedback articleId={article.id} />
      </div>
      <RelatedArticles
        articles={related.map((r) => ({
          id: r.id,
          title: r.title,
          aiSummary: r.aiSummary,
          difficultyLevel: r.difficultyLevel,
        }))}
      />
    </article>
  );
}
