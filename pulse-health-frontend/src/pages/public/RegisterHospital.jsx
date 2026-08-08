import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
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
    registerHospital(form);
    navigate("/hospital");
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="mx-auto w-full max-w-[480px] rounded-[32px] bg-white p-8 shadow-xl">
        <Link to="/" className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 mb-6">
          <ArrowLeft size={16} /> Back to home
        </Link>

        <div className="mb-6">
          <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">Create hospital account</p>
          <h1 className="mt-3 text-[22px] font-semibold text-slate-900">Register your hospital</h1>
          <p className="mt-2 text-[13.5px] text-slate-500 leading-6">Launch a hospital dashboard for your facility's alert and submission workflow.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <button className="btn-primary w-full py-3 text-sm font-semibold" disabled={submitting}>
            {submitting ? "Setting up your dashboard…" : "Create hospital dashboard"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already registered? <Link to="/login" className="font-semibold text-brand hover:text-brand-dark">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
