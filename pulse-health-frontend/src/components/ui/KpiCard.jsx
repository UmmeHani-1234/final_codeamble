import { TrendingUp, TrendingDown } from "lucide-react";

export default function KpiCard({ label, value, sub, trend, icon: Icon }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-slate-900">{label}</div>
          <div className="mt-3 text-3xl font-bold text-slate-900">{value}</div>
        </div>
        {Icon && (
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-50 text-blue-600 shadow-sm">
            <Icon size={18} />
          </span>
        )}
      </div>
      {sub && (
        <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
          {trend === "up" && <TrendingUp size={14} className="text-emerald-500" />}
          {trend === "down" && <TrendingDown size={14} className="text-red-500" />}
          <span>{sub}</span>
        </div>
      )}
    </div>
  );
}
