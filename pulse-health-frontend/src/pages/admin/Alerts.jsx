import { RiskBadge, StatusBadge } from "../../components/ui/Badge.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import useApi from "../../hooks/useApi.js";
import { getAdminAlerts, patchAdminAlertStatus } from "../../services/api.js";

export default function AdminAlerts() {
  const { data: allAlerts, loading, error, refetch } = useApi(getAdminAlerts);

  async function handleStatusChange(alertId, status) {
    try {
      await patchAdminAlertStatus(alertId, status);
      refetch();
    } catch {
      // keep UI responsive even if the status update fails
    }
  }

  if (loading) return <div className="card py-14 text-center text-muted text-[13.5px]">Loading alerts…</div>;
  if (error)   return <div className="card py-14 text-center text-danger text-[13.5px]">{error}</div>;
  if (!allAlerts?.length) {
    return <EmptyState title="No alerts across the network" sub="Every connected hospital is currently clear of active signals." tone="success" />;
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3.5">
        <span className="eyebrow">All alerts — network wide</span>
        <span className="text-muted text-[12px]">{allAlerts.length} total</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[13px] min-w-[700px]">
          <thead>
            <tr className="text-left">
              {["Code", "Disease", "Hospital", "Region", "Probability", "Risk", "Status", "Detected"].map(h => (
                <th key={h} className="pb-2.5 text-[11px] uppercase tracking-wide text-muted font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allAlerts.map(a => (
              <tr key={a._id} className="table-row-hover">
                <td className="py-3 border-t border-line text-muted">{a.alertCode}</td>
                <td className="py-3 border-t border-line font-medium">{a.disease}</td>
                <td className="py-3 border-t border-line">{a.hospitalName}</td>
                <td className="py-3 border-t border-line text-muted">{a.region}</td>
                <td className="py-3 border-t border-line tabular-nums">{a.probability}%</td>
                <td className="py-3 border-t border-line"><RiskBadge level={a.risk} /></td>
                <td className="py-3 border-t border-line">
                  <select
                    className="rounded-full border border-slate-200 bg-white px-2 py-1 text-[12px] text-slate-700"
                    value={a.status}
                    onChange={(e) => handleStatusChange(a._id, e.target.value)}
                  >
                    {['Needs review', 'Monitoring', 'Normal', 'Confirmed', 'Dismissed'].map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </td>
                <td className="py-3 border-t border-line text-muted">
                  {a.detectedOn ? new Date(a.detectedOn).toLocaleDateString('en-IN') : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
