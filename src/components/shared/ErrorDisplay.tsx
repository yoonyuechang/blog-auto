"use client";

import { useState } from "react";
import { AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";

interface ErrorDisplayProps {
  error: Error | string;
  onRetry?: () => void;
  showDetails?: boolean;
}

export default function ErrorDisplay({ error, onRetry, showDetails = true }: ErrorDisplayProps) {
  const [open, setOpen] = useState(false);
  const message = typeof error === "string" ? error : error.message;
  const stack = typeof error === "object" ? error.stack : undefined;

  return (
    <div className="my-8 rounded-xl border border-red-400/20 bg-red-950/20 p-6 text-center">
      <AlertTriangle className="mx-auto mb-3 h-8 w-8 text-red-400" />
      <p className="text-sm text-text-primary">{message || "오류가 발생했습니다."}</p>

      {showDetails && stack && (
        <div className="mt-3">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-1 mx-auto text-xs text-text-muted hover:text-text-secondary"
          >
            상세 정보
            {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          {open && (
            <pre className="mt-2 max-h-40 overflow-auto rounded-lg bg-surface p-3 text-left text-xs text-red-300">
              {stack}
            </pre>
          )}
        </div>
      )}

      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 rounded-lg bg-emerald-500 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-600"
        >
          다시 시도
        </button>
      )}
    </div>
  );
}
