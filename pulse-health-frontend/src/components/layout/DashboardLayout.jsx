import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import TopHeader from "./TopHeader.jsx";

export default function DashboardLayout({ navItems, basePath, roleLabel, roleIcon, avatarLabel, title, onLogout, hospitalStatus }) {
  return (
    <div className="min-h-screen bg-app">
      <Sidebar
        items={navItems}
        basePath={basePath}
        roleLabel={roleLabel}
        roleIcon={roleIcon}
        onLogout={onLogout}
        systemStatus={hospitalStatus}
      />
      <div className="ml-[240px] min-h-screen">
        <TopHeader title={title} avatarLabel={avatarLabel} />
        <main className="mx-auto min-h-[calc(100vh-64px)] max-w-[1600px] px-5 py-6 sm:px-8 sm:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
