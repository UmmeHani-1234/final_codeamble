import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import TopHeader from "./TopHeader.jsx";

export default function DashboardLayout({ navItems, basePath, roleLabel, roleIcon, avatarLabel, title, onLogout, hospitalStatus, users = [] }) {
  const { pathname } = useLocation();
  const dashboardTone = pathname.includes("alerts") || pathname.includes("risk-history")
    ? "risk"
    : pathname.includes("regional") || pathname.includes("organizations")
      ? "regional"
      : pathname.includes("surveillance") || pathname.includes("notifications")
        ? "environment"
        : pathname.includes("history")
          ? "attention"
          : pathname.includes("submit")
            ? "status"
            : basePath === "/admin" ? "regional" : "action";
  return (
    <div className="min-h-screen bg-dashboard-backdrop text-slate-900 py-4 px-2 sm:py-6 sm:px-4">
      <div className="mx-auto w-full max-w-[3000px] overflow-visible rounded-[32px] border border-slate-200/70 bg-white/95 shadow-soft ring-1 ring-white/80 backdrop-blur-sm m-0">
        <div className="grid min-h-[calc(100vh-120px)] gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <Sidebar
            items={navItems}
            basePath={basePath}
            roleLabel={roleLabel}
            roleIcon={roleIcon}
            onLogout={onLogout}
            systemStatus={hospitalStatus}
            users={users}
          />
          <div className="flex min-h-full flex-col">
            <TopHeader title={title} avatarLabel={avatarLabel} />
            <main className={"dashboard-grid dashboard-grid-" + dashboardTone + " flex-1 px-4 py-5 sm:px-6 sm:py-6 lg:px-8"}>
              <Outlet />
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
