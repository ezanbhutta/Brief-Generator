import type { LucideIcon } from "lucide-react";

interface Props {
  label: string;
  value: string | number;
  sub?: string;
  accent?: "violet" | "mint" | "cyan" | "amber" | "coral";
  icon?: LucideIcon;
}

const ACCENT_CLASSES: Record<NonNullable<Props["accent"]>, { bg: string; fg: string }> = {
  violet: { bg: "bg-violet-bg", fg: "text-violet" },
  mint: { bg: "bg-mint-bg", fg: "text-mint" },
  cyan: { bg: "bg-cyan-bg", fg: "text-cyan" },
  amber: { bg: "bg-amber-bg", fg: "text-amber" },
  coral: { bg: "bg-coral-bg", fg: "text-coral" },
};

export default function StatCard({ label, value, sub, accent = "violet", icon: Icon }: Props) {
  const a = ACCENT_CLASSES[accent];
  return (
    <div className="rounded-xl border border-border bg-bg-card p-4 transition hover:-translate-y-0.5 hover:border-border-hi">
      <div className="mb-2.5 flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-label text-dim">{label}</span>
        {Icon && (
          <div className={`flex h-6 w-6 items-center justify-center rounded-md ${a.bg}`}>
            <Icon size={12} strokeWidth={2.5} className={a.fg} />
          </div>
        )}
      </div>
      <div className="mono text-2xl font-semibold tracking-tight text-ink">{value}</div>
      {sub && <div className="mt-1 text-[12px] text-muted">{sub}</div>}
    </div>
  );
}
