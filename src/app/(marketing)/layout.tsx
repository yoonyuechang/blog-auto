import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SearchModal from "@/components/search/SearchModal";
import ScrollToTop from "@/components/shared/ScrollToTop";
import ScrollProgress from "@/components/shared/ScrollProgress";
import KeyboardShortcuts from "@/components/shared/KeyboardShortcuts";
import { LanguageProvider } from "@/lib/language-context";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <div lang="ko" dir="ltr">
        <ScrollProgress />
        <SearchModal />
        <KeyboardShortcuts />
        <Header />
        <main id="main-content" className="min-h-screen">{children}</main>
        <Footer />
        <ScrollToTop />
      </div>
    </LanguageProvider>
  );
}