'use client';

import { useEffect, useState } from 'react';

interface Metrics {
  fcp?: number;
  lcp?: number;
  load?: number;
  ttfb?: number;
}

export default function PerformanceOverlay() {
  const [visible, setVisible] = useState(false);
  const [metrics, setMetrics] = useState<Metrics>({});

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('debug') !== '1') return;
    setVisible(true);

    const check = () => {
      const m = window.__PERF_METRICS__;
      if (m) {
        setMetrics({
          fcp: m.FCP,
          lcp: m.LCP,
          load: m.load,
          ttfb: m.TTFB,
        });
      }
    };

    check();
    const id = setInterval(check, 500);
    return () => clearInterval(id);
  }, []);

  if (!visible) return null;

  const fmt = (v?: number) => (v != null ? `${v}ms` : '...');

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        background: 'rgba(0,0,0,0.85)',
        color: '#34D399',
        padding: '10px 14px',
        borderRadius: 8,
        fontSize: 12,
        fontFamily: 'monospace',
        zIndex: 99999,
        lineHeight: 1.6,
        minWidth: 160,
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: 4 }}>Performance</div>
      <div>TTFB: {fmt(metrics.ttfb)}</div>
      <div>FCP: {fmt(metrics.fcp)}</div>
      <div>LCP: {fmt(metrics.lcp)}</div>
      <div>Load: {fmt(metrics.load)}</div>
    </div>
  );
}
