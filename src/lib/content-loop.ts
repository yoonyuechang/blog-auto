export function evaluateQuality(article: { aiSummary: string; keyPoints: string; content: string }) {
  return {
    summaryLength: article.aiSummary.length,
    keywordRelevance: JSON.parse(article.keyPoints || '[]').filter((k: string) =>
      article.content.toLowerCase().includes(k.toLowerCase())
    ).length / Math.max(JSON.parse(article.keyPoints || '[]').length, 1),
    readTimeEstimate: Math.ceil(article.content.split(/\s+/).length / 350),
  };
}
