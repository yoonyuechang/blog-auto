"use client";

interface CategoryTabsProps {
  categories: string[];
  activeCategory: string;
  onSelect: (category: string) => void;
}

export default function CategoryTabs({ categories, activeCategory, onSelect }: CategoryTabsProps) {
  return (
    <div className="mx-auto flex max-w-6xl gap-0 overflow-x-auto border-b border-border px-4 scrollbar-hide">
      {["전체", ...categories].map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`relative whitespace-nowrap px-5 py-3 text-sm transition-colors ${
            activeCategory === cat
              ? "font-medium text-text-primary"
              : "text-text-muted hover:text-text-secondary"
          }`}
        >
          {cat}
          {activeCategory === cat && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-emerald-400" />
          )}
        </button>
      ))}
    </div>
  );
}
