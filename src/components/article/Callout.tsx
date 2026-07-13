import { Info, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

type CalloutType = "info" | "warning" | "success" | "danger";

interface CalloutProps {
  type: CalloutType;
  title?: string;
  children: React.ReactNode;
}

const CALLOUT_STYLES: Record<CalloutType, { bg: string; border: string; icon: React.ReactNode; titleColor: string }> = {
  info: {
    bg: "bg-blue-950/30",
    border: "border-blue-500",
    icon: <Info size={18} className="text-blue-400 shrink-0" />,
    titleColor: "text-blue-400",
  },
  warning: {
    bg: "bg-yellow-950/30",
    border: "border-yellow-500",
    icon: <AlertTriangle size={18} className="text-yellow-400 shrink-0" />,
    titleColor: "text-yellow-400",
  },
  success: {
    bg: "bg-green-950/30",
    border: "border-green-500",
    icon: <CheckCircle size={18} className="text-green-400 shrink-0" />,
    titleColor: "text-green-400",
  },
  danger: {
    bg: "bg-red-950/30",
    border: "border-red-500",
    icon: <XCircle size={18} className="text-red-400 shrink-0" />,
    titleColor: "text-red-400",
  },
};

const DEFAULT_TITLES: Record<CalloutType, string> = {
  info: "참고",
  warning: "주의",
  success: "성공",
  danger: "위험",
};

export default function Callout({ type, title, children }: CalloutProps) {
  const style = CALLOUT_STYLES[type];
  return (
    <div className={`my-5 flex gap-3 rounded-lg border-l-4 ${style.border} ${style.bg} p-4`}>
      <div className="pt-0.5">{style.icon}</div>
      <div className="min-w-0 text-sm leading-relaxed text-text-secondary">
        <span className={`mb-1 block font-semibold ${style.titleColor}`}>
          {title || DEFAULT_TITLES[type]}
        </span>
        {children}
      </div>
    </div>
  );
}
