import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import TopHeader from "./TopHeader.jsx";

export default function DashboardLayout({ navItems, basePath, roleLabel, roleIcon, avatarLabel, title, onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar
        items={navItems}
        basePath={basePath}
        roleLabel={roleLabel}
        roleIcon={roleIcon}
        onLogout={onLogout}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex-1 min-w-0">
        <TopHeader title={title} avatarLabel={avatarLabel} onMenu={() => setSidebarOpen(true)} />
        <div className="p-5 sm:p-7 max-w-[1180px]">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
