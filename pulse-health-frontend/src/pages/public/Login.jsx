import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Login() {
  const { loginAsHospital, loginAsAdmin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function handleSignIn(e) {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      if (isAdmin) {
        await loginAsAdmin(email, password);
        navigate("/admin");
      } else {
        await loginAsHospital(email, password);
        navigate("/hospital");
      }
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        * { box-sizing: border-box; }
        html, body, #root { min-height: 100vh; }
        body { margin: 0; padding: 0; font-family: 'Inter', sans-serif; background: radial-gradient(120% 120% at 50% 0%, #FFFFFF 0%, #EAF1FE 45%, #CFE0FC 100%); color: #0F172A; }
        .login-frame { width: 100%; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 32px; }
        .frame { width: 100%; max-width: 760px; background: #FFFFFF; border: 1px solid rgba(15,23,42,0.06); border-radius: 24px; box-shadow: 0 30px 80px rgba(30,70,180,0.14), 0 4px 20px rgba(15,23,42,0.04); overflow: hidden; }
        .topbar { padding: 18px 28px; border-bottom: 1px solid rgba(15,23,42,0.06); display: flex; align-items: center; gap: 10px; }
        .right { position: relative; background: linear-gradient(135deg, #EFF4FF 0%, #E5EDFF 100%); min-height: 480px; }
        .logo-mark { width: 28px; height: 28px; border-radius: 8px; background: linear-gradient(135deg, #2554E8, #6C5CE7); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .logo-mark svg { width: 15px; height: 15px; }
        .logo-word { font-size: 17px; font-weight: 700; letter-spacing: -0.01em; }
        .body { display: grid; grid-template-columns: 1fr 1fr; align-items: stretch; }
        .left { padding: 40px 40px 44px; position: relative; }
        h1 { font-size: 26px; font-weight: 800; letter-spacing: -0.02em; margin: 4px 0 6px; }
        .sub { font-size: 13.5px; color: #64748B; margin: 0 0 26px; line-height: 1.5; }
        .divider { display: flex; align-items: center; gap: 12px; margin: 0 0 18px; color: #94A0B2; font-size: 11.5px; font-weight: 600; letter-spacing: .03em; text-transform: uppercase; }
        .divider::before, .divider::after { content: ""; flex: 1; height: 1px; background: rgba(15,23,42,0.08); }
        .field-label { display: block; font-size: 12px; font-weight: 600; color: #475066; margin-bottom: 6px; }
        .email-input { width: 100%; padding: 11px 13px; border: 1px solid rgba(15,23,42,0.12); border-radius: 12px; font-size: 13.5px; font-family: inherit; color: #0F172A; background: #FBFCFE; margin-bottom: 14px; outline: none; transition: border-color .15s, outline .15s; }
        .email-input::placeholder { color: #94A0B2; }
        .email-input:focus { outline: 2px solid #2554E8; outline-offset: 1px; border-color: transparent; }
        .email-input.has-error { border-color: #EF4444; }
        .password-wrap { position: relative; margin-bottom: 14px; }
        .password-wrap .email-input { margin-bottom: 0; padding-right: 42px; }
        .pw-toggle { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: #94A0B2; padding: 4px; display: flex; align-items: center; }
        .pw-toggle:hover { color: #475066; }
        .error-box { background: #FEF2F2; border: 1px solid #FECACA; border-radius: 10px; padding: 10px 12px; margin-bottom: 14px; font-size: 12.5px; color: #DC2626; display: flex; align-items: center; gap: 7px; }
        .login-mode-toggle { margin-bottom: 18px; display: flex; align-items: center; gap: 8px; }
        .switch { position: relative; display: inline-block; width: 44px; height: 24px; cursor: pointer; }
        .switch input { opacity: 0; width: 0; height: 0; }
        .slider { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: #CBD5E1; transition: .3s; border-radius: 24px; cursor: pointer; }
        .slider:before { position: absolute; content: ""; height: 20px; width: 20px; left: 2px; bottom: 2px; background: #fff; transition: .3s; border-radius: 50%; box-shadow: 0 1px 3px rgba(0,0,0,0.2); }
        .switch input:checked + .slider { background: #2554E8; }
        .switch input:checked + .slider:before { transform: translateX(20px); }
        .mode-label { font-weight: 600; font-size: 13.5px; color: #0F172A; }
        .primary-btn { width: 100%; padding: 11.5px 16px; border: none; border-radius: 12px; background: #2554E8; color: #fff; font-size: 13.5px; font-weight: 700; font-family: inherit; cursor: pointer; box-shadow: 0 8px 20px rgba(37,84,232,0.28); transition: background .15s ease, transform .15s ease, opacity .15s; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .primary-btn:hover:not(:disabled) { background: #1E46CC; transform: translateY(-1px); }
        .primary-btn:disabled { opacity: 0.65; cursor: not-allowed; transform: none; }
        .spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.4); border-top-color: #fff; border-radius: 50%; animation: spin .7s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .terms { font-size: 11px; color: #94A0B2; line-height: 1.6; margin-top: 16px; }
        .terms a { color: #2554E8; text-decoration: none; font-weight: 600; }
        .terms a:hover { text-decoration: underline; }
        .register-link { margin-top: 14px; font-size: 12.5px; color: #64748B; text-align: center; }
        .register-link a { color: #2554E8; font-weight: 600; text-decoration: none; }
        .register-link a:hover { text-decoration: underline; }
        .deco-square { position: absolute; border-radius: 14px; }
        .sq1 { width: 120px; height: 90px; background: #DCE7FE; top: 34px; left: 30px; }
        .sq2 { width: 84px; height: 84px; background: #E9E4FB; top: 150px; right: 24px; }
        .sq3 { width: 60px; height: 60px; background: #DFF3F1; bottom: 40px; left: 54px; }
        .card-person { position: absolute; background: #FFFFFF; border: 1px solid rgba(15,23,42,0.06); border-radius: 16px; box-shadow: 0 14px 34px rgba(15,23,42,0.10); padding: 12px 14px; display: flex; align-items: center; gap: 9px; animation: floatY 5s ease-in-out infinite; }
        .card1 { top: 46px; left: 52px; animation-delay: 0s; }
        .card2 { top: 168px; right: 40px; animation-delay: .6s; }
        .card3 { bottom: 54px; left: 92px; animation-delay: 1.1s; }
        @keyframes floatY { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-8px); } }
        .avatar { width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .a1 { background: #FDE7C8; }
        .a2 { background: #DCE7FE; }
        .a3 { background: #E4E9F0; }
        .card-text { display: flex; flex-direction: column; gap: 2px; }
        .card-text .t1 { font-size: 11.5px; font-weight: 700; color: #0F172A; }
        .card-text .t2 { font-size: 10px; color: #94A0B2; }
        @media (max-width: 640px) { .body { grid-template-columns: 1fr; } .right { min-height: 220px; order: -1; } .left { padding: 32px 26px 34px; } }
      `}</style>

      <div className="login-frame">
        <div className="frame">
          <div className="topbar">
            <span className="logo-mark">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 12h4l2 6 4-14 3 8h7" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="logo-word">Pulse</span>
          </div>

          <div className="body">
            <div className="left">
              <h1>Welcome back</h1>
              <p className="sub">Sign in to your hospital or network dashboard.</p>

              <div className="divider">sign in with email</div>

              <form onSubmit={handleSignIn} noValidate>
                <label className="field-label" htmlFor="email">Work email</label>
                <input
                  className={`email-input${error ? " has-error" : ""}`}
                  id="email"
                  type="email"
                  placeholder="you@yourhospital.org"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  autoComplete="email"
                  disabled={loading}
                />

                <label className="field-label" htmlFor="password">Password</label>
                <div className="password-wrap">
                  <input
                    className={`email-input${error ? " has-error" : ""}`}
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(""); }}
                    autoComplete="current-password"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="pw-toggle"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>

                {error && (
                  <div className="error-box" role="alert">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    {error}
                  </div>
                )}

                <div className="login-mode-toggle">
                  <span className="field-label" style={{ marginBottom: 0 }}>Login as</span>
                  <label className="switch" style={{ marginLeft: 8 }}>
                    <input type="checkbox" checked={isAdmin} onChange={(e) => { setIsAdmin(e.target.checked); setError(""); }} />
                    <span className="slider"></span>
                  </label>
                  <span className="mode-label" style={{ marginLeft: 8 }}>{isAdmin ? "Admin" : "Hospital"}</span>
                </div>

                <button className="primary-btn" type="submit" id="login-submit-btn" disabled={loading}>
                  {loading ? <><span className="spinner" /> Signing in…</> : "Sign in"}
                </button>
              </form>

              <p className="register-link">
                New hospital? <Link to="/register">Create an account</Link>
              </p>

              <p className="terms">
                By signing in you agree to Pulse's{" "}
                <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
              </p>
            </div>

            <div className="right">
              <span className="deco-square sq1"></span>
              <span className="deco-square sq2"></span>
              <span className="deco-square sq3"></span>

              <div className="card-person card1">
                <span className="avatar a1">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M2 12h4l2 6 4-14 3 8h7" stroke="#AD7A0A" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
                <span className="card-text">
                  <span className="t1">Dengue · Mumbai</span>
                  <span className="t2">81% high risk</span>
                </span>
              </div>

              <div className="card-person card2">
                <span className="avatar a2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#2554E8" strokeWidth="2.2"/><path d="M12 7v5l3 2" stroke="#2554E8" strokeWidth="2.2" strokeLinecap="round"/></svg>
                </span>
                <span className="card-text">
                  <span className="t1">Reporting</span>
                  <span className="t2">126 hospitals</span>
                </span>
              </div>

              <div className="card-person card3">
                <span className="avatar a3">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M4 20V10M12 20V4M20 20v-7" stroke="#475066" strokeWidth="2.2" strokeLinecap="round"/></svg>
                </span>
                <span className="card-text">
                  <span className="t1">Network health</span>
                  <span className="t2">96% on time</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
