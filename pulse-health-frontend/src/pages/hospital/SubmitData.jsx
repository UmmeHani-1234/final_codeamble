import { useState } from "react";
import { Upload } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import useApi from "../../hooks/useApi.js";
import { getHospitalSubmissions, postSubmission } from "../../services/api.js";

const FIELDS = [
  { key: "suspectedCases",  label: "Suspected cases",    type: "number" },
  { key: "confirmedCases",  label: "Confirmed cases",    type: "number" },
  { key: "admissions",      label: "Hospital admissions",type: "number" },
  { key: "testsConducted",  label: "Tests conducted",    type: "number" },
  { key: "positiveTests",   label: "Positive tests",     type: "number" },
  { key: "icuAdmissions",   label: "ICU admissions",     type: "number" },
];

const DISEASE_OPTIONS = [
  "Dengue",
  "Chikungunya",
  "Malaria",
  "Leptospirosis",
  "Influenza A",
  "Cholera",
  "Typhoid",
  "COVID-19",
  "Other",
];

const today = new Date().toISOString().slice(0, 10);

export default function SubmitData() {
  const { currentHospital, refreshHospitalProfile } = useAuth();
  const { data: latestSubs, refetch } = useApi(getHospitalSubmissions);
  const latest = latestSubs?.[0];

  const [form, setForm] = useState({ date: today, disease: "Dengue", bedOccupancy: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted]   = useState(false);
  const [error, setError]           = useState("");

  function update(key, value) { setForm(f => ({ ...f, [key]: value })); }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.date || !form.disease) { setError("Date and disease are required."); return; }
    setSubmitting(true); setError("");
    try {
      await postSubmission({ reportDate: form.date, disease: form.disease, ...form });
      setSubmitted(true);
      setForm({ date: today, disease: "Dengue", bedOccupancy: "", notes: "" });
      refetch();
      // Refresh hospital completeness in the context
      refreshHospitalProfile?.();
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      setError(err.message || "Submission failed.");
    } finally { setSubmitting(false); }
  }

  return (
    <div className="grid lg:grid-cols-[1.3fr_1fr] gap-5">
      <form onSubmit={handleSubmit} className="card">
        <span className="eyebrow text-slate-600">Submit surveillance data — {currentHospital?.name}</span>
        <div className="grid sm:grid-cols-2 gap-3.5 mt-4">
          <label className="field-label">
            <span>Date *</span>
            <input type="date" className="field-input" value={form.date} onChange={e => update("date", e.target.value)} required />
          </label>
          <label className="field-label">
            <span>Disease *</span>
            <select className="field-input" value={form.disease} onChange={e => update("disease", e.target.value)} required>
              <option value="">Select disease…</option>
              {DISEASE_OPTIONS.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>
          {FIELDS.map(f => (
            <label className="field-label" key={f.key}>
              <span>{f.label}</span>
              <input type="number" placeholder="0" min="0" className="field-input"
                value={form[f.key] || ""} onChange={e => update(f.key, e.target.value)} />
            </label>
          ))}
          <label className="field-label sm:col-span-2">
            <span>Bed occupancy (%)</span>
            <input type="number" placeholder="0" min="0" max="100" className="field-input"
              value={form.bedOccupancy || ""} onChange={e => update("bedOccupancy", e.target.value)} />
          </label>
          <label className="field-label sm:col-span-2">
            <span>Notes</span>
            <textarea placeholder="Add any observations for the upload" className="field-input min-h-[90px] resize-none"
              value={form.notes || ""} onChange={e => update("notes", e.target.value)} />
          </label>
        </div>
        {error && <p className="text-danger text-[12.5px] mt-2">{error}</p>}
        <button className="btn-primary mt-5" disabled={submitting}>
          <Upload size={15} /> {submitting ? "Submitting…" : "Submit data"}
        </button>
        {submitted && <p className="text-success text-[12.5px] mt-3">✓ Submitted — thank you.</p>}
      </form>

      <div className="card surface-status">
        <span className="eyebrow text-success">Submission health</span>
        <div className="flex flex-col mt-3.5">
          <Row label="Last submitted"    value={latest ? new Date(latest.reportDate).toLocaleDateString('en-IN') : "—"} first />
          <Row label="Disease reported"  value={latest?.disease || "—"} />
          <Row label="Validation status" value={latest?.validationStatus || "—"} />
          <Row label="Bed occupancy"     value={latest ? `${latest.bedOccupancy}%` : "—"} />
          <Row label="Data completeness" value={<span className="font-display font-semibold">{currentHospital?.completeness ?? 0}%</span>} />
          <Row label="Total submissions" value={latestSubs?.length ?? 0} />
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, first }) {
  return (
    <div className={"flex justify-between py-3 text-[13.5px] " + (first ? "" : "border-t border-line")}>
      <span className="text-slate-900">{label}</span>
      <span className="text-slate-700">{value}</span>
    </div>
  );
}
