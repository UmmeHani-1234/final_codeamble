import { useMemo } from "react";
import { Mail, ShieldCheck, Users } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { notificationUsers } from "../../data/mockData.js";
import EmptyState from "../../components/ui/EmptyState.jsx";

export default function HospitalRegisteredUsers() {
  const { currentHospital } = useAuth();

  const hospitalUsers = useMemo(
    () => notificationUsers.filter((user) => user.hospitalId === currentHospital?.id),
    [currentHospital]
  );

  return (
    <div className="grid gap-6">
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Registered users</p>
            <h1 className="text-3xl font-semibold text-slate-900 mt-2">{currentHospital?.name} team</h1>
            <p className="mt-3 text-sm text-slate-500 max-w-2xl">
              Manage who receives alerts and surveillance notifications for your hospital.
            </p>
          </div>
          <div className="rounded-3xl bg-slate-50 px-5 py-4 text-slate-700 shadow-sm">
            <div className="text-xs uppercase tracking-[0.32em] text-slate-500">Total users</div>
            <div className="mt-2 text-xl font-semibold text-slate-900">{hospitalUsers.length}</div>
          </div>
        </div>
      </div>

      {hospitalUsers.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No users assigned"
          sub="Add clinicians, surveillance leads, and network staff to start receiving alerts and notifications."
        />
      ) : (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Active recipients</p>
              <h2 className="text-xl font-semibold text-slate-900 mt-2">Notification roles</h2>
            </div>
            <Mail className="text-blue-600" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[540px] border-collapse text-[13px]">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-[0.24em] text-slate-500">
                  <th className="pb-3">Name</th>
                  <th className="pb-3">Role</th>
                  <th className="pb-3">Email</th>
                </tr>
              </thead>
              <tbody>
                {hospitalUsers.map((user) => (
                  <tr key={user.id} className="border-t border-slate-200 hover:bg-slate-50 transition-colors">
                    <td className="py-4 text-slate-900">{user.name}</td>
                    <td className="py-4 text-slate-700">{user.role}</td>
                    <td className="py-4 text-slate-700">{user.email}</td>
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
