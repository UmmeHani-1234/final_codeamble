import { useAuth } from "../../context/AuthContext.jsx";
import useApi from "../../hooks/useApi.js";
import { getHospitalMe } from "../../services/api.js";

export default function Settings() {
  const { currentHospital } = useAuth();
  const { data: profile, loading, error } = useApi(getHospitalMe);

  if (loading) return <div className="card py-14 text-center text-muted text-[13.5px]">Loading profile…</div>;
  if (error)   return <div className="card py-14 text-center text-danger text-[13.5px]">{error}</div>;

  // Merge stored auth data with full profile from the API
  const h = profile || currentHospital || {};

  return (
    <div className="flex flex-col gap-5 max-w-[600px]">
      <div className="card">
        <span className="eyebrow">Hospital profile</span>
        <div className="flex flex-col gap-3.5 mt-4">
          <Field label="Hospital name"   value={h.name} />
          <Field label="Region"          value={h.region} />
          <Field label="Address"         value={h.address} />
          <Field label="Contact email"   value={h.email || h.contactEmail} />
          <Field label="Status"          value={h.status} />
          <Field label="Blockchain ID"   value={h.blockchainId || h.blockchain || "—"} />
          <Field label="Completeness"    value={h.completeness != null ? `${h.completeness}%` : undefined} />
          <Field label="Last activity"   value={h.lastActivity} />
          <Field label="Registered on"   value={
            h.createdAt ? new Date(h.createdAt).toLocaleDateString("en-IN") : h.registeredAt
          } />
        </div>
      </div>

      <div className="card">
        <span className="eyebrow">Account</span>
        <p className="text-muted text-[13px] mt-3">
          To update your hospital's name, region, or contact details, please contact the network administrator.
        </p>
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
