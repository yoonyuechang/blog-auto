"use client";

const GRADE_STYLES: Record<string, string> = {
  S: "bg-amber-500/20 text-amber-400 border-amber-500/50",
  A: "bg-emerald-500/20 text-emerald-400 border-emerald-500/50",
  B: "bg-cyan-500/20 text-cyan-400 border-cyan-500/50",
  C: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50",
  D: "bg-red-500/20 text-red-400 border-red-500/50",
};

function getGrade(score: number): string {
  if (score >= 90) return "S";
  if (score >= 75) return "A";
  if (score >= 55) return "B";
  if (score >= 35) return "C";
  return "D";
}

export default function QualityBadge({ score }: { score: number }) {
  const grade = getGrade(score);

  return (
    <div className="group relative">
      <span
        className={`inline-flex h-6 w-6 items-center justify-center rounded border text-xs font-bold ${GRADE_STYLES[grade]}`}
      >
        {grade}
      </span>
      <div className="pointer-events-none absolute right-0 top-8 z-50 hidden w-40 rounded-lg border border-border bg-card p-2 text-xs text-text-secondary shadow-xl group-hover:block">
        <div className="mb-1 font-medium text-text-primary">품질 점수: {score}/100</div>
        <div>등급: {grade}</div>
      </div>
    </div>
  );
}
