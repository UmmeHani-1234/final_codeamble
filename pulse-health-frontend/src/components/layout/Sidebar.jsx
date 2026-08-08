import { NavLink } from "react-router-dom";
import { Activity, LogOut } from "lucide-react";

export default function Sidebar({ items, roleLabel, roleIcon: RoleIcon, basePath, onLogout, systemStatus }) {
  return (
    <aside className="fixed left-0 top-0 h-[100vh] w-[240px] flex-shrink-0 bg-white border-r border-slate-200 flex flex-col px-4 py-5 overflow-hidden z-40">
      <div className="flex items-center gap-3 px-1 pb-5">
        <span className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm">
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

      <div className="mt-4 border-t border-slate-200 pt-4">
        <div className="flex items-center gap-3 px-1 mb-4">
          <span className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center">
            <RoleIcon size={16} />
          </span>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-slate-900 truncate">{roleLabel}</div>
            <div className="text-[12px] text-slate-500 truncate">Hospital profile</div>
          </div>
        </div>
        {systemStatus && (
          <div className="mb-4 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-[13px] text-slate-700">
            <div className="text-xs uppercase tracking-[0.28em] text-slate-500">System status</div>
            <div className="mt-2 font-semibold text-slate-900">{systemStatus}</div>
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
