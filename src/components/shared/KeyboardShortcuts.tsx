"use client";

import { useState, useEffect, useCallback } from "react";
import ShortcutsModal from "./ShortcutsModal";

const CATEGORIES = [
  { path: "/category/ai", label: "인공지능" },
  { path: "/category/web", label: "웹개발" },
  { path: "/category/opensource", label: "오픈소스" },
  { path: "/category/research", label: "논문/리서치" },
  { path: "/category/career", label: "커리어" },
  { path: "/category/other", label: "기타" },
];

function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1500);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="fixed bottom-20 left-1/2 z-[70] -translate-x-1/2 rounded-lg border border-border bg-card px-3 py-2 text-xs text-text-primary shadow-lg animate-fadeIn">
      {message}
    </div>
  );
}

export default function KeyboardShortcuts() {
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => setToast(msg), []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      const isInput = tag === "INPUT" || tag === "TEXTAREA" || (e.target as HTMLElement).isContentEditable;

      // Escape: close modals (always active)
      if (e.key === "Escape") {
        if (shortcutsOpen) { setShortcutsOpen(false); return; }
      }

      if (isInput) return;

      const mod = e.metaKey || e.ctrlKey;

      // ? : shortcuts help
      if (e.key === "?" && !mod) {
        e.preventDefault();
        setShortcutsOpen((o) => !o);
        return;
      }

      // Cmd+K handled by SearchModal — don't interfere

      // Cmd+Up: scroll to top
      if (mod && e.key === "ArrowUp") {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
        showToast("맨 위로 스크롤");
        return;
      }

      // 1-6: category nav (home page)
      const num = parseInt(e.key);
      if (num >= 1 && num <= 6 && !mod && !e.shiftKey) {
        const cat = CATEGORIES[num - 1];
        if (cat && window.location.pathname === "/") {
          e.preventDefault();
          window.location.href = cat.path;
        }
        return;
      }

      // J/K for TOC handled in TableOfContents
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [shortcutsOpen, showToast]);

  return (
    <>
      <ShortcutsModal open={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </>
  );
}
