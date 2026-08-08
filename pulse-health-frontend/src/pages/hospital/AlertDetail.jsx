import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, TrendingUp, Building2, CloudRain, Droplets, MapPin,
  Sparkles, Phone, MessageSquare, Clock, Hash,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { RiskBadge } from "../../components/ui/Badge.jsx";
import useApi from "../../hooks/useApi.js";
import { getHospitalAlert, patchAlertStatus } from "../../services/api.js";
import { useState } from "react";

const FACTOR_STYLE = {
  "Recent disease activity": { icon: TrendingUp, tint: "bg-danger-tint text-danger" },
  "Hospital admissions":     { icon: Building2,  tint: "bg-brand-tint text-brand" },
  "Regional activity":       { icon: MapPin,     tint: "bg-indigo-tint text-indigo" },
  "Rainfall":                { icon: CloudRain,  tint: "bg-cyan-tint text-cyan" },
  "Humidity":                { icon: Droplets,   tint: "bg-cyan-tint text-cyan" },
};

const RISK_RING    = { High: "#C0324B", Medium: "#AD7A0A", Low: "#1E8E5A" };
const RISK_SURFACE = { High: "surface-risk", Medium: "surface-attention", Low: "surface-status" };

function Gauge({ value, risk }) {
  const size = 108, stroke = 9;
  const r = (size - stroke) / 2, c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={r} stroke="#EEF1F6" strokeWidth={stroke} fill="none" />
        <circle cx={size/2} cy={size/2} r={r} stroke={RISK_RING[risk] || "#2554E8"} strokeWidth={stroke} fill="none"
          strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset .6s ease" }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-[26px] font-semibold leading-none">{value}%</span>
        <span className="text-[10px] text-muted mt-1">probability</span>
      </div>
    </div>
  );
}

export default function AlertDetail() {
  const { id } = useParams();
  const { currentHospital } = useAuth();
  const navigate = useNavigate();
  const { data: alert, loading, error, refetch } = useApi(() => getHospitalAlert(id), [id]);
  const [updating, setUpdating] = useState(false);

  async function handleStatus(status) {
    setUpdating(true);
    try { await patchAlertStatus(id, status); await refetch(); } finally { setUpdating(false); }
  }

  if (loading) return <div className="card py-14 text-center text-muted text-[13.5px]">Loading alert…</div>;
  if (error || !alert) return (
    <div className="card text-center py-14">
      <h3 className="font-display text-[18px] mb-1">Alert not found</h3>
      <p className="text-muted text-[13.5px] mb-4">This alert doesn't belong to your hospital or no longer exists.</p>
      <button className="btn-ghost" onClick={() => navigate("/hospital/alerts")}>Back to alerts</button>
    </div>
  );

  const topFactors = (alert.evidenceFactors || []).slice(0, 2).map(f => f.label);

  return (
    <div className="flex flex-col gap-5">
      <button className="flex items-center gap-1.5 text-muted text-[12.5px] w-fit hover:text-ink transition-colors"
        onClick={() => navigate("/hospital/alerts")}>
        <ArrowLeft size={14} /> Back to alerts
      </button>

      <div className="grid lg:grid-cols-[1.6fr_1fr] gap-5 items-start">
        <div className="flex flex-col gap-5">
          <div className={"card relative overflow-hidden !p-0 " + (RISK_SURFACE[alert.risk] || "surface-action")}>
            <div className="p-6 flex items-center justify-between gap-6 flex-wrap">
              <div>
                <RiskBadge level={alert.risk} />
                <h2 className="font-display text-[28px] font-semibold mt-2.5 mb-1">{alert.disease}</h2>
                <p className="text-muted text-[13.5px] m-0 flex items-center gap-1.5">
                  <Building2 size={13} /> {currentHospital?.name}
                  <span className="text-line">·</span>
                  <Clock size={13} /> {alert.window}
                </p>
                <div className="flex gap-2 mt-4 flex-wrap">
                  {topFactors.map((f, i) => (
                    <span key={f} className={"text-[11px] font-semibold px-2.5 py-1 rounded-full " +
                      (i === 0 ? "bg-danger-tint text-danger" : "bg-indigo-tint text-indigo")}>{f}</span>
                  ))}
                </div>
              </div>
              <Gauge value={alert.probability} risk={alert.risk} />
            </div>
          </div>

          <div className="card">
            <span className="eyebrow">Evidence</span>
            <div className="flex flex-col gap-3.5 mt-4">
              {(alert.evidenceFactors || []).map(({ label, score }) => {
                const style = FACTOR_STYLE[label] || { icon: TrendingUp, tint: "bg-slate-100 text-secondary" };
                const Icon = style.icon;
                return (
                  <div key={label} className="flex items-center gap-3">
                    <span className={"w-8 h-8 rounded-[10px] flex items-center justify-center flex-shrink-0 " + style.tint}><Icon size={15} /></span>
                    <span className="w-[150px] flex-shrink-0 text-[13px] text-secondary">{label}</span>
                    <div className="flex-1 h-[7px] bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-brand to-indigo" style={{ width: `${score}%` }} />
                    </div>
                    <span className="w-9 text-right text-[12px] tabular-nums text-muted">{score}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          {alert.aiExplanation && (
            <div className="card">
              <div className="flex items-center gap-2 mb-1">
                <span className="icon-chip !w-7 !h-7"><Sparkles size={13} /></span>
                <span className="eyebrow">AI explanation</span>
              </div>
              <p className="text-[13.5px] leading-relaxed mt-2 text-secondary">{alert.aiExplanation}</p>
            </div>
          )}

          <div className="flex gap-2.5 justify-end flex-wrap">
            <button className="btn-ghost" disabled={updating} onClick={() => handleStatus("Monitoring")}>Continue monitoring</button>
            <button className="btn-danger" disabled={updating} onClick={() => handleStatus("Dismissed")}>Dismiss</button>
            <button className="btn-primary" disabled={updating} onClick={() => handleStatus("Confirmed")}>Confirm &amp; notify</button>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div className="card">
            <span className="eyebrow">Quick facts</span>
            <div className="flex flex-col mt-3.5">
              <FactRow icon={Hash}     label="Alert code"        value={alert.alertCode}  first />
              <FactRow icon={MapPin}   label="Region"            value={currentHospital?.region} />
              <FactRow icon={Clock}    label="Detection window"  value={alert.window} />
              <FactRow icon={Sparkles} label="First detected"    value={alert.detectedOn ? new Date(alert.detectedOn).toLocaleDateString('en-IN') : "—"} />
            </div>
          </div>

          <div className="card surface-action">
            <span className="eyebrow">Notify &amp; coordinate</span>
            <p className="text-[12.5px] text-muted mt-2 mb-4 leading-relaxed">
              Escalate this signal to the regional health office or loop in your care team.
            </p>
            <button className="btn-primary w-full justify-center mb-2"><Phone size={14} /> Notify regional office</button>
            <button className="btn-info w-full justify-center"><MessageSquare size={14} /> Message care team</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FactRow({ icon: Icon, label, value, first }) {
  return (
    <div className={"flex items-center justify-between py-2.5 text-[13px] " + (first ? "" : "border-t border-line")}>
      <span className="flex items-center gap-2 text-muted"><Icon size={13} /> {label}</span>
      <span className="font-medium">{value || "—"}</span>
    </div>
  );
}
