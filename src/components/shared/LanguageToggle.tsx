'use client'

import { useLanguage } from '@/lib/language-context'

export default function LanguageToggle() {
  const { lang, toggleLanguage } = useLanguage()

  return (
    <button
      onClick={toggleLanguage}
      className="rounded-md px-2 py-1 text-xs font-medium text-text-muted transition-colors hover:bg-card hover:text-text-primary"
      aria-label={lang === 'ko' ? 'Switch to English' : '한국어로 전환'}
    >
      {lang === 'ko' ? 'EN' : 'KO'}
    </button>
  )
}