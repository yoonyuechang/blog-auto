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
import ShareButtons from "@/components/article/ShareButtons";
import NewsletterInline from "@/components/shared/NewsletterInline";
import AdSense from "@/components/shared/AdSense";
import AuthorBio from "@/components/article/AuthorBio";
import Link from "next/link";
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

      <div className="mb-6 flex flex-wrap gap-2">
        <Link href={`/category/${article.category}`} className="text-xs font-medium text-text-muted hover:text-emerald-400">
          #{article.category}
        </Link>
        {article.tags && article.tags.split(",").map((tag: string) => (
          <Link key={tag} href={`/search?q=${encodeURIComponent(tag.trim())}`} className="text-xs text-text-muted hover:text-emerald-400">
            #{tag.trim()}
          </Link>
        ))}
      </div>

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

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <ShareButtons
          title={article.title}
          url={`${SITE_URL}/article/${id}`}
        />
      </div>

      <div className="mt-6 rounded-xl border border-border bg-card p-6">
        <h3 className="mb-3 text-center text-base font-bold text-text-primary">
          이 글이 도움이 되었나요?
        </h3>
        <div className="flex justify-center">
          <ArticleFeedback articleId={article.id} />
        </div>
      </div>

      <NewsletterInline />

      <RelatedArticles
        articles={related.map((r) => ({
          id: r.id,
          title: r.title,
          aiSummary: r.aiSummary,
          difficultyLevel: r.difficultyLevel,
        }))}
      />

      <AuthorBio />
    </article>
  );
}
