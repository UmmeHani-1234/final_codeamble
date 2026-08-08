import { useAuth } from "../../context/AuthContext.jsx";

export default function Settings() {
  const { currentHospital } = useAuth();
  return (
    <div className="card max-w-[560px]">
      <span className="eyebrow">Hospital profile</span>
      <div className="flex flex-col gap-3.5 mt-4">
        <Field label="Hospital name" value={currentHospital?.name} />
        <Field label="Region" value={currentHospital?.region} />
        <Field label="Address" value={currentHospital?.address} />
        <Field label="Contact email" value={currentHospital?.contactEmail} />
        <Field label="Registered on" value={currentHospital?.registeredAt} />
      </div>
    </div>
  );
}

function Field({ label, value }) {
  return (
    <label className="field-label">
      <span>{label}</span>
      <input className="field-input" value={value || ""} readOnly />
    </label>
  );
}
