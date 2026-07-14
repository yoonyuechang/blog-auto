"use client";

interface MasonryGridProps {
  children: React.ReactNode;
  columns?: number;
  gap?: number;
}

export default function MasonryGrid({ children, columns = 3, gap = 16 }: MasonryGridProps) {
  const items = Array.isArray(children) ? children : [children];

  return (
    <div style={{ columnCount: 1, columnGap: gap }}>
      <style>{`
        @media (min-width: 640px) { .masonry-grid { column-count: 2 !important; } }
        @media (min-width: 1024px) { .masonry-grid { column-count: ${columns} !important; } }
        .masonry-grid > * { break-inside: avoid; margin-bottom: ${gap}px; }
      `}</style>
      <div className="masonry-grid" style={{ columnCount: 1, columnGap: gap }}>
        {items.map((child, i) => (
          <div key={i}>{child}</div>
        ))}
      </div>
    </div>
  );
}
