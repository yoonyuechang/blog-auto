"use client";

import { useRef, useState, useEffect, useCallback } from "react";

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (id: string) => void;
}

export default function Tabs({ tabs, activeTab, onTabChange }: TabsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const [underline, setUnderline] = useState({ left: 0, width: 0 });

  const updateUnderline = useCallback(() => {
    const el = tabRefs.current.get(activeTab);
    const container = containerRef.current;
    if (!el || !container) return;
    const cr = container.getBoundingClientRect();
    const tr = el.getBoundingClientRect();
    setUnderline({ left: tr.left - cr.left, width: tr.width });
  }, [activeTab]);

  useEffect(() => {
    updateUnderline();
  }, [updateUnderline]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const idx = tabs.findIndex((t) => t.id === activeTab);
    if (e.key === "ArrowRight") {
      e.preventDefault();
      onTabChange(tabs[(idx + 1) % tabs.length].id);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      onTabChange(tabs[(idx - 1 + tabs.length) % tabs.length].id);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative flex gap-1 border-b border-border"
      role="tablist"
      onKeyDown={handleKeyDown}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          ref={(el) => { if (el) tabRefs.current.set(tab.id, el); }}
          role="tab"
          aria-selected={activeTab === tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`relative flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-colors ${
            activeTab === tab.id ? "text-text-primary" : "text-text-muted hover:text-text-secondary"
          }`}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
      <span
        className="absolute bottom-0 h-0.5 rounded-full bg-emerald-400 transition-all duration-200 ease-out"
        style={{ left: underline.left, width: underline.width }}
      />
    </div>
  );
}
