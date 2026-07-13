import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SearchModal from "@/components/search/SearchModal";
import ScrollToTop from "@/components/shared/ScrollToTop";

export const metadata: Metadata = {
  title: "DevPulse - 주니어 개발자를 위한 IT 트렌드 블로그",
  description: "AI가 요약한 최신 기술 트렌드를 매일 받아보세요",
  metadataBase: new URL("https://blog-auto-woad.vercel.app"),
  openGraph: {
    title: "DevPulse - 주니어 개발자를 위한 IT 트렌드 블로그",
    description: "AI가 요약한 최신 기술 트렌드를 매일 받아보세요",
    url: "https://blog-auto-woad.vercel.app",
    siteName: "DevPulse",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DevPulse",
    description: "AI가 요약한 최신 기술 트렌드를 매일 받아보세요",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  other: {
    "theme-color": "#0B0F19",
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "DevPulse",
  url: "https://blog-auto-woad.vercel.app",
  description: "AI가 요약한 최신 기술 트렌드를 매일 받아보세요",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://blog-auto-woad.vercel.app/?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className="dark">
      <head>
        <meta name="google-site-verification" content="Uo17LU5fp4TfGV18aXCFb9jt-0-CVWaN7DkvgfReCT0" />
        <meta name="naver-site-verification" content="a8afab629695ff0e5a625e2587170bd4bfa49a57" />
        <meta name="msvalidate.01" content="442420906E4784BD021199A6C2E2B329" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5685733067450849"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-XXXXXXXXXX');`}
        </Script>
      </head>
      <body className="bg-bg text-text-primary antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-emerald-500 focus:px-4 focus:py-2 focus:text-sm focus:text-white focus:shadow-lg"
        >
          본문으로 건너뛰기
        </a>
        <SearchModal />
        <Header />
        <main id="main-content" className="min-h-screen">{children}</main>
        <Footer />
        <ScrollToTop />
      </body>
    </html>
  );
}
