"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
      <AlertTriangle className="mb-4 h-12 w-12 text-red-400" />
      <h1 className="mb-2 text-xl font-bold text-text-primary">관리자 에러</h1>
      <p className="mb-4 max-w-md text-sm text-text-secondary">
        {error.message || "데이터를 불러오는 중 오류가 발생했습니다."}
      </p>
      {error.digest && (
        <pre className="mb-4 max-w-full overflow-auto rounded-lg bg-surface px-3 py-2 text-left text-xs text-text-muted">
          Digest: {error.digest}
        </pre>
      )}
      <pre className="mb-6 max-w-full overflow-auto rounded-lg bg-surface px-3 py-2 text-left text-xs text-red-300">
        {error.stack}
      </pre>
      <button
        onClick={reset}
        className="rounded-lg bg-emerald-500 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-600"
      >
        다시 시도
      </button>
    </div>
  );
}
