import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Activity, ArrowLeft, Building2, ChevronRight, ShieldCheck } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Login() {
  const { hospitals, loginAsHospital, loginAsAdmin } = useAuth();
  const [mode, setMode] = useState(null); // null | 'hospital' | 'admin'
  const [hospitalId, setHospitalId] = useState(hospitals[0]?.id || "");
  const navigate = useNavigate();

  function continueAsHospital() {
    if (!hospitalId) return;
    loginAsHospital(hospitalId);
    navigate("/hospital");
  }

  function continueAsAdmin() {
    loginAsAdmin();
    navigate("/admin");
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="card w-full max-w-[400px] p-8 flex flex-col">
        <Link to="/" className="flex items-center gap-1.5 text-muted text-[12.5px] self-start">
          <ArrowLeft size={14} /> Back to site
        </Link>
        <span className="w-8 h-8 rounded-[9px] bg-brand text-white flex items-center justify-center my-3">
          <Activity size={17} />
        </span>
        <h1 className="font-display text-[24px] mt-1 mb-1">Sign in to Pulse</h1>

        {mode === null && (
          <>
            <p className="text-muted text-[13.5px] mb-6">Choose your workspace to continue.</p>
            <button
              className="flex items-center gap-3 w-full text-left bg-surface border border-line rounded-2xl p-3.5 mt-1 hover:border-brand hover:bg-brand-tint hover:-translate-y-0.5 transition"
              onClick={() => setMode("hospital")}
            >
              <span className="icon-chip"><Building2 size={17} /></span>
              <span className="flex flex-col flex-1">
                <strong className="text-[14px]">Hospital staff</strong>
                <span className="text-muted text-[12px] mt-0.5">Manage your site's alerts and reporting</span>
              </span>
              <ChevronRight size={16} className="text-muted" />
            </button>

            <button
              className="flex items-center gap-3 w-full text-left bg-surface border border-line rounded-2xl p-3.5 mt-2.5 hover:border-brand hover:bg-brand-tint hover:-translate-y-0.5 transition"
              onClick={() => setMode("admin")}
            >
              <span className="icon-chip"><ShieldCheck size={17} /></span>
              <span className="flex flex-col flex-1">
                <strong className="text-[14px]">Network admin</strong>
                <span className="text-muted text-[12px] mt-0.5">Oversee risk across every hospital</span>
              </span>
              <ChevronRight size={16} className="text-muted" />
            </button>

            <p className="text-center text-[12px] text-muted mt-5">
              New hospital? <Link to="/register" className="link">Register here</Link>
            </p>
          </>
        )}

        {mode === "hospital" && (
          <>
            <p className="text-muted text-[13.5px] mb-5">Select your hospital to continue (demo mode).</p>
            <label className="field-label mb-5">
              <span>Hospital</span>
              <select
                className="field-input"
                value={hospitalId}
                onChange={(e) => setHospitalId(e.target.value)}
              >
                {hospitals.map((h) => (
                  <option key={h.id} value={h.id}>{h.name} — {h.region}</option>
                ))}
              </select>
            </label>
            <button className="btn-primary w-full justify-center" onClick={continueAsHospital}>
              Continue to dashboard
            </button>
            <button className="link mt-4 self-center" onClick={() => setMode(null)}>Choose a different workspace</button>
          </>
        )}

        {mode === "admin" && (
          <>
            <p className="text-muted text-[13.5px] mb-5">Continue as the network administrator (demo mode).</p>
            <button className="btn-primary w-full justify-center" onClick={continueAsAdmin}>
              Continue to admin dashboard
            </button>
            <button className="link mt-4 self-center" onClick={() => setMode(null)}>Choose a different workspace</button>
          </>
        )}

        <p className="text-muted text-[12px] mt-6 text-center">Demo mode — no password required</p>
      </div>
    </div>
  );
}
