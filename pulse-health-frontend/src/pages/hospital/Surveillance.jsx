import { useMemo } from "react";
import { Activity, Upload, ClipboardList, AlertTriangle, TrendingUp, Building2, MapPin, CloudRain, Droplets, ShieldCheck } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import KpiCard from "../../components/ui/KpiCard.jsx";
import { RiskBadge } from "../../components/ui/Badge.jsx";
import { SECTION_CLASSES, valueTone } from "../../utils/sectionStyles.js";
import useApi from "../../hooks/useApi.js";
import { getHospitalAlerts, getHospitalSubmissions } from "../../services/api.js";

const FACTOR_STYLE = {
  "Recent disease activity": { icon: TrendingUp, tint: "bg-danger-tint text-danger" },
  "Hospital admissions":     { icon: Building2,  tint: "bg-brand-tint text-brand" },
  "Regional activity":       { icon: MapPin,     tint: "bg-indigo-tint text-indigo" },
  "Rainfall":                { icon: CloudRain,  tint: "bg-cyan-tint text-cyan" },
  "Humidity":                { icon: Droplets,   tint: "bg-cyan-tint text-cyan" },
};

export default function HospitalSurveillance() {
  const { currentHospital } = useAuth();
  const { data: alerts }      = useApi(getHospitalAlerts);
  const { data: submissions } = useApi(getHospitalSubmissions);

  const latest = submissions?.[0];
  // Build evidence signals from the top alert's evidence factors
  const topAlert = (alerts || []).sort((a, b) => b.probability - a.probability)[0];
  const surveillanceSignals = useMemo(() => {
    if (!topAlert?.evidenceFactors?.length) return [];
    return topAlert.evidenceFactors.map(({ label, score }) => ({
      label, score,
      status: score > 70 ? "High" : score > 45 ? "Elevated" : "Stable",
    }));
  }, [topAlert]);

  return (
    <div className="grid gap-6">
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className={"text-[11px] uppercase tracking-[0.24em] " + SECTION_CLASSES.surveillance.eyebrow}>Hospital surveillance</p>
            <h1 className={"text-[22px] font-semibold mt-2 " + SECTION_CLASSES.surveillance.title}>Daily reporting &amp; signal validation</h1>
            <p className="mt-3 text-[13.5px] text-slate-500 max-w-2xl leading-6">
              Monitor internal data quality, trending evidence, and the signals that feed Pulse's early warnings.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <KpiCard label="Open alerts"      value={alerts?.length ?? 0} sub="pending review"   icon={AlertTriangle} valueTone={valueTone("Open alerts")} />
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
            {surveillanceSignals.length === 0 ? (
              <p className="p-5 text-muted text-[13px]">No evidence factors available — submit data first.</p>
            ) : surveillanceSignals.map(signal => {
              const style = FACTOR_STYLE[signal.label] || { icon: TrendingUp, tint: "bg-slate-100 text-slate-600" };
              const Icon = style.icon;
              return (
                <div key={signal.label} className="data-row">
                  <div className="data-row-details">
                    <span className={"icon-chip-sm " + style.tint}><Icon size={15} /></span>
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
                <p className="data-row-meta">{latest ? new Date(latest.reportDate).toLocaleDateString('en-IN') : currentHospital?.lastActivity || "Never"}</p>
              </div>
            </div>
            <div className="data-row">
              <div>
                <p className="data-row-label">Validation status</p>
                <p className="data-row-meta">{latest?.validationStatus || "No data yet"}</p>
              </div>
            </div>
            <div className="data-row">
              <div>
                <p className="data-row-label">Disease reported</p>
                <p className="data-row-meta">{latest?.disease || "—"}</p>
              </div>
            </div>
            <div className="data-row border-b-0">
              <div>
                <p className="data-row-label">Recommended action</p>
                <p className="data-row-meta">Confirm recent case counts and lab results</p>
              </div>
            </div>
          </div>
          <a href="/hospital/submit" className="btn-primary w-full mt-6 justify-center block text-center">
            <Upload size={16} className="inline mr-1" /> Submit fresh surveillance data
          </a>
        </div>
      </div>
    </div>
  );
}
