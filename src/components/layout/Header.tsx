"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Search, Menu, X, ChevronDown, Zap } from "lucide-react";

const CATEGORIES = [
  { href: "/category/ai", label: "인공지능" },
  { href: "/category/web", label: "웹개발" },
  { href: "/category/opensource", label: "오픈소스" },
  { href: "/category/research", label: "논문/리서치" },
  { href: "/category/career", label: "커리어" },
  { href: "/category/other", label: "기타" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-bg/70 backdrop-blur-xl supports-[backdrop-filter]:bg-bg/50" style={{ paddingTop: "env(safe-area-inset-top)" }}>
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1.5 text-lg font-bold tracking-tight text-text-primary">
          <Zap size={18} className="text-emerald-400" />
          Dev
          <span className="text-emerald-400">Pulse</span>
          <span className="ml-1 inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse-dot" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          <Link
            href="/"
            className="rounded-md px-3 py-1.5 text-sm text-text-muted transition-colors hover:bg-card hover:text-text-primary"
          >
            홈
          </Link>

          {/* Category dropdown */}
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              aria-expanded={dropdownOpen}
              aria-haspopup="true"
              className="flex items-center gap-1 rounded-md px-3 py-1.5 text-sm text-text-muted transition-colors hover:bg-card hover:text-text-primary"
            >
              카테고리
              <ChevronDown size={14} className={`transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
            </button>
            {dropdownOpen && (
              <div className="absolute left-0 top-full mt-1 w-44 overflow-hidden rounded-xl border border-border bg-card shadow-2xl shadow-black/40">
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat.href}
                    href={cat.href}
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2.5 text-sm text-text-secondary transition-colors hover:bg-border/50 hover:text-text-primary"
                  >
                    {cat.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/subscribe"
            className="rounded-md px-3 py-1.5 text-sm text-text-muted transition-colors hover:bg-card hover:text-text-primary"
          >
            구독
          </Link>
        </nav>

        {/* Search + mobile toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true }))}
            aria-label="검색 열기 (Ctrl+K)"
            className="hidden items-center gap-2 rounded-lg border border-border bg-card/50 px-3 py-1.5 text-sm text-text-muted transition-colors hover:border-border hover:text-text-secondary md:flex"
          >
            <span className="relative">
              <Search size={14} />
              <span className="absolute -right-0.5 -top-0.5 h-[3px] w-[3px] rounded-full bg-emerald-400 animate-pulse" />
            </span>
            <span>검색</span>
            <kbd className="ml-1 rounded border border-border bg-bg px-1.5 py-0.5 font-mono text-[10px] text-text-muted">⌘K</kbd>
          </button>

          <button
            className="rounded-md p-2 text-text-muted transition-colors hover:text-text-primary md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "메뉴 닫기" : "메뉴 열기"}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile slide-in menu */}
      <div className={`fixed inset-0 top-14 z-50 md:hidden transition-opacity duration-200 ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <nav className={`relative ml-auto h-full w-72 border-l border-border bg-bg/95 backdrop-blur-xl transition-transform duration-200 ease-out ${mobileOpen ? "translate-x-0" : "translate-x-full"}`}>
            <div className="flex flex-col p-4">
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-4 py-3 text-sm font-medium text-text-primary hover:bg-card"
              >
                홈
              </Link>

              <div className="mt-2">
                <p className="px-4 pb-1 pt-2 text-xs font-semibold uppercase tracking-wider text-text-muted">
                  카테고리
                </p>
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat.href}
                    href={cat.href}
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-lg px-4 py-2.5 text-sm text-text-secondary hover:bg-card hover:text-text-primary"
                  >
                    {cat.label}
                  </Link>
                ))}
              </div>

              <div className="mt-4 border-t border-border pt-4">
                <Link
                  href="/subscribe"
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-lg px-4 py-3 text-sm font-medium text-text-primary hover:bg-card"
                >
                  구독
                </Link>
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true }));
                  }}
                  aria-label="검색 열기 (Ctrl+K)"
                  className="flex w-full items-center gap-2 rounded-lg px-4 py-3 text-sm text-text-secondary hover:bg-card hover:text-text-primary"
                >
                  <Search size={16} />
                  검색
                  <kbd className="ml-auto rounded border border-border bg-bg px-1.5 py-0.5 font-mono text-[10px] text-text-muted">⌘K</kbd>
                </button>
              </div>
            </div>
          </nav>
      </div>
    </header>
  );
}
