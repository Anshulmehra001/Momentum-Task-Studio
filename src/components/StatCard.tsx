import { ReactNode } from "react";

export const StatCard = ({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: string;
  hint?: string;
  icon?: ReactNode;
}) => (
  <div className="glass-panel card-border h-full rounded-2xl p-4 shadow-card">
    <div className="flex items-center justify-between">
      <div className="section-title">{label}</div>
      {icon && <div className="rounded-lg bg-white/5 p-2 text-aurora-blue">{icon}</div>}
    </div>
    <div className="mt-2 font-display text-3xl font-semibold text-white">{value}</div>
    {hint && <div className="mt-1 text-sm text-slate-400">{hint}</div>}
  </div>
);
