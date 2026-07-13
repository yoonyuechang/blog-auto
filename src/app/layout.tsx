import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SearchModal from "@/components/search/SearchModal";
import BackToTop from "@/components/shared/BackToTop";

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
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5685733067450849"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className="bg-bg text-text-primary antialiased">
        <SearchModal />
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <BackToTop />
      </body>
    </html>
  );
}
