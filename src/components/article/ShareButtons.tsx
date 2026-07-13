"use client";

import { useState } from "react";
import { Twitter, Link2, MessageCircle, Check } from "lucide-react";

interface ShareButtonsProps {
  title: string;
  url: string;
}

export default function ShareButtons({ title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2">
      <a
        href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-border hover:text-text-primary"
      >
        <Twitter size={16} />
        <span>X</span>
      </a>
      <a
        href={`https://story.kakao.com/share?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-border hover:text-text-primary"
      >
        <MessageCircle size={16} />
        <span>KakaoTalk</span>
      </a>
      <button
        onClick={handleCopy}
        className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-border hover:text-text-primary"
      >
        {copied ? <Check size={16} className="text-emerald-400" /> : <Link2 size={16} />}
        <span>{copied ? "복사됨" : "링크 복사"}</span>
      </button>
    </div>
  );
}
