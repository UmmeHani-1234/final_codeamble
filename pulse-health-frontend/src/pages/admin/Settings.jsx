import { ShieldCheck, Building2, AlertTriangle, Users, Database, RefreshCcw } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import useApi from "../../hooks/useApi.js";
import { getAdminHospitals, getAdminAlerts, getAdminUsers } from "../../services/api.js";

function StatCard({ icon: Icon, label, value, tone = "brand" }) {
  const tones = {
    brand:   "bg-brand-tint text-brand",
    danger:  "bg-danger-tint text-danger",
    success: "bg-success-tint text-success",
    indigo:  "bg-indigo-tint text-indigo",
  };
  return (
    <div className="card !p-5 flex items-center gap-4">
      <span className={"icon-chip " + (tones[tone] || tones.brand)}><Icon size={18} /></span>
      <div>
        <div className="text-muted text-[11.5px] uppercase tracking-wide font-semibold">{label}</div>
        <div className="font-display text-[26px] font-semibold mt-0.5">{value ?? "—"}</div>
      </div>
    </div>
  );
}

function Field({ label, value }) {
  return (
    <label className="field-label">
      <span>{label}</span>
      <input className="field-input" value={value || "—"} readOnly />
    </label>
  );
}

export default function AdminSettings() {
  const { user } = useAuth();
  const { data: hospitals, loading: lh } = useApi(getAdminHospitals);
  const { data: alerts,    loading: la } = useApi(getAdminAlerts);
  const { data: users,     loading: lu } = useApi(getAdminUsers);

  const loading = lh || la || lu;

  const activeAlerts   = (alerts   || []).filter(a => a.risk === "High").length;
  const reportingCount = (hospitals || []).filter(h => h.status === "Reporting").length;

  return (
    <div className="flex flex-col gap-5 max-w-[700px]">
      {/* Admin account */}
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <div className="icon-chip"><ShieldCheck size={17} /></div>
          <div>
            <span className="eyebrow">Admin account</span>
            <p className="text-muted text-[12.5px] mt-0.5">Platform administrator credentials and identity.</p>
          </div>
        </div>
        <div className="flex flex-col gap-3.5">
          <Field label="Name"  value={user?.name} />
          <Field label="Email" value={user?.email} />
          <Field label="Role"  value="Network Administrator" />
        </div>
      </div>

      {/* Network stats */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <span className="eyebrow">Network snapshot</span>
          {loading && <RefreshCcw size={14} className="text-muted animate-spin" />}
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <StatCard icon={Building2}    label="Connected hospitals"  value={hospitals?.length ?? 0}  tone="indigo"  />
          <StatCard icon={RefreshCcw}   label="Actively reporting"   value={reportingCount}           tone="success" />
          <StatCard icon={AlertTriangle} label="High-priority alerts" value={activeAlerts}             tone="danger"  />
          <StatCard icon={Users}        label="Notification users"   value={users?.length ?? 0}       tone="brand"   />
        </div>
      </div>

      {/* Platform info */}
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <div className="icon-chip bg-indigo-tint text-indigo"><Database size={17} /></div>
          <div>
            <span className="eyebrow">Platform information</span>
            <p className="text-muted text-[12.5px] mt-0.5">Runtime and configuration details.</p>
          </div>
        </div>
        <div className="flex flex-col gap-3.5">
          <Field label="Platform"    value="Pulse Health — Epidemic Early Warning" />
          <Field label="API base"    value={import.meta.env.VITE_API_URL || "Not configured"} />
          <Field label="Environment" value={import.meta.env.MODE || "development"} />
        </div>
        <p className="text-muted text-[12.5px] mt-4">
          To update network settings, hospital access, or admin credentials, contact the platform team.
        </p>
      </div>
    </div>
  );
}
