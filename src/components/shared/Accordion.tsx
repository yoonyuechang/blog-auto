"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface AccordionItem {
  title: string;
  content: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  defaultOpen?: number[];
}

export default function Accordion({ items, allowMultiple = false, defaultOpen = [] }: AccordionProps) {
  const [openSet, setOpenSet] = useState<Set<number>>(() => new Set(defaultOpen));

  const toggle = useCallback((idx: number) => {
    setOpenSet((prev) => {
      const next = new Set(allowMultiple ? prev : []);
      if (prev.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  }, [allowMultiple]);

  return (
    <div className="divide-y divide-border rounded-xl border border-border">
      {items.map((item, i) => (
        <AccordionRow key={i} item={item} isOpen={openSet.has(i)} onToggle={() => toggle(i)} />
      ))}
    </div>
  );
}

function AccordionRow({ item, isOpen, onToggle }: { item: AccordionItem; isOpen: boolean; onToggle: () => void }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (!contentRef.current) return;
    setHeight(contentRef.current.scrollHeight);
  }, [isOpen, item.content]);

  return (
    <div className="bg-card">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
      >
        <span className={`text-sm font-semibold transition-colors ${isOpen ? "text-emerald-400" : "text-text-primary"}`}>
          {item.title}
        </span>
        <ChevronDown
          size={16}
          className={`shrink-0 text-text-muted transition-transform duration-200 ${isOpen ? "rotate-180 text-emerald-400" : ""}`}
        />
      </button>
      <div
        className="overflow-hidden transition-[height] duration-200 ease-out"
        style={{ height: isOpen ? height : 0 }}
      >
        <div ref={contentRef} className="px-5 pb-4 text-sm text-text-secondary leading-relaxed">
          {item.content}
        </div>
      </div>
    </div>
  );
}
