import { Routes, Route } from "react-router-dom";
import { Home as HomeIcon, AlertTriangle, ClipboardList, Clock, Bell, Settings, MapPin, Building2, ShieldCheck } from "lucide-react";
import { useAuth } from "./context/AuthContext.jsx";

import Home from "./pages/public/Home.jsx";
import Login from "./pages/public/Login.jsx";
import RegisterHospital from "./pages/public/RegisterHospital.jsx";

import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import DashboardLayout from "./components/layout/DashboardLayout.jsx";

import HospitalOverview from "./pages/hospital/Overview.jsx";
import HospitalAlerts from "./pages/hospital/Alerts.jsx";
import HospitalAlertDetail from "./pages/hospital/AlertDetail.jsx";
import HospitalSubmitData from "./pages/hospital/SubmitData.jsx";
import HospitalHistory from "./pages/hospital/History.jsx";
import HospitalNotifications from "./pages/hospital/Notifications.jsx";
import HospitalSettings from "./pages/hospital/Settings.jsx";

import AdminOverview from "./pages/admin/Overview.jsx";
import AdminAlerts from "./pages/admin/Alerts.jsx";
import AdminRegional from "./pages/admin/Regional.jsx";
import AdminOrganizations from "./pages/admin/Organizations.jsx";
import AdminHistory from "./pages/admin/History.jsx";
import AdminNotifications from "./pages/admin/Notifications.jsx";
import AdminSettings from "./pages/admin/Settings.jsx";

const hospitalNav = [
  { key: "", label: "Overview", icon: HomeIcon },
  { key: "alerts", label: "Alerts", icon: AlertTriangle },
  { key: "submit", label: "Submit Data", icon: ClipboardList },
  { key: "history", label: "History", icon: Clock },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "settings", label: "Settings", icon: Settings },
];

const adminNav = [
  { key: "", label: "Overview", icon: HomeIcon },
  { key: "alerts", label: "All Alerts", icon: AlertTriangle },
  { key: "regional", label: "Regional View", icon: MapPin },
  { key: "organizations", label: "Organizations", icon: Building2 },
  { key: "history", label: "History & Reports", icon: Clock },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "settings", label: "Settings", icon: Settings },
];

function HospitalDashboardLayout() {
  const { currentHospital, logout, hospitals } = useAuth();
  const sidebarUsers = currentHospital
    ? hospitals
        .filter((hospital) => hospital.id === currentHospital.id)
        .map((hospital) => ({
          id: hospital.id,
          name: currentHospital.name,
          role: "Hospital Admin",
          hospitalId: hospital.id,
        }))
    : [];

  return (
    <DashboardLayout
      navItems={hospitalNav}
      basePath="/hospital"
      roleLabel={currentHospital?.name || "Hospital"}
      roleIcon={Building2}
      avatarLabel={(currentHospital?.name || "H")[0]}
      title="Hospital Dashboard"
      onLogout={logout}
      users={sidebarUsers}
    />
  );
}

function AdminDashboardLayout() {
  const { logout, hospitals } = useAuth();
  const sidebarUsers = hospitals.map((hospital) => ({
    id: hospital.id,
    name: hospital.name,
    role: "Hospital",
    hospitalId: hospital.id,
  }));

  return (
    <DashboardLayout
      navItems={adminNav}
      basePath="/admin"
      roleLabel="Network Admin"
      roleIcon={ShieldCheck}
      avatarLabel="A"
      title="Network Overview"
      onLogout={logout}
      users={sidebarUsers}
    />
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<RegisterHospital />} />

      <Route
        path="/hospital"
        element={
          <ProtectedRoute role="hospital">
            <HospitalDashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<HospitalOverview />} />
        <Route path="alerts" element={<HospitalAlerts />} />
        <Route path="alerts/:id" element={<HospitalAlertDetail />} />
        <Route path="submit" element={<HospitalSubmitData />} />
        <Route path="history" element={<HospitalHistory />} />
        <Route path="notifications" element={<HospitalNotifications />} />
        <Route path="settings" element={<HospitalSettings />} />
      </Route>

      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdminDashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminOverview />} />
        <Route path="alerts" element={<AdminAlerts />} />
        <Route path="regional" element={<AdminRegional />} />
        <Route path="organizations" element={<AdminOrganizations />} />
        <Route path="history" element={<AdminHistory />} />
        <Route path="notifications" element={<AdminNotifications />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>
    </Routes>
  );
}
