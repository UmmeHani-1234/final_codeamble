import { useAuth } from "../../context/AuthContext.jsx";
import { flattenAllAlerts } from "../../data/mockData.js";
import { RiskBadge, StatusBadge } from "../../components/ui/Badge.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";

export default function AdminAlerts() {
  const { hospitals, alertsByHospital } = useAuth();
  const allAlerts = flattenAllAlerts(hospitals, alertsByHospital);

  if (allAlerts.length === 0) {
    return <EmptyState title="No alerts across the network" sub="Every connected hospital is currently clear of active signals." />;
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3.5">
        <span className="eyebrow">All alerts — network wide</span>
        <span className="text-muted text-[12px]">{allAlerts.length} total</span>
      </div>
      <table className="w-full border-collapse text-[13px]">
        <thead>
          <tr className="text-left">
            {["Alert", "Disease", "Hospital", "Region", "Probability", "Risk", "Status"].map((h) => (
              <th key={h} className="pb-2.5 text-[11px] uppercase tracking-wide text-muted font-semibold">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {allAlerts.map((a) => {
            const hospital = hospitals.find((h) => h.id === a.hospitalId);
            return (
              <tr key={a.id} className="table-row-hover">
                <td className="py-3 border-t border-line text-muted">{a.id}</td>
                <td className="py-3 border-t border-line">{a.disease}</td>
                <td className="py-3 border-t border-line">{a.hospitalName}</td>
                <td className="py-3 border-t border-line text-muted">{hospital?.region}</td>
                <td className="py-3 border-t border-line tabular-nums">{a.probability}%</td>
                <td className="py-3 border-t border-line"><RiskBadge level={a.risk} /></td>
                <td className="py-3 border-t border-line"><StatusBadge status={a.status} /></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
