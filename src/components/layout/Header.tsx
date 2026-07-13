"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/", label: "홈" },
  { href: "/category/ai", label: "인공지능" },
  { href: "/category/web", label: "웹개발" },
  { href: "/category/opensource", label: "오픈소스" },
  { href: "/admin", label: "관리자" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <a href="/" className="text-lg font-bold tracking-tight text-text-primary">
          Dev<span className="text-emerald-400">Pulse</span>
        </a>
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-1.5 text-sm text-text-muted transition-colors hover:bg-card hover:text-text-primary"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <button
          className="rounded-md p-2 text-text-muted hover:text-text-primary md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {mobileMenuOpen && (
        <nav className="border-t border-border bg-bg px-4 py-3 md:hidden">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="block rounded-md px-3 py-2 text-sm text-text-muted hover:bg-card hover:text-text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
