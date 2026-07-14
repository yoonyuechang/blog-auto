"use client";

export interface HistoryItem {
  articleId: number;
  title: string;
  category: string;
  timestamp: number;
}

const STORAGE_KEY = "devpulse_reading_history";
const MAX_ITEMS = 20;

export function getHistory(): HistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addToHistory(item: Omit<HistoryItem, "timestamp">) {
  if (typeof window === "undefined") return;
  try {
    const history = getHistory().filter((h) => h.articleId !== item.articleId);
    history.unshift({ ...item, timestamp: Date.now() });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, MAX_ITEMS)));
  } catch {}
}

export function clearHistory() {
  if (typeof window === "undefined") return;
  try { localStorage.removeItem(STORAGE_KEY); } catch {}
}

export function trackArticleView(articleId: number, title: string, category: string) {
  addToHistory({ articleId, title, category });
}
