"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronDown, ChevronUp, List, X } from "lucide-react";

interface Heading {
  level: number;
  text: string;
  id: string;
}

interface TableOfContentsProps {
  headings: Heading[];
}

export default function TableOfContents({ headings }: TableOfContentsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeId, setActiveId] = useState("");
  const [readPercent, setReadPercent] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setMobileOpen(false);
    }
  }, []);

  useEffect(() => {
    if (!headings.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-100px 0px -70% 0px", threshold: 0 }
    );

    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  useEffect(() => {
    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      setReadPercent(docHeight > 0 ? Math.min(100, Math.round((scrolled / docHeight) * 100)) : 0);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!headings.length) return null;

  const headingList = headings.map((h) => (
    <li key={h.id}>
      <button
        onClick={() => scrollTo(h.id)}
        className={`block w-full truncate rounded px-2 py-1.5 text-left text-sm transition-all duration-200 ${
          h.level === 3 ? "pl-5" : ""
        } ${
          activeId === h.id
            ? "border-l-2 border-emerald-400 bg-emerald-950/50 pl-3 text-emerald-400 font-medium"
            : "border-l-2 border-transparent text-text-secondary hover:text-text-primary hover:border-border"
        }`}
      >
        {h.text}
      </button>
    </li>
  ));

  return (
    <>
      {/* Desktop: sticky sidebar */}
      <div className="hidden md:block sticky top-24 mb-8 max-h-[calc(100vh-8rem)] overflow-y-auto rounded-lg border border-border bg-card p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="flex items-center gap-2 text-sm font-semibold text-text-primary">
            <List size={16} className="text-emerald-400" />
            목차
          </span>
          <span className="text-xs text-text-muted">{readPercent}%</span>
        </div>

        <div className="mb-3 h-1 overflow-hidden rounded-full bg-border">
          <div
            className="h-full rounded-full bg-emerald-400 transition-all duration-300"
            style={{ width: `${readPercent}%` }}
          />
        </div>

        <ul className="space-y-1">{headingList}</ul>
      </div>

      {/* Mobile: floating button + overlay */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed bottom-24 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg md:hidden"
        aria-label="목차 열기"
      >
        {mobileOpen ? <X size={20} /> : <List size={20} />}
      </button>

      {mobileOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={() => setMobileOpen(false)}>
          <div
            className="absolute bottom-0 left-0 right-0 max-h-[70vh] overflow-y-auto rounded-t-2xl border-t border-border bg-card p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm font-semibold text-text-primary">
                <List size={16} className="text-emerald-400" />
                목차
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-text-muted">{readPercent}%</span>
                <button onClick={() => setMobileOpen(false)} className="text-text-muted hover:text-text-primary">
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="mb-3 h-1 overflow-hidden rounded-full bg-border">
              <div
                className="h-full rounded-full bg-emerald-400 transition-all duration-300"
                style={{ width: `${readPercent}%` }}
              />
            </div>

            <ul className="space-y-1">{headingList}</ul>
          </div>
        </div>
      )}
    </>
  );
}
