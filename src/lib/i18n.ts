export type Lang = 'ko' | 'en'

export const ko = {
  siteName: 'DevPulse',
  tagline: 'AI가 큐레이션하는 실시간 IT 트렌드',
  hero: {
    title: '최신 IT 트렌드를',
    highlight: '실시간으로',
    subtitle: 'AI가 큐레이션하는 기술 뉴스, 튜토리얼, 인사이트',
    badge: '매일 자동 수집 · AI 요약',
    mainTitle: '매일 AI가 요약하는\nIT 트렌드',
    description: '주니어 개발자를 위한 기술 펄스 — 하루 5분, 오늘의 기술 트렌드를 한눈에',
    totalPosts: '개 글',
    categories: '개 카테고리',
    todayCollected: '개 오늘 수집',
    subscribers: '개발자가 구독하고 있습니다',
    delivered: '매주 화요일 배포',
    aiCurated: 'AI 큐레이션',
    free: '무료',
  },
  nav: {
    home: '홈',
    categories: '카테고리',
    subscribe: '뉴스레터',
    search: '검색',
    admin: '관리자',
    tags: '태그',
    about: '소개',
    docs: '문서',
    newsletter: '구독',
  },
  article: {
    readMore: '더 읽기',
    readTime: '분',
    views: '조회',
    share: '공유하기',
    bookmark: '북마크',
    bookmarked: '북마크됨',
    related: '관련 아티클',
    prevArticle: '이전 아티클',
    nextArticle: '다음 아티클',
    backToList: '목록으로',
  },
  newsletter: {
    title: 'DevPulse 뉴스레터',
    subtitle: '매주 화요일, AI가 선별한 IT 트렌드를 받아보세요',
    placeholder: '이메일을 입력하세요',
    submit: '구독하기',
    success: '구독 감사합니다!',
    emailLabel: '이메일 주소',
    subscribing: '구독 중...',
    subscribed: '구독 완료!',
  },
  categories: {
    ai: 'AI/ML',
    devtools: '개발 도구',
    web: '웹 개발',
    cloud: '클라우드',
    security: '보안',
    career: '커리어',
    aiFull: '인공지능',
    webFull: '웹개발',
    opensource: '오픈소스',
    research: '논문/리서치',
    other: '기타',
  },
  footer: {
    about: 'DevPulse 소개',
    contact: '문의하기',
    privacy: '개인정보처리방침',
    terms: '이용약관',
    tagline: 'AI가 요약하는 IT 트렌드 블로그',
    quickLinks: '바로가기',
    admin: '관리자',
  },
  common: {
    korean: '한국어',
    english: 'English',
  },
} as const

export const en: Record<keyof typeof ko, string | Record<string, string>> = {
  siteName: 'DevPulse',
  tagline: 'Real-time IT trends curated by AI',
  hero: {
    title: 'Latest IT Trends',
    highlight: 'In Real-time',
    subtitle: 'AI-curated tech news, tutorials, and insights',
    badge: 'Auto-collected daily · AI summarized',
    mainTitle: 'AI-summarized\nIT Trends Daily',
    description: 'Tech pulse for junior developers — 5 min a day, today\'s tech trends at a glance',
    totalPosts: ' posts',
    categories: ' categories',
    todayCollected: ' collected today',
    subscribers: 'developers are subscribed',
    delivered: 'Delivered every Tuesday',
    aiCurated: 'AI Curated',
    free: 'Free',
  },
  nav: {
    home: 'Home',
    categories: 'Categories',
    subscribe: 'Newsletter',
    search: 'Search',
    admin: 'Admin',
    tags: 'Tags',
    about: 'About',
    docs: 'Docs',
    newsletter: 'Subscribe',
  },
  article: {
    readMore: 'Read More',
    readTime: 'min',
    views: 'views',
    share: 'Share',
    bookmark: 'Bookmark',
    bookmarked: 'Bookmarked',
    related: 'Related Articles',
    prevArticle: 'Previous Article',
    nextArticle: 'Next Article',
    backToList: 'Back to List',
  },
  newsletter: {
    title: 'DevPulse Newsletter',
    subtitle: 'Get AI-curated IT trends every Tuesday',
    placeholder: 'Enter your email',
    submit: 'Subscribe',
    success: 'Thank you for subscribing!',
    emailLabel: 'Email address',
    subscribing: 'Subscribing...',
    subscribed: 'Subscribed!',
  },
  categories: {
    ai: 'AI/ML',
    devtools: 'Dev Tools',
    web: 'Web Dev',
    cloud: 'Cloud',
    security: 'Security',
    career: 'Career',
    aiFull: 'Artificial Intelligence',
    webFull: 'Web Development',
    opensource: 'Open Source',
    research: 'Research',
    other: 'Other',
  },
  footer: {
    about: 'About DevPulse',
    contact: 'Contact',
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
    tagline: 'AI-curated IT trends blog',
    quickLinks: 'Quick Links',
    admin: 'Admin',
  },
  common: {
    korean: '한국어',
    english: 'English',
  },
} as const

const translations = { ko, en } as const

export function t(key: string, lang: Lang = 'ko'): string {
  const keys = key.split('.')
  let result: any = translations[lang]
  
  for (const k of keys) {
    if (result && typeof result === 'object' && k in result) {
      result = result[k]
    } else {
      // Fallback to ko if key not found
      let fallback: any = translations.ko
      for (const fk of keys) {
        if (fallback && typeof fallback === 'object' && fk in fallback) {
          fallback = fallback[fk]
        } else {
          return key
        }
      }
      return typeof fallback === 'string' ? fallback : key
    }
  }
  
  return typeof result === 'string' ? result : key
}