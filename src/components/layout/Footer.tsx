export default function Footer() {
  return (
    <footer className="border-t border-border bg-[#080C14]">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
          {/* Brand */}
          <div>
            <p className="text-sm font-bold text-text-primary">
              Dev<span className="text-emerald-400">Pulse</span>
            </p>
            <p className="mt-2 text-xs leading-relaxed text-text-muted">
              AI가 요약하는 IT 트렌드 블로그
            </p>
            <p className="mt-3 text-[10px] text-text-muted">&copy; 2026 DevPulse. All rights reserved.</p>
          </div>

          {/* Categories */}
          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-secondary">카테고리</h4>
            <ul className="space-y-2 text-xs text-text-muted">
              <li><a href="/category/ai" className="transition-colors hover:text-emerald-400">인공지능</a></li>
              <li><a href="/category/web" className="transition-colors hover:text-emerald-400">웹개발</a></li>
              <li><a href="/category/opensource" className="transition-colors hover:text-emerald-400">오픈소스</a></li>
              <li><a href="/category/research" className="transition-colors hover:text-emerald-400">논문/리서치</a></li>
              <li><a href="/category/career" className="transition-colors hover:text-emerald-400">커리어</a></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-secondary">바로가기</h4>
            <ul className="space-y-2 text-xs text-text-muted">
              <li><a href="/" className="transition-colors hover:text-emerald-400">홈</a></li>
              <li><a href="/subscribe" className="transition-colors hover:text-emerald-400">구독</a></li>
              <li><a href="/admin" className="transition-colors hover:text-emerald-400">관리자</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
