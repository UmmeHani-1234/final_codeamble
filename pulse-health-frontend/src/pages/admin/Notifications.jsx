import { useMemo } from "react";
import { Bell } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { notificationUsers } from "../../data/mockData.js";

export default function Notifications() {
  const { hospitals } = useAuth();
  const hospitalById = useMemo(
    () => Object.fromEntries(hospitals.map((hospital) => [hospital.id, hospital.name])),
    [hospitals]
  );

  return (
    <div className="flex flex-col gap-5">
      <div className="card">
        <div className="flex items-center justify-between gap-4 mb-2.5">
          <div>
            <span className="eyebrow">Notification recipients</span>
            <p className="text-muted text-[13px] mt-1">
              Select a user to send network alerts and system notifications.
            </p>
          </div>
          <button className="btn-primary">Compose alert</button>
        </div>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr className="text-left">
              {['Name', 'Role', 'Hospital', 'Email', 'Actions'].map((heading) => (
                <th key={heading} className="pb-3 text-[11px] uppercase tracking-wide text-muted font-semibold">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {notificationUsers.map((user) => (
              <tr key={user.id} className="table-row-hover">
                <td className="py-3 border-t border-line">{user.name}</td>
                <td className="py-3 border-t border-line">{user.role}</td>
                <td className="py-3 border-t border-line text-muted">
                  {user.hospitalId ? hospitalById[user.hospitalId] : 'Network team'}
                </td>
                <td className="py-3 border-t border-line text-muted">{user.email}</td>
                <td className="py-3 border-t border-line">
                  <button className="btn-secondary">Send notification</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
