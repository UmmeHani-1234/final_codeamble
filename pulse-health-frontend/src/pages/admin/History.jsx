import { Clock } from "lucide-react";
import { RiskBadge } from "../../components/ui/Badge.jsx";
import useApi from "../../hooks/useApi.js";
import { getAdminAlerts, getAdminRegional } from "../../services/api.js";

export default function History() {
  const { data: allAlerts, loading: la } = useApi(getAdminAlerts);
  const { data: regions,   loading: lr } = useApi(getAdminRegional);

  if (la || lr) {
    return <div className="card py-14 text-center text-muted text-[13.5px]">Loading report…</div>;
  }

  const dengueCount       = (allAlerts || []).filter(a => a.disease?.toLowerCase() === "dengue").length;
  const chikungunyaCount  = (allAlerts || []).filter(a => a.disease?.toLowerCase() === "chikungunya").length;
  const topRegion         = (regions || []).reduce(
    (best, cur) => (cur.risk > (best?.risk ?? 0) ? cur : best),
    regions?.[0] ?? null,
  );

  const hospitalCount = [...new Set((allAlerts || []).map(a => a.hospitalId).filter(Boolean))].length;

  const summaryItems = [
    {
      label: "Most at-risk region",
      value: topRegion?.region ?? "—",
      note: topRegion
        ? `${topRegion.region} shows the highest current risk for ${topRegion.disease || "disease activity"}.`
        : "No regional data available.",
      tone: "text-indigo",
    },
    {
      label: "Leading disease signal",
      value: dengueCount >= chikungunyaCount ? (dengueCount > 0 ? "Dengue" : "—") : "Chikungunya",
      note: dengueCount >= chikungunyaCount
        ? "Dengue is the dominant alert signal in the current dataset."
        : "Chikungunya alerts are more frequent across monitored hospitals.",
      tone: "text-danger",
    },
    {
      label: "Hospitals analysed",
      value: hospitalCount || (allAlerts?.length ? "All" : 0),
      note: `${hospitalCount || "All"} hospitals contributed to this generated report.`,
      tone: "text-success",
    },
  ];

  const findings = [
    topRegion
      ? `Analysis of hospital submissions and alerts indicates ${topRegion.region} is currently the most at-risk region for ${topRegion.disease || "disease activity"}.`
      : "No regional risk data is currently available.",
    dengueCount > chikungunyaCount
      ? "Dengue is currently the more prevalent threat across the network."
      : dengueCount === 0 && chikungunyaCount === 0
        ? "No disease signal data is available yet — submit surveillance data to generate a report."
        : "Chikungunya is currently the more prevalent threat across the network.",
    "The report combines alert probabilities, active status flags, and regional threat data to identify which areas need attention next.",
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="card">
        <div className="flex items-center gap-3">
          <div className="icon-chip"><Clock size={18} /></div>
          <div>
            <span className="eyebrow">History &amp; reports</span>
            <h1 className="font-display text-[22px] mt-2 text-indigo">Generated risk report</h1>
            <p className="text-muted text-[13.5px] mt-2">
              This report is generated from analysis of hospital alert signals, regional risk trends, and city-level activity.
            </p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {summaryItems.map(item => (
          <div key={item.label} className="card">
            <div className="text-muted text-[12px] uppercase tracking-wide font-semibold mb-2">{item.label}</div>
            <div className={`font-display text-[24px] font-semibold ${item.tone}`}>{item.value}</div>
            <p className="text-[13px] text-muted mt-3">{item.note}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-5">
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <span className="eyebrow">Key findings</span>
            <span className="text-muted text-[11.5px]">Based on current network alerts</span>
          </div>
          <div className="space-y-3">
            {findings.map(text => (
              <p key={text} className="text-[13.5px] text-secondary">• {text}</p>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <span className="eyebrow">Current threat breakdown</span>
            <span className="text-muted text-[11.5px]">Risk status by region</span>
          </div>
          {!(regions?.length) ? (
            <p className="text-muted text-[13px]">No regional data available.</p>
          ) : (
            <div className="space-y-3">
              {regions.map(r => (
                <div key={r.region} className="rounded-2xl border border-line p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="font-semibold">{r.region}</div>
                      <div className="text-muted text-[12px]">{r.disease || "Monitoring"}</div>
                    </div>
                    <RiskBadge level={r.risk > 75 ? "High" : r.risk > 45 ? "Medium" : "Low"} />
                  </div>
                  <p className="text-[13px] text-muted mt-3">{r.note || "Regional surveillance is active."}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
