interface AISummaryProps {
  aiSummary: string;
  keyPoints: string;
}

export default function AISummary({ aiSummary, keyPoints }: AISummaryProps) {
  const points = keyPoints ? JSON.parse(keyPoints) : [];
  const summaryLines = aiSummary.split("\n").filter(Boolean);

  return (
    <div className="mb-8 rounded-lg border border-cyan-900 bg-gradient-to-br from-cyan-950/50 to-emerald-950/30 p-6">
      <h3 className="mb-3 text-sm font-bold text-cyan-400">🤖 AI 3줄 요약</h3>
      <ul className="mb-4 space-y-1">
        {summaryLines.map((line, i) => (
          <li key={i} className="text-sm text-text-secondary">{line}</li>
        ))}
      </ul>
      {points.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {points.map((point: string) => (
            <span key={point} className="rounded-full border border-cyan-800 bg-cyan-950/50 px-3 py-1 text-xs text-cyan-300">
              {point}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
