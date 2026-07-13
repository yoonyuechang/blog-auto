const SIZES = { sm: "h-5 w-5", md: "h-8 w-8", lg: "h-12 w-12" };

export default function LoadingSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`${SIZES[size]} animate-spin rounded-full border-2 border-border border-t-emerald-400`} />
      <span className="text-xs text-text-muted">로딩 중...</span>
    </div>
  );
}
