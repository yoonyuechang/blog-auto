"use client"

import Link from "next/link"
import { useLanguage } from "@/lib/language-context"
import { t } from "@/lib/i18n"

export default function Footer() {
  const { lang } = useLanguage()

  return (
    <footer className="border-t border-border bg-bg/80">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
          {/* Brand */}
          <div>
            <p className="text-sm font-bold text-text-primary">
              Dev<span className="text-emerald-400">Pulse</span>
            </p>
            <p className="mt-2 text-xs leading-relaxed text-text-muted">
              {t('footer.tagline', lang)}
            </p>
            <p className="mt-3 text-[10px] text-text-muted">&copy; 2026 DevPulse. All rights reserved.</p>
          </div>

          {/* Categories */}
          <nav aria-label={t('nav.categories', lang)}>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-secondary">{t('nav.categories', lang)}</h4>
            <ul className="space-y-2 text-xs text-text-muted">
              <li><Link href="/category/ai" className="transition-colors hover:text-emerald-400">{t('categories.aiFull', lang)}</Link></li>
              <li><Link href="/category/web" className="transition-colors hover:text-emerald-400">{t('categories.webFull', lang)}</Link></li>
              <li><Link href="/category/opensource" className="transition-colors hover:text-emerald-400">{t('categories.opensource', lang)}</Link></li>
              <li><Link href="/category/research" className="transition-colors hover:text-emerald-400">{t('categories.research', lang)}</Link></li>
              <li><Link href="/category/career" className="transition-colors hover:text-emerald-400">{t('categories.career', lang)}</Link></li>
              <li><Link href="/category/other" className="transition-colors hover:text-emerald-400">{t('categories.other', lang)}</Link></li>
            </ul>
          </nav>

          {/* Quick Links */}
          <nav aria-label={t('footer.quickLinks', lang)}>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-secondary">{t('footer.quickLinks', lang)}</h4>
            <ul className="space-y-2 text-xs text-text-muted">
              <li><Link href="/" className="transition-colors hover:text-emerald-400">{t('nav.home', lang)}</Link></li>
              <li><Link href="/tags" className="transition-colors hover:text-emerald-400">{t('nav.tags', lang)}</Link></li>
              <li><Link href="/about" className="transition-colors hover:text-emerald-400">{t('nav.about', lang)}</Link></li>
              <li><Link href="/docs" className="transition-colors hover:text-emerald-400">{t('nav.docs', lang)}</Link></li>
              <li><Link href="/subscribe" className="transition-colors hover:text-emerald-400">{t('nav.newsletter', lang)}</Link></li>
              <li><Link href="/admin" className="transition-colors hover:text-emerald-400">{t('footer.admin', lang)}</Link></li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  )
}