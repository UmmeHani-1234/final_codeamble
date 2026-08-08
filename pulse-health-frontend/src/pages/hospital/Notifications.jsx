import { useState } from "react";
import { Bell } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import useApi from "../../hooks/useApi.js";
import { getHospitalUsers, getHospitalNotifications, sendNotification } from "../../services/api.js";

export default function Notifications() {
  const { currentHospital } = useAuth();
  const { data: users }  = useApi(getHospitalUsers);
  const { data: history, refetch } = useApi(getHospitalNotifications);

  const [recipientId, setRecipientId] = useState("");
  const [message, setMessage]         = useState("");
  const [sending, setSending]         = useState(false);
  const [sent, setSent]               = useState("");
  const [sendError, setSendError]     = useState("");

  if (!currentHospital) return (
    <div className="card text-center py-14">
      <Bell size={20} className="mx-auto mb-3" />
      <h3 className="font-display text-[18px] mt-3 mb-1">No hospital selected</h3>
      <p className="text-muted text-[13.5px] max-w-[320px] mx-auto">Sign in to view your hospital notification recipients.</p>
    </div>
  );

  async function handleSend() {
    if (!recipientId || !message.trim()) return;
    setSending(true); setSendError(""); setSent("");
    try {
      await sendNotification({ recipientId, message, channel: "sms" });
      const recipient = users?.find(u => u._id === recipientId);
      setSent(`SMS queued to ${recipient?.name || "recipient"}.`);
      setMessage("");
      refetch();
    } catch (e) {
      setSendError(e.message || "Failed to send.");
    } finally { setSending(false); }
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Compose */}
      <div className="card">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <span className="eyebrow text-warning/70">Hospital notification recipients</span>
            <p className="text-muted text-[13px] mt-1">Send alerts directly to your hospital's response team.</p>
          </div>
        </div>
        {users?.length ? (
          <div className="grid gap-3 mt-2">
            <label className="field-label">
              <span>Recipient</span>
              <select className="field-input" value={recipientId} onChange={e => setRecipientId(e.target.value)}>
                <option value="">Select a recipient…</option>
                {users.map(u => <option key={u._id} value={u._id}>{u.name} — {u.role}</option>)}
              </select>
            </label>
            <label className="field-label">
              <span>Message</span>
              <textarea className="field-input min-h-[100px] resize-none" placeholder="Type your message…"
                value={message} onChange={e => setMessage(e.target.value)} />
            </label>
            <div className="flex items-center gap-4">
              <button className="btn-primary" onClick={handleSend}
                disabled={sending || !recipientId || !message.trim()}>
                {sending ? "Sending…" : "Send notification"}
              </button>
              {sent      && <p className="text-success text-[12.5px]">{sent}</p>}
              {sendError && <p className="text-danger text-[12.5px]">{sendError}</p>}
            </div>
          </div>
        ) : <p className="text-muted text-[13px] mt-2">No notification users configured for this hospital.</p>}
      </div>

      {/* Recipients table */}
      <div className="card overflow-x-auto">
        <div className="mb-3.5">
          <span className="eyebrow">All recipients</span>
        </div>
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr className="text-left">
              {["Name", "Role", "Email", "Actions"].map(h => (
                <th key={h} className="pb-3 text-[11px] uppercase tracking-wide text-muted font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {!users?.length ? (
              <tr><td colSpan="4" className="py-6 text-center text-muted">No recipients found.</td></tr>
            ) : users.map(u => (
              <tr key={u._id} className="table-row-hover table-row-hover-info">
                <td className="py-3 border-t border-line">{u.name}</td>
                <td className="py-3 border-t border-line">{u.role}</td>
                <td className="py-3 border-t border-line text-muted">{u.email}</td>
                <td className="py-3 border-t border-line">
                  <button className="btn-info" onClick={() => { setRecipientId(u._id); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
                    Send notification
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* History */}
      {history?.length > 0 && (
        <div className="card overflow-x-auto">
          <div className="mb-3.5"><span className="eyebrow">Sent notifications</span></div>
          <table className="w-full border-collapse text-[13px]">
            <thead>
              <tr className="text-left">
                {["Recipient", "Message", "Channel", "Status", "Sent at"].map(h => (
                  <th key={h} className="pb-3 text-[11px] uppercase tracking-wide text-muted font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {history.map(n => (
                <tr key={n._id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 border-t border-line">{n.recipientName}</td>
                  <td className="py-3 border-t border-line text-muted max-w-[240px] truncate">{n.message}</td>
                  <td className="py-3 border-t border-line capitalize">{n.channel}</td>
                  <td className="py-3 border-t border-line">
                    <span className={n.status === "sent" ? "badge-success" : n.status === "failed" ? "badge-danger" : "text-muted text-[12px]"}>{n.status}</span>
                  </td>
                  <td className="py-3 border-t border-line text-muted">
                    {n.sentAt ? new Date(n.sentAt).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' }) : "—"}
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
