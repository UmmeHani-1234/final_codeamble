import { Menu, Search, Bell } from "lucide-react";

const AVATAR_TINTS = [
  "bg-brand-tint text-brand",
  "bg-indigo-tint text-indigo",
  "bg-success-tint text-success",
  "bg-warning-tint text-warning",
];

function avatarTint(label = "") {
  const hash = [...label].reduce((s, c) => s + c.charCodeAt(0), 0);
  return AVATAR_TINTS[hash % AVATAR_TINTS.length];
}

export default function TopHeader({ title, avatarLabel = "P" }) {
  return (
    <header className="sticky top-0 z-20 bg-gradient-to-r from-brand/10 via-indigo-50 to-purple-50 backdrop-blur border-b border-slate-200">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-5 sm:px-8">
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">Dashboard</p>
          <h1 className="font-semibold text-[19px] text-brand">{title}</h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
            <Search size={16} />
            <span>Search</span>
          </div>
          <button className="icon-btn bg-white border-slate-200 text-slate-600 hover:bg-slate-50">
            <Bell size={16} />
          </button>
          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2">
            <span className={"inline-flex h-9 w-9 items-center justify-center rounded-full font-semibold " + avatarTint(avatarLabel)}>
              {avatarLabel}
            </span>
            <span className="text-sm font-medium text-slate-700">{avatarLabel}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
