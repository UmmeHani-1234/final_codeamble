import { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { SECTION_CLASSES, valueTone } from "../../utils/sectionStyles.js";
import useApi from "../../hooks/useApi.js";
import { getHospitalAlerts, getHospitalUsers, sendNotification } from "../../services/api.js";

export default function HospitalOverview() {
  const { currentHospital } = useAuth();
  const { data: alerts } = useApi(getHospitalAlerts);
  const { data: users  } = useApi(getHospitalUsers);

  const [recipientId, setRecipientId] = useState("");
  const [smsText, setSmsText]         = useState("");
  const [smsSending, setSmsSending]   = useState(false);
  const [smsStatus, setSmsStatus]     = useState("");

  const highAlerts = (alerts || []).filter(a => a.risk === "High").length;
  const patientRecipients = [
    { name: 'Asha Rao', email: 'asha@pulsehealth.local' },
    { name: 'Vikram Patil', email: 'vikram@pulsehealth.local' },
    { name: 'Naina Shah', email: 'naina@pulsehealth.local' },
  ];
  const recipientOptions = [
    ...((users || []).map(u => ({
      id: u._id,
      label: `${u.name} — ${u.role || 'Hospital staff'}`,
      kind: 'staff',
    }))),
    ...patientRecipients.map((patient, index) => ({
      id: `patient:${index + 1}`,
      label: `${patient.name} — Registered patient`,
      kind: 'patient',
    })),
    { id: 'all-patients', label: 'All registered patients', kind: 'all-patients' },
  ];

  async function handleSendSms() {
    if (!recipientId || !smsText.trim()) return;
    setSmsSending(true); setSmsStatus("");
    try {
      const selected = recipientOptions.find(item => item.id === recipientId);
      const payload = { message: smsText, channel: "sms" };

      if (selected?.kind === 'all-patients') {
        payload.recipientType = 'all_patients';
        payload.patientRecipients = patientRecipients;
      } else if (selected?.kind === 'patient') {
        const patient = patientRecipients[parseInt(selected.id.split(':')[1], 10) - 1];
        payload.recipientType = 'patient';
        payload.recipientName = patient?.name || selected.label.replace(' — Registered patient', '');
        payload.recipientEmail = patient?.email || '';
      } else {
        payload.recipientId = recipientId;
      }

      await sendNotification(payload);
      setSmsStatus(`SMS queued to ${selected?.label || "selected recipient"}.`);
      setSmsText("");
    } catch (e) {
      setSmsStatus("Failed to send. Please try again.");
    } finally { setSmsSending(false); }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Stats header */}
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className={"text-[11px] uppercase tracking-[0.24em] " + SECTION_CLASSES.overview.eyebrow}>{currentHospital?.name}</p>
            <h1 className={"text-[20px] font-semibold mt-2 " + SECTION_CLASSES.overview.title}>{currentHospital?.region} hospital dashboard</h1>
            <p className="mt-3 text-[13.5px] text-slate-500 max-w-2xl leading-6">
              Fast, explainable early-warning alerts for your hospital, regional comparison, and submission workflow.
            </p>
            {currentHospital?.blockchainId && (
              <p className="mt-2 text-[13px] text-slate-500">
                Blockchain ID: <span className="font-semibold text-slate-700">{currentHospital.blockchainId}</span>
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-3xl border surface-risk p-4 text-center">
              <div className="text-[12.5px] uppercase tracking-[0.24em] text-slate-500">Active alerts</div>
              <div className="text-[26px] font-semibold text-danger mt-3">{alerts?.length ?? 0}</div>
            </div>
            <div className="rounded-3xl border surface-risk p-4 text-center">
              <div className="text-[12.5px] uppercase tracking-[0.24em] text-slate-500">High risk</div>
              <div className="text-[26px] font-semibold text-danger mt-3">{highAlerts}</div>
            </div>
            <div className="rounded-3xl border surface-status p-4 text-center">
              <div className="text-[12.5px] uppercase tracking-[0.24em] text-slate-500">Completeness</div>
              <div className="text-[26px] font-semibold text-success mt-3">{currentHospital?.completeness ?? 0}%</div>
            </div>
            <div className="rounded-3xl border surface-regional p-4 text-center">
              <div className="text-[12.5px] uppercase tracking-[0.24em] text-slate-500">Registered users</div>
              <div className="text-[26px] font-semibold text-indigo mt-3">{users?.length ?? 0}</div>
            </div>
          </div>
        </div>
      </div>

      {/* SMS panel */}
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-cyan/70">Hospital messaging</p>
            <h2 className="text-xl font-semibold text-cyan mt-2">Send SMS to your Team</h2>
          </div>
          <p className="max-w-xl text-sm text-slate-500">Notify a hospital staff member directly from the dashboard with an SMS alert.</p>
        </div>

        {recipientOptions.length ? (
          <div className="mt-6 grid gap-4">
            <label className="field-label">
              <span>Recipient</span>
              <select className="field-input" value={recipientId} onChange={e => setRecipientId(e.target.value)}>
                <option value="">Select staff member or registered patient…</option>
                <optgroup label="Hospital contacts">
                  {recipientOptions.filter(option => option.kind === 'staff').map(option => (
                    <option key={option.id} value={option.id}>{option.label}</option>
                  ))}
                </optgroup>
                <optgroup label="Registered patients">
                  {recipientOptions.filter(option => option.kind === 'patient').map(option => (
                    <option key={option.id} value={option.id}>{option.label}</option>
                  ))}
                  <option value="all-patients">All registered patients</option>
                </optgroup>
              </select>
            </label>
            <label className="field-label">
              <span>Message</span>
              <textarea className="field-input min-h-[120px] resize-none" placeholder="Type your SMS message here…"
                value={smsText} onChange={e => setSmsText(e.target.value)} />
            </label>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button type="button" className="btn-primary w-full sm:w-auto px-6"
                onClick={handleSendSms}
                disabled={smsSending || !recipientId || !smsText.trim()}>
                {smsSending ? "Sending…" : "Send SMS"}
              </button>
              {smsStatus && <p className="text-sm text-success">{smsStatus}</p>}
            </div>
          </div>
        ) : (
          <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
            No staff or registered patient recipients are available for SMS delivery yet.
          </div>
        )}
      </div>
    </div>
  );
}
