import { Clock } from "lucide-react"

export default function ReadingTime({ content }: { content: string }) {
  const minutes = Math.max(1, Math.ceil(content.length / 200))
  return (
    <span className="flex items-center gap-1.5">
      <Clock size={14} className="text-emerald-400" />
      약 {minutes}분 읽기
    </span>
  )
}
