import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { RiskBadge, StatusBadge } from "../../components/ui/Badge.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";

export default function HospitalAlerts() {
  const { currentAlerts, currentHospital } = useAuth();
  const navigate = useNavigate();

  if (currentAlerts.length === 0) {
    return (
      <EmptyState
        title="No alerts for your hospital"
        sub={`${currentHospital?.name || "Your hospital"} has no active surveillance signals right now.`}
      />
    );
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3.5">
        <span className="eyebrow">All alerts — {currentHospital?.name}</span>
        <span className="text-muted text-[12px]">{currentAlerts.length} total</span>
      </div>
      <table className="w-full border-collapse text-[13px]">
        <thead>
          <tr className="text-left">
            {["Disease", "Probability", "Risk", "Window", "Status", ""].map((h) => (
              <th key={h} className="pb-2.5 text-[11px] uppercase tracking-wide text-muted font-semibold">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentAlerts.map((a) => (
            <tr key={a.id} className="table-row-hover" onClick={() => navigate(`/hospital/alerts/${a.id}`)}>
              <td className="py-3 border-t border-line">{a.disease}</td>
              <td className="py-3 border-t border-line tabular-nums">{a.probability}%</td>
              <td className="py-3 border-t border-line"><RiskBadge level={a.risk} /></td>
              <td className="py-3 border-t border-line text-muted">{a.window}</td>
              <td className="py-3 border-t border-line"><StatusBadge status={a.status} /></td>
              <td className="py-3 border-t border-line text-right text-muted"><ChevronRight size={15} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
