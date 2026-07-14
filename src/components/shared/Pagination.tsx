"use client";

import { useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function getPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "...")[] = [1];
  if (current > 3) pages.push("...");
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);
  if (current < total - 2) pages.push("...");
  pages.push(total);
  return pages;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "ArrowLeft" && currentPage > 1) onPageChange(currentPage - 1);
    if (e.key === "ArrowRight" && currentPage < totalPages) onPageChange(currentPage + 1);
  }, [currentPage, totalPages, onPageChange]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (totalPages <= 1) return null;

  return (
    <nav className="mt-8 flex items-center justify-center gap-1" aria-label="페이지네이션">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-text-muted transition-colors hover:text-text-primary disabled:opacity-30 disabled:pointer-events-none"
      >
        <ChevronLeft size={16} />이전
      </button>
      {getPageNumbers(currentPage, totalPages).map((p, i) =>
        p === "..." ? (
          <span key={`e${i}`} className="px-2 py-2 text-sm text-text-muted">...</span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`min-w-[36px] rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              p === currentPage
                ? "bg-emerald-500 text-white"
                : "text-text-muted hover:text-text-primary hover:bg-card"
            }`}
          >
            {p}
          </button>
        )
      )}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-text-muted transition-colors hover:text-text-primary disabled:opacity-30 disabled:pointer-events-none"
      >
        다음<ChevronRight size={16} />
      </button>
    </nav>
  );
}
