import { ClipboardList } from "lucide-react";
import { RiskBadge } from "../../components/ui/Badge.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import useApi from "../../hooks/useApi.js";
import { getAdminSubmissions } from "../../services/api.js";

export default function AdminSubmissions() {
  const { data: submissions, loading, error } = useApi(getAdminSubmissions);

  if (loading) return <div className="card py-14 text-center text-muted text-[13.5px]">Loading submissions…</div>;
  if (error)   return <div className="card py-14 text-center text-danger text-[13.5px]">{error}</div>;
  if (!submissions?.length) {
    return (
      <EmptyState
        icon={ClipboardList}
        title="No submissions yet"
        sub="Hospitals have not submitted any surveillance data yet."
        tone="neutral"
      />
    );
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3.5">
        <span className="eyebrow">All surveillance submissions — network wide</span>
        <span className="text-muted text-[12px]">{submissions.length} records</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[13px] min-w-[860px]">
          <thead>
            <tr className="text-left">
              {["Date", "Hospital", "Region", "Disease", "Suspected", "Confirmed", "Admissions", "Tests", "Pos.", "ICU", "Bed %", "Status"].map(h => (
                <th key={h} className="pb-2.5 text-[11px] uppercase tracking-wide text-muted font-semibold pr-4">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {submissions.map(s => (
              <tr key={s._id} className="table-row-hover">
                <td className="py-3 border-t border-line pr-4">{new Date(s.reportDate).toLocaleDateString('en-IN')}</td>
                <td className="py-3 border-t border-line pr-4 font-medium">{s.hospitalId?.name || "—"}</td>
                <td className="py-3 border-t border-line pr-4 text-muted">{s.hospitalId?.region || "—"}</td>
                <td className="py-3 border-t border-line pr-4">{s.disease}</td>
                <td className="py-3 border-t border-line pr-4 tabular-nums">{s.suspectedCases}</td>
                <td className="py-3 border-t border-line pr-4 tabular-nums">{s.confirmedCases}</td>
                <td className="py-3 border-t border-line pr-4 tabular-nums">{s.admissions}</td>
                <td className="py-3 border-t border-line pr-4 tabular-nums">{s.testsConducted}</td>
                <td className="py-3 border-t border-line pr-4 tabular-nums">{s.positiveTests}</td>
                <td className="py-3 border-t border-line pr-4 tabular-nums">{s.icuAdmissions}</td>
                <td className="py-3 border-t border-line pr-4 tabular-nums">{s.bedOccupancy}%</td>
                <td className="py-3 border-t border-line">
                  <span className={
                    s.validationStatus === 'Good'    ? 'badge-success' :
                    s.validationStatus === 'Flagged' ? 'badge-danger'  : 'text-muted text-[12px]'
                  }>
                    {s.validationStatus || "Pending"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
