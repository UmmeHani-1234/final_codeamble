import { useState } from "react";
import { MapPin } from "lucide-react";
import useApi from "../../hooks/useApi.js";
import { getAdminRegional } from "../../services/api.js";

export default function Regional() {
  const { data: regions, loading, error } = useApi(getAdminRegional);
  const [selected, setSelected] = useState(null);

  const selectedRegion = regions?.find(r => r.region === selected) || regions?.[0];

  if (loading) return <div className="card py-14 text-center text-muted text-[13.5px]">Loading regional data…</div>;
  if (error)   return <div className="card py-14 text-center text-danger text-[13.5px]">{error}</div>;

  return (
    <div className="flex flex-col gap-5">
      <div className="card">
        <div className="flex items-start gap-3">
          <div className="icon-chip"><MapPin size={18} /></div>
          <div>
            <span className="eyebrow">Regional risk summary</span>
            <h1 className="font-display text-[22px] mt-2 text-indigo">Current area alerts and disease risk levels</h1>
            <p className="text-muted text-[13.5px] mt-2">View the latest disease risk for each monitored region, including the top alert for the area.</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-5">
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <span className="eyebrow">Risk rankings</span>
            <span className="text-muted text-[11.5px]">Live data</span>
          </div>
          <div className="space-y-3">
            {(regions || []).map(r => (
              <button key={r.region} type="button"
                onClick={() => setSelected(r.region)}
                className={"w-full text-left flex items-center justify-between gap-4 rounded-2xl p-4 transition-all " +
                  (selectedRegion?.region === r.region
                    ? "bg-brand-tint border border-brand"
                    : "bg-slate-50/80 hover:bg-slate-100")}>
                <div>
                  <div className="font-semibold">{r.region}</div>
                  <div className="text-muted text-[12px]">{r.disease || "Monitoring"}</div>
                </div>
                <div className={"font-display text-[22px] font-semibold " +
                  (r.risk >= 75 ? "text-danger" : r.risk >= 45 ? "text-warning" : "text-indigo")}>{r.risk}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <span className="eyebrow">Area threat details</span>
            <span className="text-muted text-[11.5px]">Selected region</span>
          </div>
          {selectedRegion && (
            <div className="rounded-2xl border border-line p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-semibold">{selectedRegion.region}</div>
                  <div className="text-muted text-[12px]">{selectedRegion.disease || "—"} risk</div>
                </div>
                <span className={"badge " +
                  (selectedRegion.risk > 75 ? "badge-danger" : selectedRegion.risk > 45 ? "badge-warning" : "badge-success")}>
                  {selectedRegion.risk > 75 ? "High" : selectedRegion.risk > 45 ? "Medium" : "Low"}
                </span>
              </div>
              <p className="text-[13px] text-muted mt-3">{selectedRegion.note || "Regional surveillance is active."}</p>
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="rounded-xl bg-slate-50 p-3">
                  <div className="text-[11px] text-muted uppercase tracking-wide">Risk score</div>
                  <div className="text-[18px] font-semibold mt-1">{selectedRegion.risk}%</div>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <div className="text-[11px] text-muted uppercase tracking-wide">Rainfall</div>
                  <div className="text-[18px] font-semibold mt-1">{selectedRegion.rainfall ?? "—"}</div>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <div className="text-[11px] text-muted uppercase tracking-wide">Humidity</div>
                  <div className="text-[18px] font-semibold mt-1">{selectedRegion.humidity ?? "—"}</div>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <div className="text-[11px] text-muted uppercase tracking-wide">Disease</div>
                  <div className="text-[14px] font-semibold mt-1">{selectedRegion.disease || "—"}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
