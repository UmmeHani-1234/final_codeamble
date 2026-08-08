import { useState } from "react";
import useApi from "../../hooks/useApi.js";
import { getAdminHospitals, getAdminNotifications, getAdminUsers, sendAdminNotification } from "../../services/api.js";

export default function Notifications() {
  const { data: users, loading, error } = useApi(getAdminUsers);
  const { data: hospitals } = useApi(getAdminHospitals);
  const { data: history, refetch } = useApi(getAdminNotifications);
  const [selectedHospitalId, setSelectedHospitalId] = useState("");
  const [recipientId, setRecipientId] = useState("");
  const [message, setMessage] = useState("");
  const [channel, setChannel] = useState("sms");
  const [sending, setSending] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const filteredRecipients = (users || []).filter((user) => {
    if (!selectedHospitalId) return true;
    const hospitalRef = user.hospitalId;
    return hospitalRef?._id === selectedHospitalId || hospitalRef?.id === selectedHospitalId || hospitalRef === selectedHospitalId;
  });

  async function handleSend() {
    if (!message.trim()) {
      setStatusMessage("Please enter a message before sending.");
      return;
    }

    setSending(true);
    setStatusMessage("");
    try {
      await sendAdminNotification({ hospitalId: selectedHospitalId || undefined, recipientId: recipientId || undefined, message, channel });
      setStatusMessage("Notification delivered to the selected hospital recipients.");
      setMessage("");
      setRecipientId("");
      refetch();
    } catch (e) {
      setStatusMessage(e.message || "Failed to send notification.");
    } finally {
      setSending(false);
    }
  }

  if (loading) return <div className="card py-14 text-center text-muted text-[13.5px]">Loading…</div>;
  if (error)   return <div className="card py-14 text-center text-danger text-[13.5px]">{error}</div>;

  return (
    <div className="flex flex-col gap-5">
      <div className="card">
        <div className="flex items-center justify-between gap-4 mb-2.5">
          <div>
            <span className="eyebrow">Notification recipients</span>
            <p className="text-muted text-[13px] mt-1">All registered users across the network that receive alerts and system notifications.</p>
          </div>
          <span className="text-muted text-[12px]">{users?.length ?? 0} users</span>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <label className="field-label">
            <span>Hospital</span>
            <select className="field-input" value={selectedHospitalId} onChange={(e) => { setSelectedHospitalId(e.target.value); setRecipientId(""); }}>
              <option value="">All hospitals</option>
              {(hospitals || []).map((hospital) => (
                <option key={hospital._id} value={hospital._id}>{hospital.name}</option>
              ))}
            </select>
          </label>
          <label className="field-label">
            <span>Recipient</span>
            <select className="field-input" value={recipientId} onChange={(e) => setRecipientId(e.target.value)}>
              <option value="">Send to all matching recipients</option>
              {filteredRecipients.map((user) => (
                <option key={user._id} value={user._id}>{user.name} — {user.role}</option>
              ))}
            </select>
          </label>
          <label className="field-label">
            <span>Channel</span>
            <select className="field-input" value={channel} onChange={(e) => setChannel(e.target.value)}>
              <option value="sms">SMS</option>
              <option value="email">Email</option>
              <option value="push">Push</option>
            </select>
          </label>
          <label className="field-label md:col-span-2">
            <span>Message</span>
            <textarea className="field-input min-h-[100px] resize-none" placeholder="Send a hospital alert or follow-up message…" value={message} onChange={(e) => setMessage(e.target.value)} />
          </label>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button className="btn-primary" onClick={handleSend} disabled={sending}>{sending ? "Sending…" : "Send alert"}</button>
          {statusMessage && <p className="text-[12.5px] text-slate-600">{statusMessage}</p>}
        </div>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full border-collapse text-[13px] min-w-[620px]">
          <thead>
            <tr className="text-left">
              {["Name", "Role", "Hospital", "Email", "Notify via"].map(h => (
                <th key={h} className="pb-3 text-[11px] uppercase tracking-wide text-muted font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(users || []).map(u => (
              <tr key={u._id} className="table-row-hover table-row-hover-info">
                <td className="py-3 border-t border-line font-medium">{u.name}</td>
                <td className="py-3 border-t border-line">{u.role}</td>
                <td className="py-3 border-t border-line text-muted">
                  {u.hospitalId?.name || "Network team"}
                </td>
                <td className="py-3 border-t border-line text-muted">{u.email}</td>
                <td className="py-3 border-t border-line">
                  <div className="flex gap-1">
                    {(u.notifyVia || []).map(ch => (
                      <span key={ch} className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-brand-tint text-brand">{ch}</span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {history?.length > 0 && (
        <div className="card overflow-x-auto">
          <div className="mb-3.5">
            <span className="eyebrow">Recent admin notifications</span>
          </div>
          <table className="w-full border-collapse text-[13px] min-w-[620px]">
            <thead>
              <tr className="text-left">
                {['Recipient', 'Hospital', 'Message', 'Channel', 'Status'].map((h) => (
                  <th key={h} className="pb-3 text-[11px] uppercase tracking-wide text-muted font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {history.map((item) => (
                <tr key={item._id} className="table-row-hover table-row-hover-info">
                  <td className="py-3 border-t border-line">{item.recipientName}</td>
                  <td className="py-3 border-t border-line">{item.hospitalId?.name || 'Network'}</td>
                  <td className="py-3 border-t border-line text-muted max-w-[260px] truncate">{item.message}</td>
                  <td className="py-3 border-t border-line capitalize">{item.channel}</td>
                  <td className="py-3 border-t border-line">
                    <span className={item.status === 'sent' ? 'badge-success' : 'text-muted text-[12px]'}>{item.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
