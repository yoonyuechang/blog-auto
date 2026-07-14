type ErrorLevel = "info" | "warn" | "error" | "critical";

interface LogEntry {
  level: ErrorLevel;
  message: string;
  context?: Record<string, unknown>;
  stack?: string;
  timestamp: string;
}

const recentErrors: LogEntry[] = [];
const MAX_RECENT = 20;

function log(entry: LogEntry) {
  recentErrors.push(entry);
  if (recentErrors.length > MAX_RECENT) recentErrors.shift();

  const payload = {
    ...entry,
    // ponytail: structured JSON for future log-service integration
    _source: "devpulse",
  };

  if (entry.level === "critical" || entry.level === "error") {
    console.error(JSON.stringify(payload));
  } else if (entry.level === "warn") {
    console.warn(JSON.stringify(payload));
  } else {
    console.info(JSON.stringify(payload));
  }
}

export function trackError(error: unknown, context?: Record<string, unknown>) {
  const err = error instanceof Error ? error : new Error(String(error));
  log({
    level: "error",
    message: err.message,
    context,
    stack: err.stack,
    timestamp: new Date().toISOString(),
  });
}

export function trackInfo(message: string, context?: Record<string, unknown>) {
  log({ level: "info", message, context, timestamp: new Date().toISOString() });
}

export function trackWarning(message: string, context?: Record<string, unknown>) {
  log({ level: "warn", message, context, timestamp: new Date().toISOString() });
}

export function trackCritical(message: string, context?: Record<string, unknown>) {
  log({ level: "critical", message, context, timestamp: new Date().toISOString() });
}

export function getRecentErrors(count = 5): LogEntry[] {
  return recentErrors.slice(-count);
}

export type { ErrorLevel, LogEntry };
