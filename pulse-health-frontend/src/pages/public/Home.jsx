import { Link } from "react-router-dom";
import { Activity, ArrowUpRight, ClipboardList, Globe2, ShieldCheck, Sparkles, MapPin } from "lucide-react";
import PulseLine from "../../components/ui/PulseLine.jsx";
import { RiskBadge } from "../../components/ui/Badge.jsx";

export default function Home() {
  return (
    <div className="bg-home-surface text-ink">
      <header className="border-b border-line sticky top-0 z-30 bg-white/80 backdrop-blur-sm">
        <div className="max-w-[1180px] mx-auto px-6 h-[72px] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-[14px] bg-brand text-white flex items-center justify-center shadow-soft">
              <Sparkles size={18} />
            </span>
            <div>
              <div className="font-display text-[18px] font-semibold">ShadowDoctor AI</div>
              <div className="text-[11px] uppercase tracking-[0.24em] text-muted">Disease intelligence</div>
            </div>
          </div>

          <nav className="hidden lg:flex gap-8 text-[14px] text-secondary">
            <a href="#platform">Platform</a>
            <a href="#how">How It Works</a>
            <a href="#intelligence">Intelligence</a>
            <a href="#hospitals">Hospitals</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/login" className="btn-ghost">Sign in</Link>
            <Link to="/register" className="btn-primary">For Hospitals</Link>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden pb-24 pt-14 md:pt-20">
          <div className="absolute inset-x-0 top-0 h-[420px] bg-gradient-to-b from-brand-tint/70 to-transparent pointer-events-none" />
          <div className="absolute right-0 top-16 h-[320px] w-[320px] rounded-full bg-brand/10 blur-3xl opacity-80" />
          <div className="max-w-[1180px] mx-auto px-6">
            <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-10 items-center">
              <div className="py-8">
                <span className="eyebrow text-brand">Seasonality + disease activity + hospital signals</span>
                <h1 className="font-display text-[38px] md:text-[54px] font-semibold leading-tight tracking-tight mt-5 max-w-[670px] text-indigo">
                  Detect the signal before it becomes the story.
                </h1>
                <p className="text-secondary text-[17px] leading-relaxed max-w-[600px] mt-6">
                  ShadowDoctor AI turns fragmented health data into actionable early intelligence. Monitor disease signals across hospitals, cities, and regions with precision that keeps care networks ahead.
                </p>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-8">
                  <Link to="/register" className="btn-primary btn-lg">
                    Explore ShadowDoctor AI <ArrowUpRight size={16} />
                  </Link>
                  <Link to="/register" className="btn-ghost btn-lg">For Hospitals</Link>
                </div>

                <div className="grid sm:grid-cols-3 gap-4 mt-10">
                  {[
                    { label: "Hospitals connected", value: "128" },
                    { label: "Regions monitored", value: "48" },
                    { label: "Prediction confidence", value: "92%" },
                  ].map((item) => (
                    <div key={item.label} className="rounded-3xl border border-line bg-white/80 p-5 shadow-soft backdrop-blur-sm">
                      <div className="text-[14px] text-muted">{item.label}</div>
                      <div className="font-display text-[24px] font-semibold mt-3 text-brand">{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="absolute -left-8 top-10 h-28 w-28 rounded-full bg-brand-tint/80 blur-3xl" />
                <div className="absolute -right-6 top-36 h-24 w-24 rounded-full bg-indigo-tint/90 blur-3xl" />

                <div className="floating-card card border-line p-6 mb-6 shadow-xl cursor-default">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-[12px] uppercase tracking-[0.24em] text-muted">Regional risk pulse</p>
                      <h2 className="font-semibold text-[18px] mt-3">Live signal stream</h2>
                    </div>
                    <span className="badge badge-danger">High</span>
                  </div>
                  <div className="mt-5">
                    <PulseLine />
                  </div>
                  <div className="flex items-center justify-between mt-5 text-[13px] text-muted">
                    <span>Mumbai · Dengue</span>
                    <span>81% risk</span>
                  </div>
                </div>

                <div className="floating-card card border-line p-6 mb-6 shadow-xl cursor-default">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[12px] uppercase tracking-[0.24em] text-muted">Signal tier</p>
                      <h3 className="font-semibold text-[17px] mt-2">Chikungunya watch</h3>
                    </div>
                    <span className="badge badge-warning">Medium</span>
                  </div>
                  <p className="text-muted text-[13px] mt-4">
                    Regional activity is rising in Thane and Solapur, with hospital alerts trending upward over the past week.
                  </p>
                </div>

                <div className="floating-card card border-line p-6 shadow-xl cursor-default">
                  <div className="flex items-center gap-3 text-[13px] text-muted uppercase tracking-[0.2em]">
                    <MapPin size={16} />
                    <span>Regional intelligence</span>
                  </div>
                  <div className="mt-4 text-[16px] font-semibold">Network view</div>
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    <div className="rounded-2xl bg-brand/10 p-3 text-center">
                      <div className="text-[15px] font-semibold">48</div>
                      <div className="text-[11px] text-muted mt-1">Cities</div>
                    </div>
                    <div className="rounded-2xl bg-brand/10 p-3 text-center">
                      <div className="text-[15px] font-semibold">6</div>
                      <div className="text-[11px] text-muted mt-1">Signals</div>
                    </div>
                    <div className="rounded-2xl bg-brand/10 p-3 text-center">
                      <div className="text-[15px] font-semibold">94%</div>
                      <div className="text-[11px] text-muted mt-1">Data fidelity</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="platform" className="max-w-[1180px] mx-auto px-6 pb-24">
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <div>
              <span className="eyebrow text-brand">Platform</span>
              <h2 className="font-display text-[34px] font-semibold mt-4 max-w-[540px] text-indigo">
                A premium platform for early warning and clinical coordination.
              </h2>
              <p className="text-secondary text-[16px] leading-relaxed mt-5 max-w-[520px]">
                ShadowDoctor AI combines seasonality, hospital alerts, and regional context into one intelligence layer. Decision-makers see the right signal, in the right place, before it becomes the story.
              </p>
            </div>
            <div className="grid gap-5">
              {[
                { title: "Seasonal signal detection", description: "AI models surface disease risk ahead of seasonal peaks so teams can prepare earlier." },
                { title: "Hospital-grade collaboration", description: "Feed hospital reporting into regional forecasts, then share alerts with care networks." },
                { title: "Regional intelligence at a glance", description: "Visual summaries show which cities and states require immediate attention." },
              ].map((item) => (
                <div key={item.title} className="card border-line p-6 hover:-translate-y-1 transition-transform duration-300">
                  <span className="text-[13px] uppercase tracking-[0.24em] text-brand">{item.title}</span>
                  <p className="mt-4 text-[15px] text-secondary">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="how" className="max-w-[1180px] mx-auto px-6 pb-24">
          <span className="eyebrow text-brand">How It Works</span>
          <h2 className="font-display text-[34px] font-semibold mt-4 mb-10 text-cyan">Slow, subtle intelligence for high-stakes health decisions.</h2>
          <div className="grid lg:grid-cols-3 gap-6">
            {[
              { title: "Collect", body: "Hospital data, environmental trends, and surveillance signals are ingested in one secure workflow." },
              { title: "Analyze", body: "AI overlays seasonality and regional context to identify the most consequential signals." },
              { title: "Act", body: "Teams receive targeted alerts so public health and hospital leaders can move before cases escalate." },
            ].map((item) => (
              <div key={item.title} className="card border-line p-6 hover:shadow-xl transition-shadow duration-300">
                <div className="text-[13px] uppercase tracking-[0.24em] text-muted">{item.title}</div>
                <p className="mt-4 text-[15px] text-secondary leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="final-cta" className="bg-cta-gradient py-24">
          <div className="max-w-[1180px] mx-auto px-6">
            <div className="rounded-[40px] border border-white/10 bg-white/10 p-10 shadow-[0_40px_120px_rgba(20,36,80,0.12)] backdrop-blur-xl">
              <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8 items-center">
                <div>
                  <h2 className="font-display text-[44px] md:text-[52px] font-semibold leading-tight text-indigo">
                    Detect the signal before it becomes the story.
                  </h2>
                  <p className="text-muted text-[17px] leading-relaxed mt-5 max-w-[620px]">
                    ShadowDoctor AI turns fragmented health data into actionable early intelligence.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <Link to="/register" className="btn-primary btn-lg">Explore ShadowDoctor AI →</Link>
                  <Link to="/register" className="btn-ghost btn-lg">For Hospitals →</Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer id="contact" className="border-t border-white/20 py-10 text-[14px] text-muted">
          <div className="max-w-[1180px] mx-auto px-6 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="font-display text-[18px] font-semibold">ShadowDoctor AI</div>
              <p className="mt-2 text-secondary">Predict Tomorrow's Health Risks Today.</p>
            </div>
            <div className="flex flex-wrap gap-5 text-[14px] text-secondary">
              <a href="#platform" className="hover:text-ink transition-colors">Platform</a>
              <a href="#how" className="hover:text-ink transition-colors">How It Works</a>
              <a href="#intelligence" className="hover:text-ink transition-colors">Intelligence</a>
              <a href="#hospitals" className="hover:text-ink transition-colors">Hospitals</a>
              <a href="#about" className="hover:text-ink transition-colors">About</a>
              <a href="#contact" className="hover:text-ink transition-colors">Contact</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
