import { NavLink } from "react-router-dom";
import { Activity, LogOut, X } from "lucide-react";

export default function Sidebar({ items, roleLabel, roleIcon: RoleIcon, basePath, onLogout, open, onClose, users = [] }) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-ink/30 z-30 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={
          "w-[248px] flex-shrink-0 bg-surface border-r border-line flex flex-col p-3.5 fixed lg:sticky top-0 h-screen z-40 transition-transform duration-200 " +
          (open ? "translate-x-0" : "-translate-x-full lg:translate-x-0")
        }
      >
        <div className="flex items-center gap-2.5 px-2 pb-5 relative">
          <span className="w-8 h-8 rounded-[9px] bg-brand text-white flex items-center justify-center flex-shrink-0">
            <Activity size={16} />
          </span>
          <div>
            <div className="font-display text-[15px] font-semibold leading-none">Pulse</div>
            <div className="text-muted text-[10.5px] tracking-wide mt-1">HEALTH INTELLIGENCE</div>
          </div>
          <button className="lg:hidden absolute right-0 top-0 icon-btn" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <nav className="flex flex-col gap-0.5 flex-1">
          {items.map((it) => (
            <NavLink
              key={it.key}
              to={it.key === "" ? basePath : `${basePath}/${it.key}`}
              end={it.key === ""}
              onClick={onClose}
              className={({ isActive }) =>
                "sidebar-item " + (isActive ? "sidebar-item-active" : "")
              }
            >
              <it.icon size={16} />
              <span>{it.label}</span>
            </NavLink>
          ))}
        </nav>

        {users.length > 0 && (
          <div className="border-t border-line pt-3 mt-2">
            <div className="px-2 pb-2 text-[11px] uppercase tracking-wide text-muted font-semibold">Users</div>
            <div className="space-y-2 max-h-[220px] overflow-y-auto px-2 pb-3">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50/80 px-3 py-2">
                  <div className="min-w-0">
                    <div className="font-semibold text-[13px] truncate">{user.name}</div>
                    <div className="text-muted text-[11px] truncate">{user.role}</div>
                  </div>
                  <span className="badge badge-muted text-[10.5px] whitespace-nowrap">
                    {user.hospitalId ? "Hospital" : "Network"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="border-t border-line pt-3 mt-2">
          <div className="flex items-center gap-2 px-2 py-2 mb-1">
            <span className="icon-chip"><RoleIcon size={14} /></span>
            <span className="text-[12.5px] truncate">{roleLabel}</span>
          </div>
          <button className="sidebar-item" onClick={onLogout}>
            <LogOut size={16} />
            <span>Log out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
