interface WindowEntry {
  timestamps: number[];
}

const store = new Map<string, WindowEntry>();

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetMs: number;
}

// ponytail: sliding window is simple enough for a blog — no Redis needed
export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): RateLimitResult {
  const now = Date.now();
  const cutoff = now - windowMs;

  let entry = store.get(key);
  if (!entry) {
    entry = { timestamps: [] };
    store.set(key, entry);
  }

  // drop expired timestamps
    entry.timestamps = entry.timestamps.filter((t: number) => t > cutoff);

  const remaining = limit - entry.timestamps.length;
  if (remaining <= 0) {
    const oldest = entry.timestamps[0] ?? now;
    return { allowed: false, remaining: 0, resetMs: oldest + windowMs - now };
  }

  entry.timestamps.push(now);
  return { allowed: true, remaining: remaining - 1, resetMs: windowMs };
}

// sweep old entries periodically
setInterval(() => {
  const cutoff = Date.now() - 10 * 60 * 1000; // 10 min
  store.forEach((v, k) => {
    v.timestamps = v.timestamps.filter((t: number) => t > cutoff);
    if (!v.timestamps.length) store.delete(k);
  });
}, 5 * 60 * 1000);

// ponytail: rate limit helpers per endpoint
export const RATE_LIMITS = {
  articles: { limit: 100, windowMs: 60_000 },
  search: { limit: 60, windowMs: 60_000 },
  stats: { limit: 30, windowMs: 60_000 },
  recommendations: { limit: 100, windowMs: 60_000 },
} as const;
