const SIZES = { sm: "h-5 w-5", md: "h-8 w-8", lg: "h-12 w-12" };

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  label?: string;
  fullPage?: boolean;
}

export default function LoadingSpinner({ size = "md", label, fullPage }: LoadingSpinnerProps) {
  const spinner = (
    <div className="flex flex-col items-center gap-2">
      <div className={`${SIZES[size]} animate-spin rounded-full border-2 border-border border-t-emerald-400`} />
      <span className="text-xs text-text-muted">{label || "로딩 중..."}</span>
    </div>
  );

  if (fullPage) {
    return <div className="flex min-h-[60vh] items-center justify-center">{spinner}</div>;
  }
  return spinner;
}
