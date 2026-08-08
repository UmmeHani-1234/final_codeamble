import { useMemo } from "react";
import { Bell } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { notificationUsers } from "../../data/mockData.js";

export default function Notifications() {
  const { currentHospital } = useAuth();
  const recipients = useMemo(
    () => notificationUsers.filter((user) => user.hospitalId === currentHospital?.id),
    [currentHospital]
  );

  if (!currentHospital) {
    return (
      <div className="card text-center py-14">
        <Bell size={20} className="mx-auto mb-3" />
        <h3 className="font-display text-[18px] mt-3 mb-1">No hospital selected</h3>
        <p className="text-muted text-[13.5px] max-w-[320px] mx-auto">
          Sign in to view your hospital notification recipients.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="card">
        <div className="flex items-center justify-between gap-4 mb-2.5">
          <div>
            <span className="eyebrow">Hospital notification recipients</span>
            <p className="text-muted text-[13px] mt-1">
              Send alerts directly to your hospital's response team.
            </p>
          </div>
          <button className="btn-primary">Compose alert</button>
        </div>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr className="text-left">
              {['Name', 'Role', 'Email', 'Actions'].map((heading) => (
                <th key={heading} className="pb-3 text-[11px] uppercase tracking-wide text-muted font-semibold">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recipients.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-6 text-center text-muted">
                  No notification users are registered for {currentHospital.name} yet.
                </td>
              </tr>
            ) : (
              recipients.map((user) => (
                <tr key={user.id} className="table-row-hover">
                  <td className="py-3 border-t border-line">{user.name}</td>
                  <td className="py-3 border-t border-line">{user.role}</td>
                  <td className="py-3 border-t border-line text-muted">{user.email}</td>
                  <td className="py-3 border-t border-line">
                    <button className="btn-secondary">Send notification</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
