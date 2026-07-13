interface TagChipProps {
  name: string;
  color?: string;
}

export default function TagChip({ name, color = "#94A3B8" }: TagChipProps) {
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
      style={{ backgroundColor: `${color}20`, color }}
    >
      {name}
    </span>
  );
}
