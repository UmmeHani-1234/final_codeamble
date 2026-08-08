import { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { useAuth } from "../../context/AuthContext.jsx";
import KpiCard from "../../components/ui/KpiCard.jsx";
import { Activity, AlertTriangle, BarChart3, ShieldCheck } from "lucide-react";

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
            <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Risk history</p>
            <h1 className="text-3xl font-semibold text-slate-900 mt-2">Thresholds and trend analysis</h1>
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
            <h2 className="text-xl font-semibold text-slate-900 mt-2">Risk score over the last 5 reports</h2>
          </div>
          <ShieldCheck className="text-blue-600" />
        </div>
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={riskHistory} margin={{ top: 10, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid stroke="#EEF1F6" vertical={false} />
              <XAxis dataKey="period" tick={{ fontSize: 11, fill: "#61708F" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#61708F" }} axisLine={false} tickLine={false} unit="%" />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #EEF1F6", fontSize: 12 }} />
              <Line type="monotone" dataKey="risk" stroke="#2554E8" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Recent alert context</p>
              <h2 className="text-xl font-semibold text-slate-900 mt-2">What changed the score</h2>
            </div>
            <BarChart3 className="text-slate-600" />
          </div>
          <ul className="space-y-3 text-sm text-slate-600">
            <li className="rounded-3xl bg-slate-50 p-4">Data submission completeness improved, boosting model confidence for the latest forecast.</li>
            <li className="rounded-3xl bg-slate-50 p-4">Regional case reports showed a sustained upward trend in the local health district.</li>
            <li className="rounded-3xl bg-slate-50 p-4">Environmental factors such as rainfall and humidity contributed additional risk weight.</li>
          </ul>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Next steps</p>
              <h2 className="text-xl font-semibold text-slate-900 mt-2">Review and validate</h2>
            </div>
            <ShieldCheck className="text-blue-600" />
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
