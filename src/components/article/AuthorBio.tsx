import { Github, Twitter } from "lucide-react";
import Avatar from "@/components/shared/Avatar";

export default function AuthorBio() {
  return (
    <div className="mt-10 rounded-xl border border-border bg-card p-6">
      <div className="flex items-start gap-4">
        <Avatar name="DevPulse 팀" size="lg" />

        <div className="flex-1">
          <h3 className="text-base font-bold text-text-primary">DevPulse 팀</h3>
          <p className="mt-1 text-sm text-text-secondary">
            AI가 요약하고 개발자가 검증하는 IT 트렌드 블로그
          </p>

          <div className="mt-3 flex items-center gap-3">
            <a
              href="/subscribe"
              className="rounded-lg bg-emerald-950 px-3 py-1.5 text-xs font-medium text-emerald-400 transition-colors hover:bg-emerald-900"
            >
              구독하기
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="text-text-muted transition-colors hover:text-text-primary"
            >
              <Github size={16} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="text-text-muted transition-colors hover:text-text-primary"
            >
              <Twitter size={16} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
