import { useState } from "react";
import { Mail, ShieldCheck, Users, Plus, Pencil, Trash2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import useApi from "../../hooks/useApi.js";
import { createHospitalUser, deleteHospitalUser, getHospitalUsers, updateHospitalUser } from "../../services/api.js";
import { SECTION_CLASSES } from "../../utils/sectionStyles.js";

export default function HospitalRegisteredUsers() {
  const { currentHospital } = useAuth();
  const { data: users, loading, error, refetch } = useApi(getHospitalUsers);
  const [form, setForm] = useState({ name: "", email: "", role: "Hospital Staff", phone: "", notifyVia: ["email"] });
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");

  async function handleAddUser(e) {
    e.preventDefault();
    if (!form.name || !form.email) {
      setFeedback("Please enter a name and email.");
      return;
    }

    setSubmitting(true);
    setFeedback("");
    try {
      if (editingId) {
        await updateHospitalUser(editingId, {
          name: form.name,
          email: form.email,
          role: form.role,
          phone: form.phone,
          notifyVia: form.notifyVia,
        });
        setFeedback("User updated successfully.");
      } else {
        await createHospitalUser({
          name: form.name,
          email: form.email,
          role: form.role,
          phone: form.phone,
          notifyVia: form.notifyVia,
        });
        setFeedback("User added successfully.");
      }
      setEditingId(null);
      setForm({ name: "", email: "", role: "Hospital Staff", phone: "", notifyVia: ["email"] });
      refetch();
    } catch (err) {
      setFeedback(err.message || "Unable to save user.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleEdit(user) {
    setEditingId(user._id);
    setForm({
      name: user.name || "",
      email: user.email || "",
      role: user.role || "Hospital Staff",
      phone: user.phone || "",
      notifyVia: user.notifyVia || ["email"],
    });
    setFeedback("Editing existing recipient.");
  }

  async function handleDelete(id) {
    try {
      await deleteHospitalUser(id);
      setFeedback("User removed.");
      refetch();
    } catch (err) {
      setFeedback(err.message || "Unable to remove user.");
    }
  }

  if (loading) return <div className="card py-14 text-center text-muted text-[13.5px]">Loading users…</div>;
  if (error)   return <div className="card py-14 text-center text-danger text-[13.5px]">{error}</div>;

  return (
    <div className="grid gap-6">
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className={"text-xs uppercase tracking-[0.32em] " + SECTION_CLASSES.registeredUsers.eyebrow}>Registered users</p>
            <h1 className={"text-3xl font-semibold mt-2 " + SECTION_CLASSES.registeredUsers.title}>{currentHospital?.name} team</h1>
            <p className="mt-3 text-sm text-slate-500 max-w-2xl">Manage who receives alerts and surveillance notifications for your hospital.</p>
          </div>
          <div className="rounded-3xl bg-white px-5 py-4 text-slate-700 shadow-sm border border-slate-200">
            <div className="text-[11px] uppercase tracking-[0.24em] text-slate-500">Total users</div>
            <div className="mt-2 text-[18px] font-semibold text-indigo">{users?.length ?? 0}</div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Add recipient</p>
            <h2 className="text-xl font-semibold text-slate-900 mt-2">Create a new hospital user</h2>
            <p className="mt-2 text-sm text-slate-500">Add a staff member or alert recipient who should receive hospital notifications.</p>
          </div>
          <form onSubmit={handleAddUser} className="w-full lg:max-w-[480px] grid gap-3">
            <input className="field-input" placeholder="Full name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            <input className="field-input" placeholder="Email address" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            <input className="field-input" placeholder="Role" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} />
            <input className="field-input" placeholder="Phone (optional)" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
            <label className="text-[12px] font-semibold text-slate-600">
              <span className="block mb-1">Notify via</span>
              <select className="field-input" value={form.notifyVia[0] || "email"} onChange={e => setForm(f => ({ ...f, notifyVia: [e.target.value] }))}>
                <option value="email">Email</option>
                <option value="sms">SMS</option>
                <option value="push">Push</option>
              </select>
            </label>
            <button type="submit" className="btn-primary inline-flex items-center justify-center gap-2" disabled={submitting}>
              <Plus size={15} /> {submitting ? (editingId ? "Saving…" : "Adding…") : (editingId ? "Save changes" : "Add user")}
            </button>
            {feedback && <p className={`text-[12.5px] ${feedback.includes("success") ? "text-success" : "text-danger"}`}>{feedback}</p>}
          </form>
        </div>
      </div>

      {!users?.length ? (
        <EmptyState icon={Users} tone="info" title="No users assigned"
          sub="Add clinicians, surveillance leads, and network staff to start receiving alerts." />
      ) : (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Active recipients</p>
              <h2 className="text-xl font-semibold text-slate-900 mt-2">Notification roles</h2>
            </div>
            <Mail className="text-brand" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[540px] border-collapse text-[13px]">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-[0.24em] text-slate-500">
                  <th className="pb-3">Name</th>
                  <th className="pb-3">Role</th>
                  <th className="pb-3">Email</th>
                  <th className="pb-3">Phone</th>
                  <th className="pb-3">Notify via</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id} className="border-t border-slate-200 hover:bg-cyan-tint/55 transition-colors">
                    <td className="py-4 text-slate-900 font-medium">{u.name}</td>
                    <td className="py-4 text-slate-700">{u.role}</td>
                    <td className="py-4 text-slate-600">{u.email}</td>
                    <td className="py-4 text-slate-500">{u.phone || "—"}</td>
                    <td className="py-4">
                      <div className="flex gap-1">
                        {(u.notifyVia || []).map(ch => (
                          <span key={ch} className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-brand-tint text-brand">{ch}</span>
                        ))}
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex gap-2">
                        <button type="button" onClick={() => handleEdit(u)} className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50">
                          <Pencil size={12} /> Edit
                        </button>
                        <button type="button" onClick={() => handleDelete(u._id)} className="inline-flex items-center gap-1 rounded-full border border-rose-200 px-2.5 py-1 text-[11px] font-semibold text-rose-600 hover:bg-rose-50">
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6 rounded-3xl bg-slate-50 p-4 text-sm text-slate-600">
            <ShieldCheck className="inline-block mr-2 align-text-bottom" />
            Manage access through the hospital admin portal to keep alert distribution aligned with your incident response team.
          </div>
        </div>
      )}
    </div>
  );
}
