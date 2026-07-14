"use client";

import { useState } from "react";
import { Twitter, Link2, MessageCircle, Check, Linkedin, Mail } from "lucide-react";

interface ShareButtonsProps {
  title: string;
  url: string;
  shareCount?: number;
}

export default function ShareButtons({ title, url, shareCount = 0 }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tooltipStyle = "absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-black px-2 py-1 text-xs text-white shadow-md z-10";

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <a
          href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="X에서 공유하기"
          className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-border hover:text-text-primary"
          onMouseEnter={() => setHoveredBtn("twitter")}
          onMouseLeave={() => setHoveredBtn(null)}
        >
          <Twitter size={16} />
          <span>X</span>
        </a>
        {hoveredBtn === "twitter" && <span className={tooltipStyle}>X에서 공유하기</span>}
      </div>

      <div className="relative">
        <a
          href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn에서 공유하기"
          className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-border hover:text-text-primary"
          onMouseEnter={() => setHoveredBtn("linkedin")}
          onMouseLeave={() => setHoveredBtn(null)}
        >
          <Linkedin size={16} />
          <span>LinkedIn</span>
        </a>
        {hoveredBtn === "linkedin" && <span className={tooltipStyle}>LinkedIn에서 공유하기</span>}
      </div>

      <div className="relative">
        <a
          href={`https://story.kakao.com/share?url=${encodedUrl}&text=${encodedTitle}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="카카오 공유하기"
          className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-border hover:text-text-primary"
          onMouseEnter={() => setHoveredBtn("kakao")}
          onMouseLeave={() => setHoveredBtn(null)}
        >
          <MessageCircle size={16} />
          <span>KakaoTalk</span>
        </a>
        {hoveredBtn === "kakao" && <span className={tooltipStyle}>카카오 공유하기</span>}
      </div>

      <div className="relative">
        <a
          href={`https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Reddit에서 공유하기"
          className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-border hover:text-text-primary"
          onMouseEnter={() => setHoveredBtn("reddit")}
          onMouseLeave={() => setHoveredBtn(null)}
        >
          <span className="text-xs font-bold">R</span>
          <span>Reddit</span>
        </a>
        {hoveredBtn === "reddit" && <span className={tooltipStyle}>Reddit에서 공유하기</span>}
      </div>

      <div className="relative">
        <a
          href={`mailto:?subject=${encodedTitle}&body=${encodedTitle}%0A%0A${encodedUrl}`}
          aria-label="이메일로 공유하기"
          className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-border hover:text-text-primary"
          onMouseEnter={() => setHoveredBtn("email")}
          onMouseLeave={() => setHoveredBtn(null)}
        >
          <Mail size={16} />
          <span>Email</span>
        </a>
        {hoveredBtn === "email" && <span className={tooltipStyle}>이메일로 공유하기</span>}
      </div>

      <div className="relative">
        <button
          onClick={handleCopy}
          aria-label={copied ? "링크 복사됨" : "링크 복사"}
          className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-border hover:text-text-primary"
          onMouseEnter={() => setHoveredBtn("copy")}
          onMouseLeave={() => setHoveredBtn(null)}
        >
          {copied ? (
            <Check size={16} className="text-emerald-400" />
          ) : (
            <Link2 size={16} />
          )}
          <span>{copied ? "복사됨" : "링크 복사"}</span>
        </button>
        {hoveredBtn === "copy" && !copied && <span className={tooltipStyle}>링크 복사</span>}
      </div>

      {shareCount > 0 && (
        <span className="ml-1 text-xs text-slate-500">
          {shareCount}회 공유
        </span>
      )}
    </div>
  );
}
