import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Login() {
  const { hospitals, loginAsHospital } = useAuth();
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  function handleSignIn() {
    if (!hospitals.length) return;
    loginAsHospital(hospitals[0].id);
    navigate("/hospital");
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
        .topbar { display: flex; align-items: center; gap: 9px; padding: 20px 32px; border-bottom: 1px solid rgba(15,23,42,0.06); }
        .logo-mark { width: 28px; height: 28px; border-radius: 8px; background: linear-gradient(135deg, #2554E8, #6C5CE7); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .logo-mark svg { width: 15px; height: 15px; }
        .logo-word { font-size: 17px; font-weight: 700; letter-spacing: -0.01em; }
        .body { display: grid; grid-template-columns: 1fr 1fr; align-items: stretch; }
        .left { padding: 40px 40px 44px; }
        h1 { font-size: 26px; font-weight: 800; letter-spacing: -0.02em; margin: 4px 0 6px; }
        .sub { font-size: 13.5px; color: #64748B; margin: 0 0 26px; line-height: 1.5; }
        .oauth-btn { width: 100%; display: flex; align-items: center; justify-content: center; gap: 10px; padding: 11px 16px; border: 1px solid rgba(15,23,42,0.12); background: #fff; border-radius: 12px; font-size: 13.5px; font-weight: 600; color: #0F172A; cursor: pointer; margin-bottom: 10px; transition: border-color .15s ease, background .15s ease, transform .15s ease; font-family: inherit; }
        .oauth-btn:hover { border-color: #2554E8; background: #F7F9FF; transform: translateY(-1px); }
        .oauth-btn svg { width: 17px; height: 17px; flex-shrink: 0; }
        .divider { display: flex; align-items: center; gap: 12px; margin: 18px 0 14px; color: #94A0B2; font-size: 11.5px; font-weight: 600; letter-spacing: .03em; text-transform: uppercase; }
        .divider::before, .divider::after { content: ""; flex: 1; height: 1px; background: rgba(15,23,42,0.08); }
        .field-label { display: block; font-size: 12px; font-weight: 600; color: #475066; margin-bottom: 6px; }
        .email-input, .sms-input, .email-input:focus, textarea { width: 100%; padding: 11px 13px; border: 1px solid rgba(15,23,42,0.12); border-radius: 12px; font-size: 13.5px; font-family: inherit; color: #0F172A; background: #FBFCFE; margin-bottom: 14px; }
        .email-input::placeholder { color: #94A0B2; }
        .email-input:focus, textarea:focus { outline: 2px solid #2554E8; outline-offset: 1px; border-color: transparent; }
        .primary-btn { width: 100%; padding: 11.5px 16px; border: none; border-radius: 12px; background: #2554E8; color: #fff; font-size: 13.5px; font-weight: 700; font-family: inherit; cursor: pointer; box-shadow: 0 8px 20px rgba(37,84,232,0.28); transition: background .15s ease, transform .15s ease; }
        .primary-btn:hover { background: #1E46CC; transform: translateY(-1px); }
        .terms { font-size: 11px; color: #94A0B2; line-height: 1.6; margin-top: 16px; }
        .terms a { color: #2554E8; text-decoration: none; font-weight: 600; }
        .terms a:hover { text-decoration: underline; }
        .right { position: relative; background: radial-gradient(120% 100% at 100% 0%, #EAF0FE 0%, #F7F9FF 55%, #FFFFFF 100%); border-left: 1px solid rgba(15,23,42,0.06); overflow: hidden; min-height: 380px; }
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
        .pulse-strip { position: absolute; bottom: 96px; right: 40px; width: 130px; }
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
              <h1>Sign up or log in</h1>
              <p className="sub">Access your hospital or network dashboard on Pulse.</p>

              <button className="oauth-btn" type="button">
                <svg viewBox="0 0 24 24"><path fill="#4285F4" d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.47c-.28 1.5-1.13 2.78-2.4 3.63v3h3.88c2.27-2.09 3.57-5.17 3.57-8.82Z"/><path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.95-2.91l-3.88-3c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.27v3.11C3.25 21.3 7.31 24 12 24Z"/><path fill="#FBBC05" d="M5.27 14.28A7.2 7.2 0 0 1 4.89 12c0-.79.14-1.56.38-2.28V6.61H1.27A11.98 11.98 0 0 0 0 12c0 1.93.46 3.76 1.27 5.39l4-3.11Z"/><path fill="#EA4335" d="M12 4.77c1.77 0 3.35.61 4.6 1.8l3.44-3.44C17.95 1.19 15.23 0 12 0 7.31 0 3.25 2.7 1.27 6.61l4 3.11C6.22 6.88 8.87 4.77 12 4.77Z"/></svg>
                Continue with Google
              </button>

              <button className="oauth-btn" type="button">
                <svg viewBox="0 0 23 23"><rect width="10" height="10" x="0" y="0" fill="#F35325"/><rect width="10" height="10" x="12" y="0" fill="#81BC06"/><rect width="10" height="10" x="0" y="12" fill="#05A6F0"/><rect width="10" height="10" x="12" y="12" fill="#FFBA08"/></svg>
                Continue with Microsoft
              </button>

              <div className="divider">or</div>

              <label className="field-label" htmlFor="email">Work email</label>
              <input
                className="email-input"
                id="email"
                type="email"
                placeholder="you@yourhospital.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <button className="primary-btn" type="button" onClick={handleSignIn}>
                Continue with email
              </button>

              <p className="terms">
                By continuing with Google, Microsoft, or email, you agree to Pulse's
                <a href="#"> Terms of Service</a> and <a href="#"> Privacy Policy</a>.
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
