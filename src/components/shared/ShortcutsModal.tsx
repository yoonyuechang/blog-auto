"use client";

import { X } from "lucide-react";

interface ShortcutsModalProps {
  open: boolean;
  onClose: () => void;
}

const SECTIONS = [
  {
    title: "탐색",
    shortcuts: [
      { keys: ["1-6"], desc: "카테고리 이동" },
      { keys: ["↑"], desc: "맨 위로 스크롤" },
      { keys: ["J"], desc: "다음 제목 (TOC)" },
      { keys: ["K"], desc: "이전 제목 (TOC)" },
    ],
  },
  {
    title: "검색",
    shortcuts: [
      { keys: ["⌘", "K"], desc: "검색 열기" },
      { keys: ["↑", "↓"], desc: "결과 탐색" },
      { keys: ["Enter"], desc: "선택" },
    ],
  },
  {
    title: "아티클",
    shortcuts: [
      { keys: ["⌘", "B"], desc: "북마크 토글" },
      { keys: ["Enter"], desc: "제목으로 이동 (TOC)" },
    ],
  },
  {
    title: "일반",
    shortcuts: [
      { keys: ["?"], desc: "단축키 도움말" },
      { keys: ["Esc"], desc: "모달 닫기" },
    ],
  },
];

export default function ShortcutsModal({ open, onClose }: ShortcutsModalProps) {
  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="키보드 단축키"
      className="fixed inset-0 z-[60] flex items-center justify-center"
    >
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-text-primary">키보드 단축키</h2>
          <button onClick={onClose} aria-label="닫기" className="text-text-muted hover:text-text-primary">
            <X size={20} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {SECTIONS.map((section) => (
            <div key={section.title}>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-emerald-400">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.shortcuts.map((s, i) => (
                  <li key={i} className="flex items-center justify-between gap-2">
                    <span className="text-sm text-text-secondary">{s.desc}</span>
                    <span className="flex shrink-0 gap-0.5">
                      {s.keys.map((k) => (
                        <kbd
                          key={k}
                          className="inline-flex h-6 min-w-[24px] items-center justify-center rounded border border-border bg-bg px-1.5 font-mono text-[11px] text-text-muted"
                        >
                          {k}
                        </kbd>
                      ))}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-5 text-center text-[11px] text-text-muted">
          Mac에서 ⌘, Windows/Linux에서 Ctrl 사용
        </p>
      </div>
    </div>
  );
}
