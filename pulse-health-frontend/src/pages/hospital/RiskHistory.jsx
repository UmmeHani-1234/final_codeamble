import { Activity, AlertTriangle, BarChart3, ShieldCheck } from "lucide-react";
import { SECTION_CLASSES } from "../../utils/sectionStyles.js";
import KpiCard from "../../components/ui/KpiCard.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import useApi from "../../hooks/useApi.js";
import { getRiskHistory, getHospitalAlerts } from "../../services/api.js";

export default function HospitalRiskHistory() {
  const { currentHospital } = useAuth();
  const { data: snapshots, loading }  = useApi(getRiskHistory);
  const { data: alerts }              = useApi(getHospitalAlerts);

  const highAlerts = (alerts || []).filter(a => a.risk === "High").length;
  const latest     = snapshots?.[snapshots.length - 1];
  const forecast   = latest?.riskScore ?? 0;

  // Build chart data: label = "N days ago", or "Today"
  const chartData = (snapshots || []).map((s, i) => ({
    period: i === (snapshots.length - 1) ? "Today" : `${snapshots.length - 1 - i}d ago`,
    risk: s.riskScore,
  }));

  if (loading) return <div className="card py-14 text-center text-muted text-[13.5px]">Loading risk history…</div>;

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
            <KpiCard label="Current risk"   value={`${forecast}%`}       sub="model forecast"    icon={BarChart3} />
            <KpiCard label="High alerts"    value={highAlerts}            sub="open review items" icon={AlertTriangle} />
            <KpiCard label="Hospital focus" value={currentHospital?.region} sub="regional watch" icon={Activity} />
          </div>
        </div>
      </div>

      {chartData.length > 0 && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Trend analysis</p>
              <h2 className="text-xl font-semibold text-danger mt-2">Risk score over the last {chartData.length} snapshots</h2>
            </div>
            <ShieldCheck className="text-brand" />
          </div>
          <RiskTrendChart data={chartData} />
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Evidence breakdown</p>
              <h2 className="text-xl font-semibold text-indigo mt-2">What changed the score</h2>
            </div>
            <BarChart3 className="text-slate-600" />
          </div>
          {latest?.factors ? (
            <div className="space-y-3">
              {Object.entries(latest.factors).map(([key, val]) => (
                <div key={key} className="flex items-center gap-3">
                  <span className="w-[160px] text-[13px] text-secondary capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                  <div className="flex-1 h-[7px] bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-brand to-indigo" style={{ width: `${val}%` }} />
                  </div>
                  <span className="w-9 text-right text-[12px] tabular-nums text-muted">{val}%</span>
                </div>
              ))}
            </div>
          ) : <p className="text-muted text-[13px]">No factor data available.</p>}
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
  const width = 640, height = 280;
  const padding = { top: 18, right: 18, bottom: 46, left: 38 };
  const min = 0, max = 100;
  const x = i   => padding.left + (i * (width - padding.left - padding.right)) / Math.max(data.length - 1, 1);
  const y = val => padding.top + ((max - val) * (height - padding.top - padding.bottom)) / (max - min);
  const path = data.map((p, i) => `${i ? "L" : "M"}${x(i)} ${y(p.risk)}`).join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-[220px]" role="img" aria-label="Risk score trend">
      {[25, 50, 75, 100].map(tick => (
        <g key={tick}>
          <line x1={padding.left} x2={width - padding.right} y1={y(tick)} y2={y(tick)} stroke="#EEF1F6" />
          <text x={padding.left - 8} y={y(tick) + 4} textAnchor="end" fontSize="11" fill="#61708F">{tick}%</text>
        </g>
      ))}
      <path d={path} fill="none" stroke="#2554E8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {data.map((p, i) => (
        <g key={p.period}>
          <circle cx={x(i)} cy={y(p.risk)} r="5" fill="#2554E8" stroke="white" strokeWidth="2" />
          <title>{`${p.period}: ${p.risk}%`}</title>
          <text x={x(i)} y={height - 15} textAnchor="middle" fontSize="11" fill="#61708F">{p.period}</text>
        </g>
      ))}
    </svg>
  );
}
