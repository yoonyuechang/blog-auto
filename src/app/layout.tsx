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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className="dark">
      <head>
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
