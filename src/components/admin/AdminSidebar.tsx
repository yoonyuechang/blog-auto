"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, Globe, Mail, Menu, X, ChevronsLeft, ChevronsRight, TrendingUp, Activity } from "lucide-react";

const navItems = [
  { href: "/admin", label: "대시보드", icon: LayoutDashboard },
  { href: "/admin/articles", label: "아티클", icon: FileText },
  { href: "/admin/sources", label: "소스 관리", icon: Globe },
  { href: "/admin/newsletter", label: "뉴스레터", icon: Mail },
  { href: "/admin/analytics", label: "분석", icon: TrendingUp },
  { href: "/admin/system", label: "시스템", icon: Activity },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [sourceHealth, setSourceHealth] = useState<Record<number, boolean>>({});

  useEffect(() => {
    fetch("/api/admin/sources")
      .then((r) => r.json())
      .then((sources: any[]) => {
        const health: Record<number, boolean> = {};
        sources.forEach((s: any) => { health[s.id] = s.isActive; });
        setSourceHealth(health);
      })
      .catch(() => {});
  }, []);

  const hasUnhealthySource = Object.values(sourceHealth).some((v) => !v);

  const content = (
    <nav className="flex flex-1 flex-col gap-1 p-4">
      {navItems.map(({ href, label, icon: Icon }) => {
        const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              active ? "bg-emerald-500/15 text-emerald-400" : "text-text-muted hover:bg-card hover:text-text-primary"
            }`}
          >
            <Icon size={18} />
            {!collapsed && label}
            {href === "/admin/sources" && hasUnhealthySource && (
              <span className="ml-auto h-2 w-2 rounded-full bg-red-400" />
            )}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card text-text-muted lg:hidden"
      >
        <Menu size={20} />
      </button>

      <aside className={`hidden lg:flex shrink-0 flex-col border-r border-border bg-card transition-all ${collapsed ? "w-16" : "w-60"}`}>
        <div className={`flex h-16 items-center border-b border-border ${collapsed ? "justify-center px-2" : "gap-2 px-5"}`}>
          {!collapsed && <span className="text-lg font-bold text-text-primary">DevPulse</span>}
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`text-text-muted hover:text-text-primary ${collapsed ? "" : "ml-auto"}`}
          >
            {collapsed ? <ChevronsRight size={16} /> : <ChevronsLeft size={16} />}
          </button>
        </div>
        {content}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <aside className="relative flex h-full w-64 flex-col border-r border-border bg-card">
            <div className="flex h-16 items-center justify-between border-b border-border px-5">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-text-primary">DevPulse</span>
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              </div>
              <button onClick={() => setMobileOpen(false)} className="text-text-muted hover:text-text-primary">
                <X size={20} />
              </button>
            </div>
            {content}
          </aside>
        </div>
      )}
    </>
  );
}
