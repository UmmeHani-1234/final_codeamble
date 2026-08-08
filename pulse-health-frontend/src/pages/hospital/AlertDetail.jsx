import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { evidenceFactors } from "../../data/mockData.js";
import { RiskBadge } from "../../components/ui/Badge.jsx";

export default function AlertDetail() {
  const { id } = useParams();
  const { currentAlerts, currentHospital } = useAuth();
  const navigate = useNavigate();
  const alert = currentAlerts.find((a) => a.id === id);

  if (!alert) {
    return (
      <div className="card text-center py-14">
        <h3 className="font-display text-[18px] mb-1">Alert not found</h3>
        <p className="text-muted text-[13.5px] mb-4">This alert doesn't belong to your hospital or no longer exists.</p>
        <button className="btn-ghost" onClick={() => navigate("/hospital/alerts")}>Back to alerts</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <button className="flex items-center gap-1.5 text-muted text-[12.5px] w-fit" onClick={() => navigate("/hospital/alerts")}>
        <ArrowLeft size={14} /> Back to alerts
      </button>

      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <RiskBadge level={alert.risk} />
            <h2 className="font-display text-[26px] mt-2.5 mb-0.5">{alert.disease}</h2>
            <p className="text-muted text-[13.5px] m-0">{currentHospital?.name} · {alert.window}</p>
          </div>
          <div className="font-display text-[36px] font-semibold">{alert.probability}%</div>
        </div>
      </div>

      <div className="card">
        <span className="eyebrow">Evidence</span>
        <div className="flex flex-col gap-3 mt-3.5">
          {evidenceFactors.map(([label, val]) => (
            <div key={label} className="flex items-center gap-3.5">
              <span className="w-[170px] flex-shrink-0 text-muted text-[13px]">{label}</span>
              <div className="flex-1 h-[7px] bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-brand to-indigo" style={{ width: `${val}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <span className="eyebrow">AI explanation</span>
        <p className="text-[13.5px] leading-relaxed mt-2.5">
          Pulse identified a combination of rising disease activity, hospital
          admission trends, and seasonal environmental conditions consistent
          with increased transmission risk at your site.
        </p>
      </div>

      <div className="flex gap-2.5 justify-end">
        <button className="btn-ghost">Continue monitoring</button>
        <button className="btn-secondary">Dismiss</button>
        <button className="btn-primary">Confirm &amp; notify</button>
      </div>
    </div>
  );
}
