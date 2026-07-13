interface FetchResult {
  title: string;
  url: string;
  summary: string;
  source: string;
  publishedAt: Date;
}

export async function fetchHackerNews(): Promise<FetchResult[]> {
  try {
    const res = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json");
    const ids = await res.json();
    const items = await Promise.all(
      ids.slice(0, 20).map(async (id: number) => {
        const itemRes = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
        const item = await itemRes.json();
        return {
          title: item.title || "",
          url: item.url || `https://news.ycombinator.com/item?id=${id}`,
          summary: "",
          source: "HackerNews",
          publishedAt: new Date((item.time || 0) * 1000),
        };
      })
    );
    return items.filter((i) => i.title);
  } catch { return []; }
}

export async function fetchDevto(): Promise<FetchResult[]> {
  try {
    const res = await fetch("https://dev.to/api/articles?top=7&per_page=20");
    const articles = await res.json();
    return articles.map((a: any) => ({
      title: a.title || "",
      url: a.url || "",
      summary: a.description || "",
      source: "Dev.to",
      publishedAt: new Date(a.published_at || Date.now()),
    }));
  } catch { return []; }
}

export async function fetchGitHubTrending(): Promise<FetchResult[]> {
  try {
    const date = new Date(Date.now() - 7 * 86400000).toISOString().split("T")[0];
    const res = await fetch(`https://api.github.com/search/repositories?q=pushed:>${date}&sort=stars&order=desc&per_page=20`);
    const data = await res.json();
    return (data.items || []).map((r: any) => ({
      title: `${r.full_name}: ${r.description || ""}`.slice(0, 100),
      url: r.html_url || "",
      summary: r.description || "",
      source: "GitHub",
      publishedAt: new Date(r.pushed_at || Date.now()),
    }));
  } catch { return []; }
}

export async function fetchArxiv(): Promise<FetchResult[]> {
  try {
    const res = await fetch("http://export.arxiv.org/api/query?search_query=cat:cs.AI&sortBy=lastUpdatedDate&sortOrder=descending&max_results=20");
    const text = await res.text();
    const items: FetchResult[] = [];
    const entries = text.split("<entry>").slice(1);
    for (const entry of entries) {
      const title = entry.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.trim() || "";
      const link = entry.match(/<id>([\s\S]*?)<\/id>/)?.[1]?.trim() || "";
      const summary = entry.match(/<summary>([\s\S]*?)<\/summary>/)?.[1]?.trim() || "";
      const published = entry.match(/<published>([\s\S]*?)<\/published>/)?.[1]?.trim() || "";
      items.push({ title: title.replace(/\n/g, " "), url: link, summary: summary.replace(/\n/g, " ").slice(0, 200), source: "arXiv", publishedAt: new Date(published || Date.now()) });
    }
    return items;
  } catch { return []; }
}
