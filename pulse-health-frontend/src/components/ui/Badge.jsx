const RISK_MAP = {
  High: "inline-flex items-center gap-1.5 rounded-full bg-danger-tint px-2.5 py-1 text-[11px] font-semibold text-danger",
  Medium: "inline-flex items-center gap-1.5 rounded-full bg-warning-tint px-2.5 py-1 text-[11px] font-semibold text-warning",
  Low: "inline-flex items-center gap-1.5 rounded-full bg-success-tint px-2.5 py-1 text-[11px] font-semibold text-success",
  Normal: "inline-flex items-center gap-1.5 rounded-full bg-info-tint px-2.5 py-1 text-[11px] font-semibold text-info",
};

const STATUS_MAP = {
  Reporting: "inline-flex items-center gap-1.5 rounded-full bg-success-tint px-3 py-1 text-xs font-semibold text-success",
  Delayed: "inline-flex items-center gap-1.5 rounded-full bg-warning-tint px-3 py-1 text-xs font-semibold text-warning",
  "Needs review": "inline-flex items-center gap-1.5 rounded-full bg-danger-tint px-3 py-1 text-xs font-semibold text-danger",
  Monitoring: "inline-flex items-center gap-1.5 rounded-full bg-warning-tint px-3 py-1 text-xs font-semibold text-warning",
  Normal: "inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600",
  Complete: "inline-flex items-center gap-1.5 rounded-full bg-success-tint px-3 py-1 text-xs font-semibold text-success",
};

export function RiskBadge({ level }) {
  return <span className={RISK_MAP[level] || "inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600"}>{level}</span>;
}

export function StatusBadge({ status }) {
  return <span className={STATUS_MAP[status] || "inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600"}>{status}</span>;
}
