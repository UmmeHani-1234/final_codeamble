import { useMemo } from "react";
import { Clock } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { flattenAllAlerts, regionalThreats } from "../../data/mockData.js";
import { RiskBadge } from "../../components/ui/Badge.jsx";

export default function History() {
  const { hospitals, alertsByHospital } = useAuth();
  const allAlerts = useMemo(
    () => flattenAllAlerts(hospitals, alertsByHospital),
    [hospitals, alertsByHospital]
  );

  const dengueCount = allAlerts.filter((alert) => alert.disease.toLowerCase() === "dengue").length;
  const chikungunyaCount = allAlerts.filter((alert) => alert.disease.toLowerCase() === "chikungunya").length;
  const topRegion = regionalThreats.reduce((best, current) => (current.risk === "High" ? current : best), regionalThreats[0]);

  const summaryItems = [
    {
      label: "Most at-risk region",
      value: topRegion.region,
      note: `${topRegion.region} shows the highest current risk for ${topRegion.disease}.`,
    },
    {
      label: "Leading disease signal",
      value: dengueCount >= chikungunyaCount ? "Dengue" : "Chikungunya",
      note: dengueCount >= chikungunyaCount
        ? "Dengue is the dominant alert signal in the current dataset."
        : "Chikungunya alerts are more frequent across monitored hospitals.",
    },
    {
      label: "Hospitals analyzed",
      value: hospitals.length,
      note: `${hospitals.length} hospitals across cities and regions contributed to this report.`,
    },
  ];

  const findings = [
    `Analysis of hospital submissions and alerts indicates ${topRegion.region} is currently the most at-risk region for ${topRegion.disease}.`,
    dengueCount > chikungunyaCount
      ? "Dengue is currently the more prevalent threat across the network."
      : "Chikungunya is currently the more prevalent threat across the network.",
    "The report combines alert probabilities, active status flags, and regional threat data to identify which areas need attention next.",
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="card">
        <div className="flex items-center gap-3">
          <div className="icon-chip"><Clock size={18} /></div>
          <div>
            <span className="eyebrow">History & reports</span>
            <h1 className="font-display text-[22px] mt-2">Generated risk report</h1>
            <p className="text-muted text-[13.5px] mt-2">
              This report is generated from analysis of hospital alert signals, regional risk trends, and city-level activity.
            </p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {summaryItems.map((item) => (
          <div key={item.label} className="card">
            <div className="text-muted text-[12px] uppercase tracking-wide font-semibold mb-2">{item.label}</div>
            <div className="font-display text-[24px] font-semibold">{item.value}</div>
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
            {findings.map((text) => (
              <p key={text} className="text-[13.5px] text-secondary">• {text}</p>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <span className="eyebrow">Current threat breakdown</span>
            <span className="text-muted text-[11.5px]">Risk status by region</span>
          </div>
          <div className="space-y-3">
            {regionalThreats.map((threat) => (
              <div key={threat.region} className="rounded-2xl border border-line p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-semibold">{threat.region}</div>
                    <div className="text-muted text-[12px]">{threat.disease}</div>
                  </div>
                  <RiskBadge level={threat.risk} />
                </div>
                <p className="text-[13px] text-muted mt-3">{threat.note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
