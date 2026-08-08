import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Activity, ArrowLeft } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";

const REGIONS = ["Mumbai", "Thane", "Navi Mumbai", "Pune", "Nashik", "Other"];

export default function RegisterHospital() {
  const { registerHospital } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", region: REGIONS[0], address: "", contactEmail: "" });
  const [submitting, setSubmitting] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.contactEmail) return;
    setSubmitting(true);
    // In a real app this would be an async API call.
    registerHospital(form);
    navigate("/hospital");
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-10">
      <div className="card w-full max-w-[520px] p-8">
        <Link to="/" className="flex items-center gap-1.5 text-muted text-[12.5px] w-fit">
          <ArrowLeft size={14} /> Back to site
        </Link>
        <span className="w-8 h-8 rounded-[9px] bg-brand text-white flex items-center justify-center my-3">
          <Activity size={17} />
        </span>
        <h1 className="font-display text-[24px] mt-1 mb-1">Register your hospital</h1>
        <p className="text-muted text-[13.5px] mb-6">
          This creates a dashboard scoped only to your hospital's own data —
          your alerts, your submissions, your reporting history.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="field-label">
            <span>Hospital name</span>
            <input
              className="field-input"
              placeholder="e.g. St. Xavier General"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              required
            />
          </label>

          <label className="field-label">
            <span>Region</span>
            <select className="field-input" value={form.region} onChange={(e) => update("region", e.target.value)}>
              {REGIONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </label>

          <label className="field-label">
            <span>Address</span>
            <input
              className="field-input"
              placeholder="Street, city"
              value={form.address}
              onChange={(e) => update("address", e.target.value)}
            />
          </label>

          <label className="field-label">
            <span>Contact email</span>
            <input
              type="email"
              className="field-input"
              placeholder="admin@yourhospital.org"
              value={form.contactEmail}
              onChange={(e) => update("contactEmail", e.target.value)}
              required
            />
          </label>

          <button className="btn-primary justify-center mt-2" disabled={submitting}>
            {submitting ? "Setting up your dashboard…" : "Create hospital dashboard"}
          </button>
        </form>

        <p className="text-center text-[12px] text-muted mt-5">
          Already registered? <Link to="/login" className="link">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
