import { useState } from "react";
import { MapPin } from "lucide-react";
import { regionalRisk, regionalThreats } from "../../data/mockData.js";

export default function Regional() {
  const [selectedRegion, setSelectedRegion] = useState(regionalThreats[0]?.region);
  const selectedThreat = regionalThreats.find((item) => item.region === selectedRegion) || regionalThreats[0];

  return (
    <div className="flex flex-col gap-5">
      <div className="card">
        <div className="flex items-start gap-3">
          <div className="icon-chip"><MapPin size={18} /></div>
          <div>
            <span className="eyebrow">Regional risk summary</span>
            <h1 className="font-display text-[22px] mt-2">Current area alerts and disease risk levels</h1>
            <p className="text-muted text-[13.5px] mt-2">View the latest disease risk for each monitored region, including the top alert for the area.</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-5">
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <span className="eyebrow">Risk rankings</span>
            <span className="text-muted text-[11.5px]">Updated 5 min ago</span>
          </div>
          <div className="space-y-3">
            {regionalRisk.map((region) => (
              <button
                key={region.region}
                type="button"
                onClick={() => setSelectedRegion(region.region)}
                className={
                  "w-full text-left flex items-center justify-between gap-4 rounded-2xl p-4 transition-all " +
                  (selectedRegion === region.region
                    ? "bg-brand-tint border border-brand"
                    : "bg-slate-50/80 hover:bg-slate-100")
                }
              >
                <div>
                  <div className="font-semibold">{region.region}</div>
                  <div className="text-muted text-[12px]">Overall risk score</div>
                </div>
                <div className="font-display text-[22px] font-semibold">{region.risk}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <span className="eyebrow">Area threat details</span>
            <span className="text-muted text-[11.5px]">Selected region risk</span>
          </div>
          <div className="rounded-2xl border border-line p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="font-semibold">{selectedThreat.region}</div>
                <div className="text-muted text-[12px]">{selectedThreat.disease} risk</div>
              </div>
              <span className={
                "badge " +
                (selectedThreat.risk === "High" ? "badge-danger" : selectedThreat.risk === "Medium" ? "badge-warning" : "badge-success")
              }>
                {selectedThreat.risk}
              </span>
            </div>
            <p className="text-[13px] text-muted mt-3">{selectedThreat.note}</p>
            <div className="mt-4 text-[13px] text-secondary">
              For this area, {selectedThreat.disease} is {selectedThreat.risk.toLowerCase()} risk.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
