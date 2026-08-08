import { TrendingUp, TrendingDown } from "lucide-react";

export default function KpiCard({ label, value, sub, trend, icon: Icon }) {
  return (
    <div className="card !p-[18px]">
      <div className="flex items-start justify-between">
        <span className="eyebrow">{label}</span>
        {Icon && <span className="icon-chip"><Icon size={16} /></span>}
      </div>
      <div className="font-display text-[28px] font-semibold mt-2.5">{value}</div>
      {sub && (
        <div className="flex items-center gap-1 text-[12px] text-muted mt-1.5">
          {trend === "up" && <TrendingUp size={13} className="text-success" />}
          {trend === "down" && <TrendingDown size={13} className="text-danger" />}
          <span>{sub}</span>
        </div>
      )}
    </div>
  );
}
