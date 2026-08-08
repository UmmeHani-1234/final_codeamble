import { useState } from "react";
import { Send } from "lucide-react";
import useApi from "../../hooks/useApi.js";
import { getHospitalUsers, sendNotification } from "../../services/api.js";

export default function SendAlert() {
  const { data: users } = useApi(getHospitalUsers);

  const [recipientId, setRecipientId] = useState("");
  const [title,       setTitle]       = useState("");
  const [message,     setMessage]     = useState("");
  const [sending,     setSending]     = useState(false);
  const [status,      setStatus]      = useState("");
  const [error,       setError]       = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!recipientId || !message.trim()) return;
    setSending(true); setStatus(""); setError("");
    try {
      await sendNotification({
        recipientId,
        message: title ? `[${title}] ${message}` : message,
        channel: "sms",
      });
      const user = (users || []).find(u => u._id === recipientId);
      setStatus(`Alert sent to ${user?.name || "recipient"} via SMS.`);
      setTitle(""); setMessage(""); setRecipientId("");
    } catch (e) {
      setError(e.message || "Failed to send alert.");
    } finally { setSending(false); }
  }

  return (
    <div className="card max-w-[560px]">
      <div className="flex items-center gap-3 mb-4">
        <div className="icon-chip"><Send size={16} /></div>
        <div>
          <span className="eyebrow">Send alert to staff</span>
          <p className="text-muted text-[12.5px] mt-0.5">Notify a specific team member via SMS.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4 mt-2">
        <label className="field-label">
          <span>Recipient</span>
          <select className="field-input" value={recipientId} onChange={e => setRecipientId(e.target.value)} required>
            <option value="">Select staff member…</option>
            {(users || []).map(u => (
              <option key={u._id} value={u._id}>{u.name} — {u.role}</option>
            ))}
          </select>
        </label>

        <label className="field-label">
          <span>Alert title (optional)</span>
          <input
            type="text"
            className="field-input"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Dengue outbreak"
          />
        </label>

        <label className="field-label">
          <span>Message</span>
          <textarea
            className="field-input resize-none"
            rows={3}
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Detailed alert message…"
            required
          />
        </label>

        <button type="submit" className="btn-primary mt-1" disabled={sending || !recipientId || !message.trim()}>
          {sending ? "Sending…" : "Send alert"}
        </button>

        {status && <p className="text-success text-[12.5px]">{status}</p>}
        {error  && <p className="text-danger text-[12.5px]">{error}</p>}
      </form>

      {!users?.length && (
        <p className="text-muted text-[13px] mt-4">
          No staff contacts are configured for this hospital yet.
        </p>
      )}
    </div>
  );
}
