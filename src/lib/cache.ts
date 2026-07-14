interface CacheEntry<T> {
  value: T;
  expires: number;
}

const store = new Map<string, CacheEntry<unknown>>();
let stats = { hits: 0, misses: 0 };

// ponytail: Map-based, no eviction pressure for a blog's working set
export const cache = {
  get<T>(key: string): T | null {
    const entry = store.get(key);
    if (!entry) { stats.misses++; return null; }
    if (Date.now() > entry.expires) {
      store.delete(key);
      stats.misses++;
      return null;
    }
    stats.hits++;
    return entry.value as T;
  },

  set<T>(key: string, value: T, ttlMs: number): void {
    store.set(key, { value, expires: Date.now() + ttlMs });
  },

  has(key: string): boolean {
    return this.get(key) !== null;
  },

  clear(): void {
    store.clear();
    stats = { hits: 0, misses: 0 };
  },

  get size() { return store.size; },

  getStats() {
    const total = stats.hits + stats.misses;
    return {
      hits: stats.hits,
      misses: stats.misses,
      hitRate: total ? Math.round((stats.hits / total) * 100) : 0,
      size: store.size,
    };
  },

  // ponytail: periodic sweep keeps memory bounded
  sweep() {
    const now = Date.now();
    store.forEach((v, k) => {
      if (now > v.expires) store.delete(k);
    });
  },
};

const SWEEP_INTERVAL = 5 * 60 * 1000;
if (typeof setInterval !== "undefined") {
  setInterval(() => cache.sweep(), SWEEP_INTERVAL);
}
