const SITE_URL = "https://blog-auto-woad.vercel.app";

export function generateArticleSchema(article: any) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.aiSummary,
    author: { "@type": "Organization", name: "DevPulse" },
    datePublished: article.publishedAt?.toISOString?.() || article.publishedAt,
    dateModified: article.updatedAt?.toISOString?.() || article.updatedAt,
    publisher: { "@type": "Organization", name: "DevPulse" },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/article/${article.id}`,
    },
  };
}

export function generateBreadcrumbSchema(
  article: { id: number; title: string; category: string },
  categorySlug?: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "홈", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: article.category,
        item: `${SITE_URL}/category/${categorySlug || article.category}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: article.title,
        item: `${SITE_URL}/article/${article.id}`,
      },
    ],
  };
}

export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  if (!faqs.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function extractMetaDescription(aiSummary: string, maxLength = 160) {
  if (!aiSummary) return "";
  const cleaned = aiSummary.replace(/[#*_`]/g, "").trim();
  if (cleaned.length <= maxLength) return cleaned;
  return cleaned.slice(0, maxLength - 1).trimEnd() + "…";
}

export function extractHeadingsFromMarkdown(content: string) {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const headings: { level: number; text: string; id: string }[] = [];
  let match;
  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].replace(/[*_`]/g, "");
    const id = text
      .toLowerCase()
      .replace(/[^\w\s가-힣-]/g, "")
      .replace(/\s+/g, "-");
    headings.push({ level, text, id });
  }
  return headings;
}

export function extractFAQsFromContent(content: string) {
  const faqSection = content.match(/(?:FAQ|자주 묻는 질문|Q&A)[\s\S]*?(?=\n#|\n---|\Z)/i);
  if (!faqSection) return [];
  const qaPairs: { question: string; answer: string }[] = [];
  const qaRegex = /(?:Q|Q\.|질문)[:\s]*(.+?)[\n\r]+(?:A|A\.|답변)[:\s]*(.+?)(?=(?:Q|Q\.|질문)[:\s]|\n#|\Z)/gi;
  let qaMatch;
  while ((qaMatch = qaRegex.exec(faqSection[0])) !== null) {
    qaPairs.push({ question: qaMatch[1].trim(), answer: qaMatch[2].trim() });
  }
  return qaPairs;
}
