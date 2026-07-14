export default function AdminLoading() {
  return (
    <div className="flex gap-6">
      <div className="hidden h-screen w-56 shrink-0 border-r border-border bg-surface lg:block">
        <div className="space-y-3 p-4">
          <div className="h-8 w-full animate-pulse rounded bg-surface" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-6 w-3/4 animate-pulse rounded bg-surface" />
          ))}
        </div>
      </div>
      <div className="flex-1 space-y-6 p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-xl border border-border bg-card" />
          ))}
        </div>
        <div className="h-64 animate-pulse rounded-xl border border-border bg-card" />
        <div className="h-48 animate-pulse rounded-xl border border-border bg-card" />
      </div>
    </div>
  );
}
