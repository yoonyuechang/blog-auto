export function calculateTrendingScore(articles: { id: number; viewCount: number; publishedAt: Date }[]) {
  const now = Date.now();
  const DAY = 86400000;
  return articles.map(a => ({
    articleId: a.id,
    score: Math.max(0, 1 - (now - a.publishedAt.getTime()) / (7 * DAY)) * 0.6
      + (Math.log10(a.viewCount + 1) / 6) * 0.3,
  })).sort((a, b) => b.score - a.score);
}
