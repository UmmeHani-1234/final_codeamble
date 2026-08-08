import { useNavigate } from "react-router-dom";
import { Activity, AlertTriangle, CheckCircle2, ChevronRight, ClipboardList } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { useAuth } from "../../context/AuthContext.jsx";
import { trendData } from "../../data/mockData.js";
import KpiCard from "../../components/ui/KpiCard.jsx";
import { RiskBadge } from "../../components/ui/Badge.jsx";

export default function HospitalOverview() {
  const { currentHospital, currentAlerts } = useAuth();
  const navigate = useNavigate();

  const needsReview = currentAlerts.filter((a) => a.status === "Needs review").length;
  const topAlert = [...currentAlerts].sort((a, b) => b.probability - a.probability)[0];

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard label="Active alerts" value={currentAlerts.length} sub="for your hospital" icon={AlertTriangle} />
        <KpiCard
          label="Highest priority"
          value={topAlert ? topAlert.disease : "None"}
          sub={topAlert ? `${topAlert.probability}% · ${topAlert.risk} risk` : "No active signals"}
          icon={Activity}
        />
        <KpiCard label="Needs review" value={needsReview} sub="awaiting your action" icon={ClipboardList} />
        <KpiCard
          label="Data completeness"
          value={`${currentHospital?.completeness ?? 0}%`}
          sub="this reporting period"
          trend="up"
          icon={CheckCircle2}
        />
      </div>

      {topAlert ? (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-1">
            <span className="eyebrow">Your top signal right now</span>
            <span className="text-muted text-[11.5px]">Updated 5 min ago</span>
          </div>
          <div className="grid md:grid-cols-2 gap-8 items-center mt-1.5">
            <div>
              <RiskBadge level={topAlert.risk} />
              <h2 className="font-display text-[28px] mt-2.5 mb-0.5">{topAlert.disease}</h2>
              <p className="text-muted text-[13.5px] m-0">{currentHospital?.name} · {topAlert.window}</p>
              <div className="flex items-end gap-2 mt-4">
                <span className="font-display text-[40px] font-semibold leading-none">{topAlert.probability}%</span>
                <span className="text-muted text-[12.5px] mb-1.5">predicted probability</span>
              </div>
              <button
                className="btn-primary mt-4"
                onClick={() => navigate(`/hospital/alerts/${topAlert.id}`)}
              >
                Review alert <ChevronRight size={15} />
              </button>
            </div>
            <div className="h-[150px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid stroke="#EEF1F6" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94A0B2" }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #EEF1F6", fontSize: 12 }} />
                  <Line type="monotone" dataKey="cases" stroke="#2554E8" strokeWidth={2.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      ) : (
        <div className="card text-center py-14">
          <h3 className="font-display text-[18px] mb-1">No active signals</h3>
          <p className="text-muted text-[13.5px]">Your hospital has no open alerts right now. Keep submitting daily data to stay covered.</p>
        </div>
      )}

      <div className="grid lg:grid-cols-[1.3fr_1fr] gap-5">
        <div className="card">
          <div className="flex items-center justify-between mb-3.5">
            <span className="eyebrow">Recent activity</span>
            <button className="link" onClick={() => navigate("/hospital/alerts")}>View all</button>
          </div>
          {currentAlerts.length === 0 ? (
            <p className="text-muted text-[13px] py-4">No alerts recorded for your hospital yet.</p>
          ) : (
            <table className="w-full border-collapse text-[13px]">
              <thead>
                <tr className="text-left">
                  <th className="pb-2.5 text-[11px] uppercase tracking-wide text-muted font-semibold">Disease</th>
                  <th className="pb-2.5 text-[11px] uppercase tracking-wide text-muted font-semibold">Risk</th>
                  <th className="pb-2.5"></th>
                </tr>
              </thead>
              <tbody>
                {currentAlerts.slice(0, 5).map((a) => (
                  <tr key={a.id} className="table-row-hover" onClick={() => navigate(`/hospital/alerts/${a.id}`)}>
                    <td className="py-3 border-t border-line">{a.disease}</td>
                    <td className="py-3 border-t border-line"><RiskBadge level={a.risk} /></td>
                    <td className="py-3 border-t border-line text-right text-muted"><ChevronRight size={15} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="card">
          <span className="eyebrow">Submission health</span>
          <div className="flex flex-col mt-3.5">
            <Row label="Today's submission" value={<span className="badge-success">Complete</span>} first />
            <Row label="Last submitted" value={currentHospital?.lastActivity || "—"} />
            <Row label="Data completeness" value={<span className="font-display font-semibold">{currentHospital?.completeness ?? 0}%</span>} />
            <Row label="Next submission due" value="Tomorrow, 9:00 AM" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, first }) {
  return (
    <div className={"flex justify-between py-2.5 text-[13px] " + (first ? "" : "border-t border-line")}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
