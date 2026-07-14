import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SearchModal from "@/components/search/SearchModal";
import ScrollToTop from "@/components/shared/ScrollToTop";
import ScrollProgress from "@/components/shared/ScrollProgress";
import KeyboardShortcuts from "@/components/shared/KeyboardShortcuts";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div lang="ko">
      <ScrollProgress />
      <SearchModal />
      <KeyboardShortcuts />
      <Header />
      <main id="main-content" className="min-h-screen">{children}</main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
