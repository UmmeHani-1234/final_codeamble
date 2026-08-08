import { Activity, ShieldCheck, Upload, ClipboardList, AlertTriangle } from "lucide-react";
import { useMemo } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { evidenceFactors } from "../../data/mockData.js";
import KpiCard from "../../components/ui/KpiCard.jsx";
import { RiskBadge } from "../../components/ui/Badge.jsx";

export default function HospitalSurveillance() {
  const { currentHospital, currentAlerts } = useAuth();

  const surveillanceSignals = useMemo(
    () => evidenceFactors.map(([label, score], index) => ({ label, score, status: score > 70 ? "High" : score > 45 ? "Elevated" : "Stable" })),
    []
  );

  return (
    <div className="grid gap-6">
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Hospital surveillance</p>
            <h1 className="text-3xl font-semibold text-slate-900 mt-2">Daily reporting & signal validation</h1>
            <p className="mt-3 text-sm text-slate-500 max-w-2xl">
              Monitor internal data quality, trending evidence, and the signals that feed ShadowDoctor's early warnings.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <KpiCard label="Open alerts" value={currentAlerts.length} sub="pending review" icon={AlertTriangle} />
            <KpiCard label="Submission score" value={`${currentHospital?.completeness ?? 0}%`} sub="data completeness" icon={Upload} />
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Evidence factors</p>
              <h2 className="text-xl font-semibold text-slate-900 mt-2">What changed this cycle</h2>
            </div>
            <ClipboardList className="text-blue-600" />
          </div>
          <div className="space-y-4">
            {surveillanceSignals.map((signal) => (
              <div key={signal.label} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{signal.label}</p>
                    <p className="text-sm text-slate-500 mt-1">Score: {signal.score}</p>
                  </div>
                  <RiskBadge level={signal.status === "High" ? "High" : signal.status === "Elevated" ? "Medium" : "Low"} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Workflow health</p>
              <h2 className="text-xl font-semibold text-slate-900 mt-2">Submission and model readiness</h2>
            </div>
            <ShieldCheck className="text-slate-600" />
          </div>
          <div className="space-y-3">
            <div className="rounded-3xl bg-slate-50 p-4">
              <div className="text-sm text-slate-500">Latest upload</div>
              <div className="mt-2 text-lg font-semibold text-slate-900">{currentHospital?.lastActivity}</div>
            </div>
            <div className="rounded-3xl bg-slate-50 p-4">
              <div className="text-sm text-slate-500">Data validation</div>
              <div className="mt-2 text-lg font-semibold text-slate-900">Good</div>
            </div>
            <div className="rounded-3xl bg-slate-50 p-4">
              <div className="text-sm text-slate-500">Recommended action</div>
              <div className="mt-2 text-lg font-semibold text-slate-900">Confirm recent case counts and lab results</div>
            </div>
          </div>
          <button className="btn-primary w-full mt-6">
            <Upload size={16} /> Submit fresh surveillance data
          </button>
        </div>
      </div>
    </div>
  );
}
