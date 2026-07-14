"use client";

import { useState } from "react";

export default function OGPreview() {
  const [title, setTitle] = useState("Next.js 15 Released with React 19 Support");
  const [category, setCategory] = useState("ai");

  const ogUrl = `/api/og?title=${encodeURIComponent(title)}&category=${encodeURIComponent(category)}`;

  const copyUrl = () => {
    navigator.clipboard.writeText(window.location.origin + ogUrl);
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h2 className="mb-4 text-lg font-bold text-text-primary">OG Image Preview</h2>

      <div className="mb-4 space-y-3">
        <div>
          <label className="mb-1 block text-sm text-text-muted">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-text-primary focus:border-emerald-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-text-muted">Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-text-primary focus:border-emerald-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="mb-4 overflow-hidden rounded-lg border border-border">
        <img src={ogUrl} alt="OG Preview" className="w-full" />
      </div>

      <div className="flex gap-2">
        <a
          href={ogUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
        >
          Open in New Tab
        </a>
        <button
          onClick={copyUrl}
          className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-text-primary hover:bg-bg"
        >
          Copy URL
        </button>
      </div>
    </div>
  );
}
