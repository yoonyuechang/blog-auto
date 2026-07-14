'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    __PERF_METRICS__?: Record<string, number>;
  }
}

function reportMetric(name: string, value: number) {
  if (!window.__PERF_METRICS__) {
    window.__PERF_METRICS__ = {};
  }
  window.__PERF_METRICS__[name] = value;

  if (process.env.NODE_ENV === 'development') {
    console.log(`[Perf] ${name}: ${value}ms`);
  }

  if (process.env.NODE_ENV === 'production') {
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        page: window.location.pathname,
        metric: name,
        value,
        timestamp: Date.now(),
      }),
    }).catch(() => {});
  }
}

export default function WebVitals() {
  useEffect(() => {
    const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (nav) {
      reportMetric('TTFB', Math.round(nav.responseStart - nav.requestStart));
      reportMetric('load', Math.round(nav.loadEventEnd - nav.startTime));
    }

    const paintEntries = performance.getEntriesByType('paint');
    const fcp = paintEntries.find((e) => e.name === 'first-contentful-paint');
    if (fcp) {
      reportMetric('FCP', Math.round(fcp.startTime));
    }

    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const last = entries[entries.length - 1] as PerformanceEntry;
        reportMetric('LCP', Math.round(last.startTime));
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
    } catch {}
  }, []);

  return null;
}
