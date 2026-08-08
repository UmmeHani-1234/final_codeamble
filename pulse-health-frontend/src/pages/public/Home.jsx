import { Link } from "react-router-dom";
import { Activity, ArrowUpRight, ClipboardList, Globe2 } from "lucide-react";
import PulseLine from "../../components/ui/PulseLine.jsx";
import { RiskBadge } from "../../components/ui/Badge.jsx";

export default function Home() {
  return (
    <div>
      <header className="border-b border-line sticky top-0 bg-app/85 backdrop-blur z-20">
        <div className="max-w-[1180px] mx-auto px-6 h-[72px] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-[9px] bg-brand text-white flex items-center justify-center">
              <Activity size={17} />
            </span>
            <span className="font-display text-[19px] font-semibold">Pulse</span>
          </div>
          <nav className="hidden md:flex gap-7 text-[14px] text-secondary">
            <a href="#how">How it works</a>
            <a href="#network">Network</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/login" className="btn-ghost">Sign in</Link>
            <Link to="/register" className="btn-primary">Register hospital</Link>
          </div>
        </div>
      </header>

      <section className="max-w-[1180px] mx-auto px-6 pt-16 pb-20 md:pt-20 md:pb-24">
        <div className="grid md:grid-cols-2 gap-14 items-center">
          <div>
            <span className="eyebrow text-brand">Regional health intelligence</span>
            <h1 className="font-display text-[38px] md:text-[48px] font-semibold leading-[1.08] tracking-tight mt-4 mb-4">
              See disease risk before it becomes an outbreak.
            </h1>
            <p className="text-secondary text-[16px] leading-relaxed max-w-[440px]">
              Pulse connects hospital reporting with regional signal detection,
              so care networks can act on early warning instead of reacting to
              headlines.
            </p>
            <div className="flex items-center gap-3 mt-7">
              <Link to="/register" className="btn-primary btn-lg">
                Register your hospital <ArrowUpRight size={16} />
              </Link>
              <Link to="/login" className="btn-ghost btn-lg">Sign in</Link>
            </div>
            <div className="flex gap-6 flex-wrap mt-9 text-[12.5px] text-muted">
              <span><strong className="text-ink font-bold">126</strong> hospitals connected</span>
              <span><strong className="text-ink font-bold">42</strong> regions monitored</span>
              <span><strong className="text-ink font-bold">98%</strong> daily reporting</span>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <span className="eyebrow">Live network pulse</span>
              <span className="badge-success">● Online</span>
            </div>
            <PulseLine />
            <div className="flex items-center justify-between border-t border-line pt-4 mt-1">
              <div>
                <div className="font-display text-[26px] font-semibold">81%</div>
                <div className="text-muted text-[12px]">Highest regional risk — Dengue, Mumbai</div>
              </div>
              <RiskBadge level="High" />
            </div>
          </div>
        </div>
      </section>

      <section id="how" className="max-w-[1180px] mx-auto px-6 py-16">
        <span className="eyebrow text-brand">How it works</span>
        <h2 className="font-display text-[30px] font-semibold mt-2.5 mb-9">From bedside data to network signal</h2>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { t: "Hospitals register & report", d: "Register once, then submit daily surveillance data in minutes — no spreadsheets.", Icon: ClipboardList },
            { t: "Pulse detects", d: "Signals are cross-referenced against regional activity, admissions, and environment.", Icon: Activity },
            { t: "Admins respond", d: "Network admins see risk emerge across every hospital and coordinate before it spreads.", Icon: Globe2 },
          ].map((s) => (
            <div className="card p-6" key={s.t}>
              <span className="icon-chip icon-chip-lg"><s.Icon size={18} /></span>
              <h3 className="font-display text-[17px] mt-3.5 mb-1.5">{s.t}</h3>
              <p className="text-muted text-[13.5px]">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="network" className="max-w-[1180px] mx-auto px-6 pb-24">
        <div className="bg-brand-tint rounded-3xl p-9 md:p-11 flex items-center justify-between gap-6 flex-wrap">
          <div>
            <h2 className="font-display text-[26px] m-0">Bring your hospital onto Pulse</h2>
            <p className="text-secondary mt-1.5 mb-0">Registration takes minutes. Your dashboard is ready the same day.</p>
          </div>
          <Link to="/register" className="btn-primary btn-lg">Register your hospital</Link>
        </div>
      </section>

      <footer className="border-t border-line py-6">
        <div className="max-w-[1180px] mx-auto px-6 flex items-center justify-between text-[13px] text-muted">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-[7px] bg-brand text-white flex items-center justify-center"><Activity size={13} /></span>
            © 2026 Pulse Health Network
          </div>
          <div>Privacy · Terms · Contact</div>
        </div>
      </footer>
    </div>
  );
}
