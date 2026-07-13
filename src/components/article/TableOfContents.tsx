"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, List } from "lucide-react";

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

  useEffect(() => {
    if (!headings.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 }
    );

    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setIsOpen(false);
    }
  };

  if (!headings.length) return null;

  return (
    <div className="mb-8 rounded-lg border border-border bg-card p-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between text-sm font-semibold text-text-primary"
      >
        <span className="flex items-center gap-2">
          <List size={16} className="text-emerald-400" />
          목차
        </span>
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {/* mobile: collapsible */}
      <ul className={`mt-3 space-y-1 md:hidden ${isOpen ? "block" : "hidden"}`}>
        {headings.map((h) => (
          <li key={h.id}>
            <button
              onClick={() => scrollTo(h.id)}
              className={`block w-full truncate rounded px-2 py-1 text-left text-sm transition-colors ${
                h.level === 3 ? "pl-5" : ""
              } ${
                activeId === h.id
                  ? "bg-emerald-950 text-emerald-400"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {h.text}
            </button>
          </li>
        ))}
      </ul>

      {/* desktop: always visible, sticky */}
      <ul className="mt-3 hidden space-y-1 md:block">
        {headings.map((h) => (
          <li key={h.id}>
            <button
              onClick={() => scrollTo(h.id)}
              className={`block w-full truncate rounded px-2 py-1 text-left text-sm transition-colors ${
                h.level === 3 ? "pl-5" : ""
              } ${
                activeId === h.id
                  ? "bg-emerald-950 text-emerald-400"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {h.text}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
