import {
  Activity, AlertTriangle, Building2, CheckCircle2, Database,
  RadioTower, Clock3, Network, TrendingUp, TrendingDown,
} from "lucide-react";
import { RiskBadge, StatusBadge } from "../../components/ui/Badge.jsx";
import { valueTone } from "../../utils/sectionStyles.js";
import useApi from "../../hooks/useApi.js";
import { getAdminHospitals, getAdminAlerts, getAdminRegional } from "../../services/api.js";

const RISK_RING = { High: "#C0324B", Medium: "#AD7A0A", Low: "#1E8E5A" };
const AVATAR_TINTS = ["bg-brand-tint text-brand","bg-indigo-tint text-indigo","bg-success-tint text-success","bg-warning-tint text-warning","bg-cyan-tint text-cyan"];
const TONE    = { brand:"bg-brand-tint text-brand", indigo:"bg-indigo-tint text-indigo", danger:"bg-danger-tint text-danger", warning:"bg-warning-tint text-warning", success:"bg-success-tint text-success" };
const SURFACE = { brand:"surface-action", indigo:"surface-regional", danger:"surface-risk", warning:"surface-attention", success:"surface-status" };

function avatarTint(name = "") {
  const h = [...name].reduce((s, c) => s + c.charCodeAt(0), 0);
  return AVATAR_TINTS[h % AVATAR_TINTS.length];
}

function KpiCard({ label, value, sub, trend, icon: Icon, tone = "brand", valueTone: vt = "" }) {
  return (
    <div className={"card !p-[18px] " + (SURFACE[tone] || SURFACE.brand)}>
      <div className="flex items-start justify-between">
        <span className="eyebrow">{label}</span>
        {Icon && <span className={"icon-chip " + (TONE[tone] || TONE.brand)}><Icon size={16} /></span>}
      </div>
      <div className={"font-display text-[28px] font-semibold mt-2.5 " + vt}>{value}</div>
      {sub && (
        <div className="flex items-center gap-1 text-[12px] text-muted mt-1.5">
          {trend === "up"   && <TrendingUp   size={13} className="text-success" />}
          {trend === "down" && <TrendingDown size={13} className="text-danger" />}
          <span>{sub}</span>
        </div>
      )}
    </div>
  );
}

function Gauge({ value, risk, size = 92 }) {
  const stroke = 8, r = (size - stroke) / 2, c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={r} stroke="#EEF1F6" strokeWidth={stroke} fill="none" />
        <circle cx={size/2} cy={size/2} r={r} stroke={RISK_RING[risk] || "#2554E8"} strokeWidth={stroke} fill="none"
          strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round" style={{ transition: "stroke-dashoffset .6s ease" }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-[22px] font-semibold leading-none">{value}%</span>
      </div>
    </div>
  );
}

const riskSurface = r => r === "High" ? "surface-risk" : r === "Medium" ? "surface-attention" : "surface-status";

export default function AdminOverview() {
  const { data: hospitals, loading: lh } = useApi(getAdminHospitals);
  const { data: allAlerts, loading: la } = useApi(getAdminAlerts);
  const { data: regions,   loading: lr } = useApi(getAdminRegional);

  if (lh || la || lr) return <div className="card py-14 text-center text-muted text-[13.5px]">Loading dashboard…</div>;

  const highPriority  = (allAlerts || []).filter(a => a.risk === "High").length;
  const avgComplete   = hospitals?.length ? Math.round(hospitals.reduce((s, h) => s + (h.completeness || 0), 0) / hospitals.length) : 0;
  const reportingCnt  = (hospitals || []).filter(h => h.status === "Reporting").length;
  const topAlert      = [...(allAlerts || [])].sort((a, b) => b.probability - a.probability)[0];
  const maxRisk       = regions?.length ? Math.max(...regions.map(r => r.risk)) : 0;

  return (
    <div className="flex flex-col gap-5">
      {topAlert && (
        <div className={"card relative overflow-hidden !p-0 " + riskSurface(topAlert.risk)}>
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
        <KpiCard label="Organizations" value={hospitals?.length ?? 0}  sub="hospitals connected"         icon={Building2}   tone="indigo"  valueTone={valueTone("Organizations")} />
        <KpiCard label="Active alerts" value={allAlerts?.length ?? 0}  sub="across the network"          icon={AlertTriangle} tone="danger" valueTone={valueTone("Active alerts")} />
        <KpiCard label="High priority" value={highPriority}            sub="needs attention"             icon={Activity}    tone="warning" valueTone={valueTone("High priority")} />
        <KpiCard label="Network health" value={`${avgComplete}%`}       sub="avg. reporting completeness" icon={CheckCircle2} tone="success" trend="up" valueTone={valueTone("Network health")} />
      </div>

      {regions?.length > 0 && (
        <div className="card surface-regional">
          <div className="flex items-center justify-between mb-2.5">
            <span className="eyebrow">Regional risk comparison</span>
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-danger-tint text-danger">
              Highest: {regions.find(r => r.risk === maxRisk)?.region} · {maxRisk}%
            </span>
          </div>
          <div className="h-[220px] grid grid-cols-[repeat(auto-fit,minmax(44px,1fr))] items-end gap-3 pt-4 border-b border-line">
            {regions.map(r => (
              <div key={r.region} className="h-full min-w-0 flex flex-col items-center justify-end gap-2">
                <span className="text-[11px] text-muted font-medium">{r.risk}%</span>
                <div className="w-full max-w-8 rounded-t-lg transition-[height] duration-500"
                  style={{ height: `${r.risk}%`, background: r.risk === maxRisk ? "#2554E8" : "#B9C7F5" }}
                  title={`${r.region}: ${r.risk}% risk`} aria-label={`${r.region}: ${r.risk}% risk`} role="img" />
                <span className="w-full truncate text-center text-[11.5px] text-muted">{r.region}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-[1.3fr_1fr] gap-5">
        <div className="card surface-status">
          <span className="eyebrow">Top priority items — all hospitals</span>
          <table className="w-full border-collapse text-[13px] mt-3.5">
            <thead>
              <tr className="text-left">
                {["Disease", "Hospital", "Risk", "Status"].map(h => (
                  <th key={h} className="pb-2.5 text-[11px] uppercase tracking-wide text-muted font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(allAlerts || []).slice(0, 10).map(a => (
                <tr key={a._id} className="table-row-hover">
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
            <HealthRow icon={Database}   label="Data pipeline"   value={<span className="badge-success">Operational</span>} first />
            <HealthRow icon={RadioTower} label="Last sync"       value="Just now" />
            <HealthRow icon={Clock3}     label="Uptime (30d)"    value={<span className="font-display font-semibold">99.98%</span>} />
            <HealthRow icon={Network}    label="Reporting orgs"  value={`${reportingCnt} / ${hospitals?.length ?? 0}`} />
          </div>
        </div>
      </div>
    </div>
  );
}

function HealthRow({ icon: Icon, label, value, first }) {
  return (
    <div className={"flex items-center justify-between py-2.5 text-[13px] " + (first ? "" : "border-t border-line")}>
      <span className="flex items-center gap-2 text-secondary"><Icon size={14} className="text-muted" /> {label}</span>
      <span>{value}</span>
    </div>
  );
}
