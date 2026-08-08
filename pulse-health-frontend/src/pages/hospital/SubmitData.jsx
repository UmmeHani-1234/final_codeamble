import { useState } from "react";
import { Upload } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";

const FIELDS = [
  { key: "date", label: "Date", type: "date" },
  { key: "disease", label: "Disease", type: "text", placeholder: "e.g. Dengue" },
  { key: "suspectedCases", label: "Suspected cases", type: "number" },
  { key: "confirmedCases", label: "Confirmed cases", type: "number" },
  { key: "admissions", label: "Hospital admissions", type: "number" },
  { key: "testsConducted", label: "Tests conducted", type: "number" },
  { key: "positiveTests", label: "Positive tests", type: "number" },
  { key: "icuAdmissions", label: "ICU admissions", type: "number" },
];

export default function SubmitData() {
  const { currentHospital, submitSurveillanceData } = useAuth();
  const [form, setForm] = useState({});
  const [submitted, setSubmitted] = useState(false);

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    submitSurveillanceData(currentHospital.id, form);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2500);
  }

  return (
    <div className="grid lg:grid-cols-[1.3fr_1fr] gap-5">
      <form onSubmit={handleSubmit} className="card">
        <span className="eyebrow">Submit surveillance data — {currentHospital?.name}</span>
        <div className="grid sm:grid-cols-2 gap-3.5 mt-4">
          {FIELDS.map((f) => (
            <label className="field-label" key={f.key}>
              <span>{f.label}</span>
              <input
                type={f.type}
                placeholder={f.placeholder || "0"}
                className="field-input"
                value={form[f.key] || ""}
                onChange={(e) => update(f.key, e.target.value)}
              />
            </label>
          ))}
          <label className="field-label sm:col-span-2">
            <span>Bed occupancy (%)</span>
            <input type="number" placeholder="0" className="field-input" value={form.bedOccupancy || ""} onChange={(e) => update("bedOccupancy", e.target.value)} />
          </label>
        </div>
        <button className="btn-primary mt-5">
          <Upload size={15} /> Submit data
        </button>
        {submitted && <p className="text-success text-[12.5px] mt-3">Submitted — thank you.</p>}
      </form>

      <div className="card">
        <span className="eyebrow">Submission health</span>
        <div className="flex flex-col mt-3.5">
          <Row label="Today's submission" value={<span className="badge-success">Complete</span>} first />
          <Row label="Last submitted" value={currentHospital?.lastActivity} />
          <Row label="Data completeness" value={<span className="font-display font-semibold">{currentHospital?.completeness}%</span>} />
          <Row label="Next submission" value="Tomorrow" />
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
