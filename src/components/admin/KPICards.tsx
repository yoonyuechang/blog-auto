interface KPIData {
  totalArticles: number;
  pendingArticles: number;
  totalSubscribers: number;
  totalViews: number;
}

export default function KPICards({ data }: { data: KPIData }) {
  const cards = [
    { label: "총 게시글", value: data.totalArticles, color: "text-emerald-400" },
    { label: "승인 대기", value: data.pendingArticles, color: "text-amber-400" },
    { label: "총 구독자", value: data.totalSubscribers, color: "text-cyan-400" },
    { label: "누적 조회수", value: data.totalViews, color: "text-purple-400" },
  ];
  return (
    <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div key={card.label} className="rounded-lg border border-border bg-card p-5">
          <p className="text-sm text-text-muted">{card.label}</p>
          <p className={`mt-1 text-2xl font-bold ${card.color}`}>{card.value.toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}
