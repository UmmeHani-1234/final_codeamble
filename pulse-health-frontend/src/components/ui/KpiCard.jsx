import { TrendingUp, TrendingDown } from "lucide-react";

const TONE = {
  brand: "bg-brand-tint text-brand",
  indigo: "bg-indigo-tint text-indigo",
  cyan: "bg-cyan-tint text-cyan",
  danger: "bg-danger-tint text-danger",
  warning: "bg-warning-tint text-warning",
  success: "bg-success-tint text-success",
};
const SURFACE = {
  brand: "surface-action",
  indigo: "surface-regional",
  cyan: "surface-environment",
  danger: "surface-risk",
  warning: "surface-attention",
  success: "surface-status",
};

export default function KpiCard({ label, value, sub, trend, icon: Icon, tone = "brand", valueTone = "text-slate-900" }) {
  return (
    <div className={"rounded-3xl border p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md " + (SURFACE[tone] || SURFACE.brand)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[12.5px] uppercase tracking-[0.24em] text-slate-500">{label}</div>
          <div className={"mt-3 text-[28px] font-semibold " + valueTone}>{value}</div>
        </div>
        {Icon && (
          <span className={"grid h-10 w-10 place-items-center rounded-2xl shadow-sm " + (TONE[tone] || TONE.brand)}>
            <Icon size={16} />
          </span>
        )}
      </div>
      {sub && (
        <div className="mt-4 flex items-center gap-2 text-[12px] text-slate-500">
          {trend === "up" && <TrendingUp size={14} className="text-success" />}
          {trend === "down" && <TrendingDown size={14} className="text-danger" />}
          <span>{sub}</span>
        </div>
      )}
    </div>
  );
}
