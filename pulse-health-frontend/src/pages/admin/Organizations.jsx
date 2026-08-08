import { useAuth } from "../../context/AuthContext.jsx";
import { StatusBadge } from "../../components/ui/Badge.jsx";

export default function Organizations() {
  const { hospitals } = useAuth();

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3.5">
        <span className="eyebrow">Organization network</span>
        <span className="text-muted text-[12px]">{hospitals.length} sites</span>
      </div>
      <table className="w-full border-collapse text-[13px]">
        <thead>
          <tr className="text-left">
            {["Hospital", "Region", "Status", "Last activity", "Completeness", "Registered"].map((h) => (
              <th key={h} className="pb-2.5 text-[11px] uppercase tracking-wide text-muted font-semibold">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {hospitals.map((o) => (
            <tr key={o.id} className="table-row-hover">
              <td className="py-3 border-t border-line">{o.name}</td>
              <td className="py-3 border-t border-line text-muted">{o.region}</td>
              <td className="py-3 border-t border-line"><StatusBadge status={o.status} /></td>
              <td className="py-3 border-t border-line text-muted">{o.lastActivity}</td>
              <td className="py-3 border-t border-line tabular-nums">{o.completeness}%</td>
              <td className="py-3 border-t border-line text-muted">{o.registeredAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
