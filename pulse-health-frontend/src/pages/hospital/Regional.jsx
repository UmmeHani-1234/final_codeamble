import { MapPin, Activity, ShieldCheck } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { RiskBadge } from "../../components/ui/Badge.jsx";
import { SECTION_CLASSES } from "../../utils/sectionStyles.js";
import useApi from "../../hooks/useApi.js";
import { getRegionalRisk } from "../../services/api.js";

const riskTileTone = (risk) => risk > 75
  ? { surface: "surface-risk",       text: "text-danger",  icon: "bg-danger-tint text-danger" }
  : risk > 45
    ? { surface: "surface-attention", text: "text-warning", icon: "bg-warning-tint text-warning" }
    : { surface: "surface-status",    text: "text-success", icon: "bg-success-tint text-success" };

export default function HospitalRegional() {
  const { currentHospital } = useAuth();
  const { data: regions, loading, error } = useApi(getRegionalRisk);

  const nearbyRegions = (regions || []).slice(0, 5);
  const myRegion = regions?.find(r => r.region === currentHospital?.region);

  if (loading) return <div className="card py-14 text-center text-muted text-[13.5px]">Loading regional data…</div>;
  if (error)   return <div className="card py-14 text-center text-danger text-[13.5px]">{error}</div>;

  return (
    <div className="grid gap-6">
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className={"text-[11px] uppercase tracking-[0.24em] " + SECTION_CLASSES.regional.eyebrow}>Regional intelligence</p>
            <h1 className={"text-[20px] font-semibold mt-2 " + SECTION_CLASSES.regional.title}>Overview for {currentHospital?.region}</h1>
            <p className="mt-3 text-[13.5px] text-slate-500 max-w-2xl leading-6">
              Compare nearby districts and early warning signals so your hospital can prioritize response and reporting.
            </p>
          </div>
          <div className="rounded-3xl bg-slate-50 px-5 py-4 text-slate-700 shadow-sm">
            <div className="text-xs uppercase tracking-[0.32em] text-slate-500">Your region risk</div>
            <div className="mt-2 text-xl font-semibold text-slate-900">{myRegion?.risk ?? "—"}%</div>
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="grid gap-5">
          <div className="rounded-3xl border surface-regional p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Regional risk map</p>
                <h2 className="text-xl font-semibold text-slate-900 mt-2">Most impacted areas</h2>
              </div>
              <MapPin className="text-indigo" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {nearbyRegions.map(region => {
                const tone = riskTileTone(region.risk);
                const riskLevel = region.risk > 75 ? "High" : region.risk > 45 ? "Medium" : "Low";
                return (
                  <div key={region.region} className={"relative overflow-hidden rounded-3xl border p-4 shadow-sm transition-transform hover:-translate-y-0.5 " + tone.surface}>
                    <div className={"absolute -right-5 -top-5 h-20 w-20 rounded-full opacity-40 blur-2xl " + tone.icon} />
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        <span className={"mt-0.5 grid h-8 w-8 place-items-center rounded-xl " + tone.icon}><MapPin size={14} /></span>
                        <div>
                          <p className={"text-[13.5px] font-semibold " + tone.text}>{region.region}</p>
                          <p className="text-[12px] text-slate-500 mt-1">{region.disease || "Monitoring active"}</p>
                        </div>
                      </div>
                      <div className="space-y-1 text-right">
                        <RiskBadge level={riskLevel} />
                        <p className={"text-xs uppercase tracking-[0.24em] " + tone.text}>Risk level</p>
                      </div>
                    </div>
                    <p className="mt-4 text-sm text-slate-600">{region.note || "Regional surveillance active."}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Signal summary</p>
                <h2 className="text-xl font-semibold text-slate-900 mt-2">What drives the risk score</h2>
              </div>
              <ShieldCheck className="text-slate-600" />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {myRegion && <>
                <div className="rounded-3xl border surface-risk p-4">
                  <div className="text-[12px] text-slate-500">Rainfall score</div>
                  <div className="mt-2 text-[18px] font-semibold text-danger">{myRegion.rainfall ?? "—"}</div>
                </div>
                <div className="rounded-3xl border surface-attention p-4">
                  <div className="text-[12px] text-slate-500">Humidity score</div>
                  <div className="mt-2 text-[18px] font-semibold text-warning">{myRegion.humidity ?? "—"}</div>
                </div>
              </>}
              <div className="rounded-3xl border surface-environment p-4">
                <div className="text-[12px] text-slate-500">Top disease</div>
                <div className="mt-2 text-[18px] font-semibold text-cyan">{myRegion?.disease || "—"}</div>
              </div>
              <div className="rounded-3xl border surface-status p-4">
                <div className="text-[12px] text-slate-500">Reporting cadence</div>
                <div className="mt-2 text-[18px] font-semibold text-success">Daily</div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-slate-500">All regions</p>
              <h2 className="text-xl font-semibold text-slate-900 mt-2">Network risk scores</h2>
            </div>
            <Activity className="text-brand" />
          </div>
          <div className="space-y-3">
            {(regions || []).map(r => (
              <div key={r.region} className="flex items-center justify-between gap-3 py-2 border-b border-line last:border-0">
                <div>
                  <p className="text-[13.5px] font-medium">{r.region}</p>
                  <p className="text-[12px] text-muted">{r.disease || "—"}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-brand to-indigo" style={{ width: `${r.risk}%` }} />
                  </div>
                  <span className="text-[13px] font-semibold tabular-nums w-8 text-right">{r.risk}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
