import { StatusBadge } from "../../components/ui/Badge.jsx";
import useApi from "../../hooks/useApi.js";
import { getAdminHospitals } from "../../services/api.js";

export default function Organizations() {
  const { data: hospitals, loading, error } = useApi(getAdminHospitals);

  if (loading) return <div className="card py-14 text-center text-muted text-[13.5px]">Loading organizations…</div>;
  if (error)   return <div className="card py-14 text-center text-danger text-[13.5px]">{error}</div>;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3.5">
        <span className="eyebrow">Organization network</span>
        <span className="text-muted text-[12px]">{hospitals?.length ?? 0} sites</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[13px] min-w-[640px]">
          <thead>
            <tr className="text-left">
              {["Hospital", "Region", "Status", "Last activity", "Completeness", "Registered"].map(h => (
                <th key={h} className="pb-2.5 text-[11px] uppercase tracking-wide text-muted font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(hospitals || []).map(o => (
              <tr key={o._id} className="table-row-hover">
                <td className="py-3 border-t border-line font-medium">{o.name}</td>
                <td className="py-3 border-t border-line text-muted">{o.region}</td>
                <td className="py-3 border-t border-line"><StatusBadge status={o.status} /></td>
                <td className="py-3 border-t border-line text-muted">{o.lastActivity}</td>
                <td className="py-3 border-t border-line tabular-nums">{o.completeness}%</td>
                <td className="py-3 border-t border-line text-muted">
                  {o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-IN') : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
