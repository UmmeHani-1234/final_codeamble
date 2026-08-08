import { MapPin, Activity, ShieldCheck } from "lucide-react";
import { useMemo } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { regionalRisk } from "../../data/mockData.js";
import { RiskBadge } from "../../components/ui/Badge.jsx";

export default function HospitalRegional() {
  const { currentHospital } = useAuth();
  const nearbyRegions = useMemo(
    () => [...regionalRisk].sort((a, b) => b.risk - a.risk).slice(0, 5),
    []
  );

  return (
    <div className="grid gap-6">
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Regional intelligence</p>
            <h1 className="text-3xl font-semibold text-slate-900 mt-2">Overview for {currentHospital?.region}</h1>
            <p className="mt-3 text-sm text-slate-500 max-w-2xl">
              Compare nearby districts and early warning signals so your hospital can prioritize response and reporting.
            </p>
          </div>
          <div className="rounded-3xl bg-slate-50 px-5 py-4 text-slate-700 shadow-sm">
            <div className="text-xs uppercase tracking-[0.32em] text-slate-500">Your region</div>
            <div className="mt-2 text-xl font-semibold text-slate-900">{currentHospital?.region}</div>
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="grid gap-5">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Regional risk map</p>
                <h2 className="text-xl font-semibold text-slate-900 mt-2">Most impacted areas</h2>
              </div>
              <MapPin className="text-blue-600" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {nearbyRegions.map((region) => (
                <div key={region.region} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{region.region}</p>
                      <p className="text-sm text-slate-500 mt-1">More prone to any viral disease</p>
                    </div>
                    <div className="space-y-1 text-right">
                      <RiskBadge level={region.risk > 75 ? "High" : region.risk > 45 ? "Medium" : "Low"} />
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Risk level</p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-slate-600">{region.note}</p>
                </div>
              ))}
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
            <div className="space-y-3">
              <p className="text-sm text-slate-600 leading-relaxed">
                Regional intelligence combines disease incidence, meteorological hazards, and hospital surveillance to give you transparent, actionable risk context.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-3xl bg-slate-50 p-4">
                  <div className="text-sm text-slate-500">Recent activity</div>
                  <div className="mt-2 text-lg font-semibold text-slate-900">Increasing</div>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4">
                  <div className="text-sm text-slate-500">Nearby alerts</div>
                  <div className="mt-2 text-lg font-semibold text-slate-900">4</div>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4">
                  <div className="text-sm text-slate-500">Environmental risk</div>
                  <div className="mt-2 text-lg font-semibold text-slate-900">Moderate</div>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4">
                  <div className="text-sm text-slate-500">Reporting cadence</div>
                  <div className="mt-2 text-lg font-semibold text-slate-900">Daily</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Regional alerts</p>
              <h2 className="text-xl font-semibold text-slate-900 mt-2">Early signals for your network</h2>
            </div>
            <Activity className="text-blue-600" />
          </div>
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              This view helps hospital teams interpret risk drivers and coordinate with district surveillance for faster review and confirmation.
            </p>
            <div className="rounded-3xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Top signal</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">Navi Mumbai — Leptospirosis</p>
              <p className="mt-2 text-sm text-slate-600">Flooded areas and rising contamination risk have raised alert status in adjacent districts.</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Recommended action</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">Verify patient admission trends and submit updated case counts.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
