import { db } from "@/lib/db";
import { trackError } from "@/lib/error-logger";

interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: string;
}

const recentMetrics: PerformanceMetric[] = [];
const MAX_METRICS = 100;

const ALERT_THRESHOLDS = {
  errorRatePercent: 5,
  responseTimeMs: 2000,
} as const;

export function trackPerformance(name: string, value: number, unit = "ms") {
  const entry: PerformanceMetric = { name, value, unit, timestamp: new Date().toISOString() };
  recentMetrics.push(entry);
  if (recentMetrics.length > MAX_METRICS) recentMetrics.shift();

  if (name.includes("response") && value > ALERT_THRESHOLDS.responseTimeMs) {
    trackError(new Error(`Slow response: ${name} took ${value}${unit}`), { metric: name, value });
  }
}

export function getRecentMetrics(count = 20): PerformanceMetric[] {
  return recentMetrics.slice(-count);
}

export async function getSystemHealth() {
  const mem = process.memoryUsage();
  const start = Date.now();
  let dbConnected = false;
  try {
    await db.$queryRaw`SELECT 1`;
    dbConnected = true;
  } catch {
    trackError(new Error("DB health check failed"));
  }
  const dbLatencyMs = Date.now() - start;

  const heapUsedMB = Math.round(mem.heapUsed / 1024 / 1024);
  const heapTotalMB = Math.round(mem.heapTotal / 1024 / 1024);
  const rssMB = Math.round(mem.rss / 1024 / 1024);

  let status: "ok" | "degraded" | "down" = "ok";
  if (!dbConnected) status = "down";
  else if (heapUsedMB / heapTotalMB > 0.9 || dbLatencyMs > 1000) status = "degraded";

  return {
    status,
    dbConnected,
    dbLatencyMs,
    uptime: Math.round(process.uptime()),
    memory: { heapUsedMB, heapTotalMB, rssMB },
    alertThresholds: ALERT_THRESHOLDS,
  };
}
