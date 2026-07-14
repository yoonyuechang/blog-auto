"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { Search, Menu, X, ChevronDown, Zap, Clock, TrendingUp, Tag, Info } from "lucide-react";
import GradientText from "@/components/shared/GradientText";

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
  const [quickOpen, setQuickOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const quickRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      const t = e.target as Node;
      if (dropdownRef.current && !dropdownRef.current.contains(t)) setDropdownOpen(false);
      if (quickRef.current && !quickRef.current.contains(t)) setQuickOpen(false);
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
        {/* Logo + Quick Actions */}
        <div ref={quickRef} className="relative">
          <button
            onClick={() => setQuickOpen(!quickOpen)}
            className="flex items-center gap-1.5 text-lg font-bold tracking-tight text-text-primary"
          >
            <Zap size={18} className="text-emerald-400" />
            <GradientText>DevPulse</GradientText>
            <span className="ml-1 inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse-dot" />
            <ChevronDown size={14} className={`ml-0.5 text-text-muted transition-transform ${quickOpen ? "rotate-180" : ""}`} />
          </button>
          {quickOpen && (
            <div className="absolute left-0 top-full mt-2 w-52 overflow-hidden rounded-xl border border-border bg-card shadow-2xl shadow-black/40">
              <Link href="/?sort=recent" onClick={() => setQuickOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-text-secondary transition-colors hover:bg-border/50 hover:text-text-primary">
                <Clock size={14} className="text-emerald-400" /> 최근 아티클
              </Link>
              <Link href="/?sort=popular" onClick={() => setQuickOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-text-secondary transition-colors hover:bg-border/50 hover:text-text-primary">
                <TrendingUp size={14} className="text-emerald-400" /> 인기 아티클
              </Link>
              <Link href="/tags" onClick={() => setQuickOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-text-secondary transition-colors hover:bg-border/50 hover:text-text-primary">
                <Tag size={14} className="text-emerald-400" /> 태그 목록
              </Link>
              <Link href="/about" onClick={() => setQuickOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-text-secondary transition-colors hover:bg-border/50 hover:text-text-primary">
                <Info size={14} className="text-emerald-400" /> 소개
              </Link>
            </div>
          )}
        </div>

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
            href="/tags"
            className="rounded-md px-3 py-1.5 text-sm text-text-muted transition-colors hover:bg-card hover:text-text-primary"
          >
            태그
          </Link>

          <Link
            href="/about"
            className="rounded-md px-3 py-1.5 text-sm text-text-muted transition-colors hover:bg-card hover:text-text-primary"
          >
            소개
          </Link>

          <Link
            href="/docs"
            className="rounded-md px-3 py-1.5 text-sm text-text-muted transition-colors hover:bg-card hover:text-text-primary"
          >
            문서
          </Link>

          <Link
            href="/subscribe"
            className="rounded-md px-3 py-1.5 text-sm text-text-muted transition-colors hover:bg-card hover:text-text-primary"
          >
            구독
          </Link>
        </nav>

        {/* Search + mobile toggle */}
        <div className="flex items-center gap-2">
          <Link
            href="/search"
            className="hidden items-center gap-2 rounded-lg border border-border bg-card/50 px-3 py-1.5 text-sm text-text-muted transition-colors hover:border-border hover:text-text-secondary md:flex"
          >
            <span className="relative">
              <Search size={14} />
              <span className="absolute -right-0.5 -top-0.5 h-[3px] w-[3px] rounded-full bg-emerald-400 animate-pulse" />
            </span>
            <span>검색</span>
            <kbd className="ml-1 rounded border border-border bg-bg px-1.5 py-0.5 font-mono text-[10px] text-text-muted">⌘K</kbd>
          </Link>

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
                  href="/tags"
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-lg px-4 py-3 text-sm font-medium text-text-primary hover:bg-card"
                >
                  태그
                </Link>
                <Link
                  href="/about"
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-lg px-4 py-3 text-sm font-medium text-text-primary hover:bg-card"
                >
                  소개
                </Link>
                <Link
                  href="/docs"
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-lg px-4 py-3 text-sm font-medium text-text-primary hover:bg-card"
                >
                  문서
                </Link>
                <Link
                  href="/subscribe"
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-lg px-4 py-3 text-sm font-medium text-text-primary hover:bg-card"
                >
                  구독
                </Link>
                <Link
                  href="/search"
                  onClick={() => setMobileOpen(false)}
                  className="flex w-full items-center gap-2 rounded-lg px-4 py-3 text-sm text-text-secondary hover:bg-card hover:text-text-primary"
                >
                  <Search size={16} />
                  검색
                  <kbd className="ml-auto rounded border border-border bg-bg px-1.5 py-0.5 font-mono text-[10px] text-text-muted">⌘K</kbd>
                </Link>
              </div>
            </div>
          </nav>
      </div>
    </header>
  );
}
