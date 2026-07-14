import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import ArticleHeader from "@/components/article/ArticleHeader";
import DateFormatter from "@/components/shared/DateFormatter";
import AISummary from "@/components/article/AISummary";
import MarkdownBody from "@/components/article/MarkdownBody";
import RelatedArticles from "@/components/article/RelatedArticles";
import RecommendationSidebar from "@/components/shared/RecommendationSidebar";
import ReadingProgress from "@/components/article/ReadingProgress";
import ArticleFeedback from "@/components/feedback/ArticleFeedback";
import TableOfContents from "@/components/article/TableOfContents";
import ShareButtons from "@/components/article/ShareButtons";
import BookmarkButton from "@/components/article/BookmarkButton";
import NewsletterInline from "@/components/shared/NewsletterInline";
import AdSense from "@/components/shared/AdSense";
import AuthorBio from "@/components/article/AuthorBio";
import ViewCounter from "@/components/article/ViewCounter";
import ArticleNav from "@/components/article/ArticleNav";
import ArticleHistoryTracker from "@/components/article/ArticleHistoryTracker";
import Link from "next/link";
import { calculateQualityScore } from "@/lib/content-quality";
import QualityBadge from "@/components/shared/QualityBadge";
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
      authors: ["DevPulse"],
      tags: article.tags ? JSON.parse(article.tags || "[]") : [],
      locale: "ko_KR",
      images: [
        {
          url: `${SITE_URL}/api/og?title=${encodeURIComponent(article.title)}&category=${encodeURIComponent(article.category)}`,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@devpulse",
      creator: "@devpulse",
      title: article.title,
      description,
      images: [
        {
          url: `${SITE_URL}/api/og?title=${encodeURIComponent(article.title)}&category=${encodeURIComponent(article.category)}`,
          alt: article.title,
        },
      ],
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const id = parseInt(params.id);
  if (isNaN(id)) notFound();

  try {
    const article = await db.article.findUnique({ where: { id } });
    if (!article || article.status !== "approved") notFound();

    const headings = extractHeadingsFromMarkdown(article.content);
    const faqs = extractFAQsFromContent(article.content);

    const [prevArticle, nextArticle] = await Promise.all([
      db.article.findFirst({
        where: { status: "approved", publishedAt: { lt: article.publishedAt } },
        orderBy: { publishedAt: "desc" },
        select: { id: true, title: true },
      }),
      db.article.findFirst({
        where: { status: "approved", publishedAt: { gt: article.publishedAt } },
        orderBy: { publishedAt: "asc" },
        select: { id: true, title: true },
      }),
    ]);

    const breadcrumbSchema = generateBreadcrumbSchema({
      id,
      title: article.title,
      category: article.category,
    });
    const faqSchema = generateFAQSchema(faqs);

    const quality = calculateQualityScore({
      content: article.content,
      aiSummary: article.aiSummary,
      tags: article.tags,
      source: article.source,
    });

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

        <div className="mb-6 flex flex-wrap items-center gap-2">
          <Link href={`/category/${article.category}`} className="text-xs font-medium text-text-muted hover:text-emerald-400">
            #{article.category}
          </Link>
          {article.tags && JSON.parse(article.tags || "[]").map((tag: string) => (
            <Link key={tag} href={`/search?q=${encodeURIComponent(tag)}`} className="text-xs text-text-muted hover:text-emerald-400">
              #{tag}
            </Link>
          ))}
          <div className="ml-auto">
            <QualityBadge score={quality.score} />
          </div>
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
          articleId={article.id}
          content={article.content}
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
          <BookmarkButton articleId={article.id} />
        </div>

        <div className="mt-6 rounded-xl border border-border bg-card p-6">
          <h3 className="mb-3 text-center text-base font-bold text-text-primary">
            이 글이 도움이 되었나요?
          </h3>
          <div className="flex justify-center">
            <ArticleFeedback articleId={article.id} />
          </div>
        </div>

        <ArticleHistoryTracker articleId={article.id} title={article.title} category={article.category} />
        <RecommendationSidebar articleId={article.id} />

        <RelatedArticles
          articleId={article.id}
          tags={article.tags}
        />

        <ArticleNav prev={prevArticle} next={nextArticle} />

        <AuthorBio />
      </article>
    );
  } catch {
    notFound();
  }
}
