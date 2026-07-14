export async function measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
  const start = performance.now();
  try {
    return await fn();
  } finally {
    logMetric(name, performance.now() - start);
  }
}

export function logMetric(name: string, value: number) {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Perf] ${name}: ${value.toFixed(2)}ms`);
  }
}

export function getLoadTime(): number | null {
  const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  if (!nav) return null;
  return nav.loadEventEnd - nav.startTime;
}
