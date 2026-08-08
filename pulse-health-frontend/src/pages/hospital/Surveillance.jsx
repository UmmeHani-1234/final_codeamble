import { Activity, ShieldCheck, Upload, ClipboardList, AlertTriangle, TrendingUp, Building2, MapPin, CloudRain, Droplets } from "lucide-react";
import { useMemo } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { evidenceFactors } from "../../data/mockData.js";
import KpiCard from "../../components/ui/KpiCard.jsx";
import { RiskBadge } from "../../components/ui/Badge.jsx";
import { SECTION_CLASSES, valueTone } from "../../utils/sectionStyles.js";

const FACTOR_STYLE = {
  "Recent disease activity": { icon: TrendingUp, tint: "bg-danger-tint text-danger" },
  "Hospital admissions": { icon: Building2, tint: "bg-brand-tint text-brand" },
  "Regional activity": { icon: MapPin, tint: "bg-indigo-tint text-indigo" },
  "Rainfall": { icon: CloudRain, tint: "bg-cyan-tint text-cyan" },
  "Humidity": { icon: Droplets, tint: "bg-cyan-tint text-cyan" },
};

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
            <p className={"text-[11px] uppercase tracking-[0.24em] " + SECTION_CLASSES.surveillance.eyebrow}>Hospital surveillance</p>
            <h1 className={"text-[22px] font-semibold mt-2 " + SECTION_CLASSES.surveillance.title}>Daily reporting & signal validation</h1>
            <p className="mt-3 text-[13.5px] text-slate-500 max-w-2xl leading-6">
              Monitor internal data quality, trending evidence, and the signals that feed ShadowDoctor's early warnings.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <KpiCard label="Open alerts" value={currentAlerts.length} sub="pending review" icon={AlertTriangle} valueTone={valueTone("Open alerts")} />
            <KpiCard label="Submission score" value={`${currentHospital?.completeness ?? 0}%`} sub="data completeness" icon={Upload} valueTone={valueTone("Submission score")} />
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border surface-status p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Evidence factors</p>
              <h2 className="text-xl font-semibold text-slate-900 mt-2">What changed this cycle</h2>
            </div>
            <ClipboardList className="text-brand" />
          </div>
          <div className="overflow-hidden rounded-[20px] border border-slate-200 bg-white">
            {surveillanceSignals.map((signal) => {
              const style = FACTOR_STYLE[signal.label] || { icon: TrendingUp, tint: "bg-slate-100 text-slate-600" };
              const Icon = style.icon;
              return (
                <div key={signal.label} className="data-row">
                  <div className="data-row-details">
                    <span className={"icon-chip-sm " + style.tint}>
                      <Icon size={15} />
                    </span>
                    <div className="data-row-copy">
                      <p className="data-row-label">{signal.label}</p>
                      <p className="data-row-meta">Score: {signal.score}</p>
                    </div>
                  </div>
                  <RiskBadge level={signal.status === "High" ? "High" : signal.status === "Elevated" ? "Medium" : "Low"} />
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Workflow health</p>
              <h2 className="text-xl font-semibold text-slate-900 mt-2">Submission and model readiness</h2>
            </div>
            <ShieldCheck className="text-success" />
          </div>
          <div className="overflow-hidden rounded-[20px] border border-slate-200 bg-white">
            <div className="data-row">
              <div>
                <p className="data-row-label">Latest upload</p>
                <p className="data-row-meta">{currentHospital?.lastActivity}</p>
              </div>
            </div>
            <div className="data-row">
              <div>
                <p className="data-row-label">Data validation</p>
                <p className="data-row-meta">Good</p>
              </div>
            </div>
            <div className="data-row border-b-0">
              <div>
                <p className="data-row-label">Recommended action</p>
                <p className="data-row-meta">Confirm recent case counts and lab results</p>
              </div>
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
