"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function MarketingError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Marketing section error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="mb-3 text-2xl font-bold text-text-primary">
        문제가 발생했습니다
      </h1>
      <p className="mb-4 max-w-md text-text-secondary">
        예기치 않은 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
      </p>
      {error.digest && (
        <p className="mb-6 rounded-lg bg-surface px-3 py-1.5 font-mono text-xs text-text-muted">
          오류 ID: {error.digest}
        </p>
      )}
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="rounded-lg bg-emerald-500 px-6 py-3 font-medium text-white transition-colors hover:bg-emerald-600"
        >
          다시 시도
        </button>
        <Link
          href="/"
          className="rounded-lg border border-border px-6 py-3 font-medium text-text-primary transition-colors hover:border-emerald-400/40"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
