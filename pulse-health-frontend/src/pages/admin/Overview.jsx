import {
  Activity, AlertTriangle, Building2, CheckCircle2, Database,
  RadioTower, Clock3, Network, TrendingUp, TrendingDown,
} from "lucide-react";
import { BarChart, Bar, Cell, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { useAuth } from "../../context/AuthContext.jsx";
import { regionalRisk, flattenAllAlerts } from "../../data/mockData.js";
import { RiskBadge, StatusBadge } from "../../components/ui/Badge.jsx";

const RISK_RING = { High: "#C0324B", Medium: "#AD7A0A", Low: "#1E8E5A" };
const AVATAR_TINTS = ["bg-brand-tint text-brand", "bg-indigo-tint text-indigo", "bg-success-tint text-success", "bg-warning-tint text-warning"];
const TONE = {
  brand: "bg-brand-tint text-brand",
  indigo: "bg-indigo-tint text-indigo",
  danger: "bg-danger-tint text-danger",
  warning: "bg-warning-tint text-warning",
  success: "bg-success-tint text-success",
};

function avatarTint(name = "") {
  const hash = [...name].reduce((s, c) => s + c.charCodeAt(0), 0);
  return AVATAR_TINTS[hash % AVATAR_TINTS.length];
}

function KpiCard({ label, value, sub, trend, icon: Icon, tone = "brand" }) {
  return (
    <div className="card !p-[18px]">
      <div className="flex items-start justify-between">
        <span className="eyebrow">{label}</span>
        {Icon && (
          <span className={"icon-chip " + (TONE[tone] || TONE.brand)}>
            <Icon size={16} />
          </span>
        )}
      </div>
      <div className="font-display text-[28px] font-semibold mt-2.5">{value}</div>
      {sub && (
        <div className="flex items-center gap-1 text-[12px] text-muted mt-1.5">
          {trend === "up" && <TrendingUp size={13} className="text-success" />}
          {trend === "down" && <TrendingDown size={13} className="text-danger" />}
          <span>{sub}</span>
        </div>
      )}
    </div>
  );
}

function Gauge({ value, risk, size = 92 }) {
  const stroke = 8;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  const color = RISK_RING[risk] || "#2554E8";

  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="#EEF1F6" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          stroke={color} strokeWidth={stroke} fill="none"
          strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset .6s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-[22px] font-semibold leading-none">{value}%</span>
      </div>
    </div>
  );
}

export default function AdminOverview() {
  const { hospitals, alertsByHospital } = useAuth();
  const allAlerts = flattenAllAlerts(hospitals, alertsByHospital);
  const highPriority = allAlerts.filter((a) => a.risk === "High").length;
  const avgCompleteness = Math.round(hospitals.reduce((s, h) => s + h.completeness, 0) / hospitals.length);
  const reportingCount = hospitals.filter((h) => h.status === "Reporting").length;

  const topAlert = [...allAlerts].sort((a, b) => b.probability - a.probability)[0];
  const maxRisk = Math.max(...regionalRisk.map((r) => r.risk));

  return (
    <div className="flex flex-col gap-5">
      {/* Hero: the single most important thing happening across the network */}
      {topAlert && (
        <div className="card relative overflow-hidden !p-0">
          <div
            className="h-1.5 w-full"
            style={{ background: `linear-gradient(90deg, ${RISK_RING[topAlert.risk] || "#2554E8"}, #6C5CE7)` }}
          />
          <div className="p-6 flex items-center justify-between gap-6 flex-wrap">
            <div>
              <span className="eyebrow">Highest network priority</span>
              <div className="flex items-center gap-2 mt-2.5 mb-1">
                <RiskBadge level={topAlert.risk} />
                <StatusBadge status={topAlert.status} />
              </div>
              <h2 className="font-display text-[26px] font-semibold mt-1 mb-1">{topAlert.disease}</h2>
              <p className="text-muted text-[13.5px] m-0 flex items-center gap-1.5">
                <Building2 size={13} /> {topAlert.hospitalName}
                <span className="text-line">·</span>
                {topAlert.window}
              </p>
            </div>
            <Gauge value={topAlert.probability} risk={topAlert.risk} />
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard label="Organizations" value={hospitals.length} sub="hospitals connected" icon={Building2} tone="indigo" />
        <KpiCard label="Active alerts" value={allAlerts.length} sub="across the network" icon={AlertTriangle} tone="danger" />
        <KpiCard label="High priority" value={highPriority} sub="needs attention" icon={Activity} tone="warning" />
        <KpiCard label="Network health" value={`${avgCompleteness}%`} sub="avg. reporting completeness" trend="up" icon={CheckCircle2} tone="success" />
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-2.5">
          <span className="eyebrow">Regional risk comparison</span>
          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-danger-tint text-danger">
            Highest: {regionalRisk.find((r) => r.risk === maxRisk)?.region} · {maxRisk}%
          </span>
        </div>
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={regionalRisk} barSize={28}>
              <CartesianGrid stroke="#EEF1F6" vertical={false} />
              <XAxis dataKey="region" tick={{ fontSize: 11.5, fill: "#5B6472" }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #EEF1F6", fontSize: 12 }} />
              <Bar dataKey="risk" radius={[8, 8, 0, 0]}>
                {regionalRisk.map((r) => (
                  <Cell key={r.region} fill={r.risk === maxRisk ? "#2554E8" : "#B9C7F5"} />
                ))}
              </Bar>
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
                  <td className="py-3 border-t border-line">
                    <span className="flex items-center gap-2">
                      <span className={"w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 " + avatarTint(a.hospitalName)}>
                        {a.hospitalName?.[0] || "?"}
                      </span>
                      <span className="text-muted">{a.hospitalName}</span>
                    </span>
                  </td>
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
            <HealthRow icon={Database} label="Data pipeline" value={<span className="badge-success">Operational</span>} first />
            <HealthRow icon={RadioTower} label="Last sync" value="3 min ago" />
            <HealthRow icon={Clock3} label="Uptime (30d)" value={<span className="font-display font-semibold">99.98%</span>} />
            <HealthRow icon={Network} label="Reporting orgs" value={`${reportingCount} / ${hospitals.length}`} />
          </div>
        </div>
      </div>
    </div>
  );
}

function HealthRow({ icon: Icon, label, value, first }) {
  return (
    <div className={"flex items-center justify-between py-2.5 text-[13px] " + (first ? "" : "border-t border-line")}>
      <span className="flex items-center gap-2 text-secondary">
        <Icon size={14} className="text-muted" /> {label}
      </span>
      <span>{value}</span>
    </div>
  );
}