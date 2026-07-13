export function generateArticleSchema(article: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.aiSummary,
    author: { '@type': 'Organization', name: 'DevPulse' },
    datePublished: article.publishedAt?.toISOString?.() || article.publishedAt,
  };
}
