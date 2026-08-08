import { useMemo } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import KpiCard from "../../components/ui/KpiCard.jsx";
import { Activity, AlertTriangle, BarChart3, ShieldCheck } from "lucide-react";
import { SECTION_CLASSES } from "../../utils/sectionStyles.js";

const riskHistory = [
  { period: "3 days ago", risk: 54 },
  { period: "2 days ago", risk: 61 },
  { period: "Yesterday", risk: 72 },
  { period: "Today", risk: 80 },
  { period: "Forecast", risk: 76 },
];

export default function HospitalRiskHistory() {
  const { currentHospital, currentAlerts } = useAuth();
  const highAlerts = currentAlerts.filter((alert) => alert.risk === "High").length;

  const detailPoint = useMemo(
    () => ({ label: "Forecast", value: 76 }),
    []
  );

  return (
    <div className="grid gap-6">
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className={"text-xs uppercase tracking-[0.32em] " + SECTION_CLASSES.riskHistory.eyebrow}>Risk history</p>
            <h1 className={"text-3xl font-semibold mt-2 " + SECTION_CLASSES.riskHistory.title}>Thresholds and trend analysis</h1>
            <p className="mt-3 text-sm text-slate-500 max-w-2xl">
              Track how hospital risk evolved over time and what the latest signal means for your reporting cadence.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <KpiCard label="Current risk" value={`${detailPoint.value}%`} sub="model forecast" icon={BarChart3} />
            <KpiCard label="High alerts" value={highAlerts} sub="open review items" icon={AlertTriangle} />
            <KpiCard label="Hospital focus" value={currentHospital?.region} sub="regional watch" icon={Activity} />
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Trend analysis</p>
            <h2 className="text-xl font-semibold text-danger mt-2">Risk score over the last 5 reports</h2>
          </div>
            <ShieldCheck className="text-brand" />
        </div>
        <RiskTrendChart data={riskHistory} />
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Recent alert context</p>
              <h2 className="text-xl font-semibold text-indigo mt-2">What changed the score</h2>
            </div>
            <BarChart3 className="text-slate-600" />
          </div>
          <ul className="space-y-3 text-sm text-slate-600">
            <li className="rounded-3xl bg-white p-4 border border-slate-200 text-[13.5px] text-slate-600">Data submission completeness improved, boosting model confidence for the latest forecast.</li>
            <li className="rounded-3xl bg-white p-4 border border-slate-200 text-[13.5px] text-slate-600">Regional case reports showed a sustained upward trend in the local health district.</li>
            <li className="rounded-3xl bg-white p-4 border border-slate-200 text-[13.5px] text-slate-600">Environmental factors such as rainfall and humidity contributed additional risk weight.</li>
          </ul>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Next steps</p>
              <h2 className="text-xl font-semibold text-success mt-2">Review and validate</h2>
            </div>
            <ShieldCheck className="text-brand" />
          </div>
          <div className="space-y-3 text-sm text-slate-600">
            <div className="rounded-3xl bg-slate-50 p-4">
              <p className="font-semibold text-slate-900">Confirm admission trends</p>
              <p className="mt-1">Verify whether hospital admissions reflect the latest modeled risk.</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-4">
              <p className="font-semibold text-slate-900">Share findings</p>
              <p className="mt-1">Notify your surveillance team and update the alert status once validated.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RiskTrendChart({ data }) {
  const width = 640;
  const height = 280;
  const padding = { top: 18, right: 18, bottom: 46, left: 38 };
  const min = 40;
  const max = 100;
  const x = (index) => padding.left + (index * (width - padding.left - padding.right)) / (data.length - 1);
  const y = (value) => padding.top + ((max - value) * (height - padding.top - padding.bottom)) / (max - min);
  const path = data.map((point, index) => `${index ? "L" : "M"}${x(index)} ${y(point.risk)}`).join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-[320px]" role="img" aria-label="Risk score trend over the last five reports">
      {[40, 60, 80, 100].map((tick) => <g key={tick}><line x1={padding.left} x2={width - padding.right} y1={y(tick)} y2={y(tick)} stroke="#EEF1F6" /><text x={padding.left - 8} y={y(tick) + 4} textAnchor="end" fontSize="11" fill="#61708F">{tick}%</text></g>)}
      <path d={path} fill="none" stroke="#2554E8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {data.map((point, index) => <g key={point.period}><circle cx={x(index)} cy={y(point.risk)} r="5" fill="#2554E8" stroke="white" strokeWidth="2" /><title>{`${point.period}: ${point.risk}%`}</title><text x={x(index)} y={height - 15} textAnchor="middle" fontSize="11" fill="#61708F">{point.period}</text></g>)}
    </svg>
  );
}
