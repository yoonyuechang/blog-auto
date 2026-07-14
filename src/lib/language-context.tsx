'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Lang } from '@/lib/i18n'

interface LanguageContextType {
  lang: Lang
  toggleLanguage: () => void
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'ko',
  toggleLanguage: () => {},
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('ko')

  useEffect(() => {
    const saved = localStorage.getItem('language') as Lang | null
    if (saved && (saved === 'ko' || saved === 'en')) {
      setLang(saved)
    }
  }, [])

  const toggleLanguage = () => {
    const next = lang === 'ko' ? 'en' : 'ko'
    setLang(next)
    localStorage.setItem('language', next)
  }

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}