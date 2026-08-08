import { Activity, AlertTriangle, Building2, CheckCircle2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { useAuth } from "../../context/AuthContext.jsx";
import { regionalRisk, flattenAllAlerts } from "../../data/mockData.js";
import KpiCard from "../../components/ui/KpiCard.jsx";
import { RiskBadge, StatusBadge } from "../../components/ui/Badge.jsx";

export default function AdminOverview() {
  const { hospitals, alertsByHospital } = useAuth();
  const allAlerts = flattenAllAlerts(hospitals, alertsByHospital);
  const highPriority = allAlerts.filter((a) => a.risk === "High").length;
  const avgCompleteness = Math.round(hospitals.reduce((s, h) => s + h.completeness, 0) / hospitals.length);

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard label="Organizations" value={hospitals.length} sub="hospitals connected" icon={Building2} />
        <KpiCard label="Active alerts" value={allAlerts.length} sub="across the network" icon={AlertTriangle} />
        <KpiCard label="High priority" value={highPriority} sub="needs attention" icon={Activity} />
        <KpiCard label="Network health" value={`${avgCompleteness}%`} sub="avg. reporting completeness" trend="up" icon={CheckCircle2} />
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-2.5">
          <span className="eyebrow">Regional risk comparison</span>
          <span className="text-muted text-[11.5px]">Updated 5 min ago</span>
        </div>
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={regionalRisk} barSize={28}>
              <CartesianGrid stroke="#EEF1F6" vertical={false} />
              <XAxis dataKey="region" tick={{ fontSize: 11.5, fill: "#5B6472" }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #EEF1F6", fontSize: 12 }} />
              <Bar dataKey="risk" fill="#2554E8" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1.3fr_1fr] gap-5">
        <div className="card">
          <span className="eyebrow">Top priority items — all hospitals</span>
          <table className="w-full border-collapse text-[13px] mt-3.5">
            <thead>
              <tr className="text-left">
                {["Disease", "Hospital", "Risk", "Status"].map((h) => (
                  <th key={h} className="pb-2.5 text-[11px] uppercase tracking-wide text-muted font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allAlerts.map((a) => (
                <tr key={a.id} className="table-row-hover">
                  <td className="py-3 border-t border-line">{a.disease}</td>
                  <td className="py-3 border-t border-line text-muted">{a.hospitalName}</td>
                  <td className="py-3 border-t border-line"><RiskBadge level={a.risk} /></td>
                  <td className="py-3 border-t border-line"><StatusBadge status={a.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card">
          <span className="eyebrow">System health</span>
          <div className="flex flex-col mt-3.5">
            <Row label="Data pipeline" value={<span className="badge-success">Operational</span>} first />
            <Row label="Last sync" value="3 min ago" />
            <Row label="Uptime (30d)" value={<span className="font-display font-semibold">99.98%</span>} />
            <Row label="Reporting orgs" value={`${hospitals.filter((h) => h.status === "Reporting").length} / ${hospitals.length}`} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, first }) {
  return (
    <div className={"flex justify-between py-2.5 text-[13px] " + (first ? "" : "border-t border-line")}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
