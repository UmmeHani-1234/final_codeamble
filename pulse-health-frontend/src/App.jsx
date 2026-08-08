import { Routes, Route } from "react-router-dom";
import { Home as HomeIcon, AlertTriangle, ClipboardList, Clock, Bell, Settings, MapPin, Building2, ShieldCheck, Users, Upload, BarChart3 } from "lucide-react";
import { useAuth } from "./context/AuthContext.jsx";

import Home from "./pages/public/Home.jsx";
import Login from "./pages/public/Login.jsx";
import RegisterHospital from "./pages/public/RegisterHospital.jsx";

import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import DashboardLayout from "./components/layout/DashboardLayout.jsx";

import HospitalOverview from "./pages/hospital/Overview.jsx";
import HospitalAlerts from "./pages/hospital/Alerts.jsx";
import HospitalAlertDetail from "./pages/hospital/AlertDetail.jsx";
import HospitalRegional from "./pages/hospital/Regional.jsx";
import HospitalSurveillance from "./pages/hospital/Surveillance.jsx";
import HospitalSubmitData from "./pages/hospital/SubmitData.jsx";
import HospitalHistory from "./pages/hospital/History.jsx";
import HospitalRegisteredUsers from "./pages/hospital/RegisteredUsers.jsx";
import HospitalNotifications from "./pages/hospital/Notifications.jsx";
import HospitalRiskHistory from "./pages/hospital/RiskHistory.jsx";
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
  { key: "alerts", label: "Early Warning Alerts", icon: AlertTriangle },
  { key: "regional", label: "Regional Intelligence", icon: MapPin },
  { key: "surveillance", label: "Hospital Surveillance", icon: ClipboardList },
  { key: "submit", label: "Upload Data", icon: Upload },
  { key: "history", label: "Submission History", icon: Clock },
  { key: "users", label: "Registered Users", icon: Users },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "risk-history", label: "Risk History", icon: BarChart3 },
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
      hospitalStatus={currentHospital?.status}
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
        <Route path="regional" element={<HospitalRegional />} />
        <Route path="surveillance" element={<HospitalSurveillance />} />
        <Route path="submit" element={<HospitalSubmitData />} />
        <Route path="history" element={<HospitalHistory />} />
        <Route path="users" element={<HospitalRegisteredUsers />} />
        <Route path="notifications" element={<HospitalNotifications />} />
        <Route path="risk-history" element={<HospitalRiskHistory />} />
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
