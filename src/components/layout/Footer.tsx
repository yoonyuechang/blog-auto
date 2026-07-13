export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div>
            <p className="text-sm font-semibold text-text-primary">
              Dev<span className="text-emerald-400">Pulse</span>
            </p>
            <p className="mt-1 text-xs text-text-muted">
              주니어 개발자를 위한 AI 기반 IT 트렌드 블로그
            </p>
          </div>
          <div className="flex gap-4 text-xs text-text-muted">
            <a href="/subscribe" className="hover:text-emerald-400">뉴스레터</a>
            <a href="/admin" className="hover:text-emerald-400">관리자</a>
          </div>
        </div>
        <p className="mt-6 text-center text-xs text-text-muted">
          &copy; {new Date().getFullYear()} DevPulse. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
