import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { notificationUsers } from "../../data/mockData.js";

export default function HospitalOverview() {
  const { currentHospital, currentAlerts, hospitals, alertsByHospital } = useAuth();

  const [smsRecipient, setSmsRecipient] = useState("");
  const [smsText, setSmsText] = useState("");
  const [smsStatus, setSmsStatus] = useState("");
  const [smsSending, setSmsSending] = useState(false);

  const hospitalUsers = useMemo(
    () => notificationUsers.filter((user) => user.hospitalId === currentHospital?.id),
    [currentHospital]
  );

  useEffect(() => {
    if (!smsRecipient && hospitalUsers.length > 0) {
      setSmsRecipient(hospitalUsers[0].id);
    }
  }, [hospitalUsers, smsRecipient]);

  const topAlert = [...currentAlerts].sort((a, b) => b.probability - a.probability)[0];

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-slate-500">{currentHospital?.name}</p>
            <h1 className="text-3xl font-semibold text-slate-900 mt-2">{currentHospital?.region} hospital dashboard</h1>
            <p className="mt-3 text-sm text-slate-500 max-w-2xl">
              Fast, explainable early-warning alerts for your hospital, regional comparison, and submission workflow.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-center">
              <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Active alerts</div>
              <div className="text-3xl font-bold text-slate-900 mt-3">{currentAlerts.length}</div>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-center">
              <div className="text-xs uppercase tracking-[0.24em] text-slate-500">High risk</div>
              <div className="text-3xl font-bold text-slate-900 mt-3">{currentAlerts.filter((a) => a.risk === "High").length}</div>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-center">
              <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Submitted today</div>
              <div className="text-3xl font-bold text-slate-900 mt-3">{currentHospital?.lastActivity?.includes("min") ? "Yes" : "No"}</div>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-center">
              <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Registered users</div>
              <div className="text-3xl font-bold text-slate-900 mt-3">{hospitalUsers.length}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Hospital messaging</p>
            <h2 className="text-xl font-semibold text-slate-900 mt-2">Send SMS to your Patients</h2>
          </div>
          <p className="max-w-xl text-sm text-slate-500">
            Notify a hospital staff member directly from the dashboard with an SMS alert.
          </p>
        </div>

        {hospitalUsers.length > 0 ? (
          <div className="mt-6 grid gap-4">
            <label className="field-label">
              <span>Recipient</span>
              <select
                className="field-input"
                value={smsRecipient}
                onChange={(e) => setSmsRecipient(e.target.value)}
              >
                {hospitalUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} — {user.role}
                  </option>
                ))}
              </select>
            </label>

            <label className="field-label">
              <span>Message</span>
              <textarea
                className="field-input min-h-[120px] resize-none"
                placeholder="Type your SMS message here..."
                value={smsText}
                onChange={(e) => setSmsText(e.target.value)}
              />
            </label>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                className="btn-primary w-full sm:w-auto px-6"
                onClick={() => {
                  if (!smsRecipient || !smsText.trim()) return;
                  setSmsSending(true);
                  setSmsStatus("");
                  setTimeout(() => {
                    const sentTo = hospitalUsers.find((user) => user.id === smsRecipient);
                    setSmsSending(false);
                    setSmsStatus(`SMS queued to ${sentTo?.name || "selected staff"}.`);
                    setSmsText("");
                  }, 600);
                }}
                disabled={smsSending || !smsRecipient || !smsText.trim()}
              >
                {smsSending ? "Sending..." : "Send SMS"}
              </button>

              {smsStatus && <p className="text-sm text-slate-600">{smsStatus}</p>}
            </div>
          </div>
        ) : (
          <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
            No staff contact is configured for this hospital yet.
          </div>
        )}
      </div>

    </div>
  );
}
