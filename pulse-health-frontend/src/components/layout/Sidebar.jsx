import { NavLink } from "react-router-dom";
import { Activity, LogOut } from "lucide-react";

const AVATAR_TINTS = [
  "bg-brand-tint text-brand",
  "bg-indigo-tint text-indigo",
  "bg-success-tint text-success",
  "bg-warning-tint text-warning",
  "bg-cyan-tint text-cyan",
];

function avatarTint(name = "") {
  const h = [...name].reduce((s, c) => s + c.charCodeAt(0), 0);
  return AVATAR_TINTS[h % AVATAR_TINTS.length];
}

export default function Sidebar({ items, roleLabel, roleIcon: RoleIcon, basePath, onLogout, systemStatus, users = [] }) {
  return (
    <aside className="h-screen w-full max-w-[280px] flex-shrink-0 rounded-[28px] border border-slate-200/70 bg-white/90 shadow-sm p-5 backdrop-blur-sm flex flex-col overflow-y-auto sticky top-0">
      <div className="flex items-center gap-3 px-1 pb-5">
        <span className="w-11 h-11 rounded-2xl bg-brand-tint text-brand flex items-center justify-center shadow-sm">
          <Activity size={18} />
        </span>
        <div>
          <div className="font-semibold text-sm text-slate-900">ShadowDoctor AI</div>
          <div className="text-[11px] uppercase tracking-[0.3em] text-slate-500 mt-1">Health intelligence</div>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-hidden">
        <nav className="flex flex-col gap-1.5 min-h-0 overflow-y-auto pr-1">
          {items.map((it) => (
            <NavLink
              key={it.key}
              to={it.key === "" ? basePath : `${basePath}/${it.key}`}
              end={it.key === ""}
              className={({ isActive }) =>
                "sidebar-item " + (isActive ? "sidebar-item-active" : "")
              }
            >
              <it.icon size={18} />
              <span>{it.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="mt-4 border-t border-slate-200/70 pt-4">
        <div className="flex items-center gap-3 px-1 mb-4">
          <span className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center">
            <RoleIcon size={16} />
          </span>
          <div className="min-w-0">
            <div className="text-[13.5px] font-semibold text-slate-900 truncate">{roleLabel}</div>
            <div className="text-[12px] text-slate-500 truncate">Hospital profile</div>
          </div>
        </div>
        {systemStatus && (
          <div className="mb-4 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-[13px] text-slate-700">
            <div className="text-xs uppercase tracking-[0.28em] text-slate-500">System status</div>
            <div className="mt-2 font-semibold text-slate-900">{systemStatus}</div>
          </div>
        )}

        {/* User initials avatars — rendered from the real users prop */}
        {users.length > 0 && (
          <div className="flex -space-x-2 overflow-hidden mb-4">
            {users.slice(0, 5).map((u) => (
              <span
                key={u.id || u._id}
                title={u.name}
                className={
                  "w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-[11px] font-bold flex-shrink-0 " +
                  avatarTint(u.name || "")
                }
              >
                {(u.name || "?")[0].toUpperCase()}
              </span>
            ))}
          </div>
        )}

        <button className="sidebar-item text-slate-700 hover:bg-slate-50" onClick={onLogout}>
          <LogOut size={16} />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
}
