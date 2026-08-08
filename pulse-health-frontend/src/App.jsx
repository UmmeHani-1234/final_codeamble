import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Home as HomeIcon, AlertTriangle, ClipboardList, Clock, Bell, Settings, MapPin, Building2, ShieldCheck, Users, Upload, BarChart3 } from "lucide-react";
import { useAuth } from "./context/AuthContext.jsx";

import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import DashboardLayout from "./components/layout/DashboardLayout.jsx";

const Home = lazy(() => import("./pages/public/Home.jsx"));
const Login = lazy(() => import("./pages/public/Login.jsx"));
const RegisterHospital = lazy(() => import("./pages/public/RegisterHospital.jsx"));
const HospitalOverview = lazy(() => import("./pages/hospital/Overview.jsx"));
const HospitalAlerts = lazy(() => import("./pages/hospital/Alerts.jsx"));
const HospitalAlertDetail = lazy(() => import("./pages/hospital/AlertDetail.jsx"));
const HospitalRegional = lazy(() => import("./pages/hospital/Regional.jsx"));
const HospitalSurveillance = lazy(() => import("./pages/hospital/Surveillance.jsx"));
const HospitalSubmitData = lazy(() => import("./pages/hospital/SubmitData.jsx"));
const HospitalHistory = lazy(() => import("./pages/hospital/History.jsx"));
const HospitalRegisteredUsers = lazy(() => import("./pages/hospital/RegisteredUsers.jsx"));
const HospitalNotifications = lazy(() => import("./pages/hospital/Notifications.jsx"));
const HospitalRiskHistory = lazy(() => import("./pages/hospital/RiskHistory.jsx"));
const HospitalSettings = lazy(() => import("./pages/hospital/Settings.jsx"));
const AdminOverview = lazy(() => import("./pages/admin/Overview.jsx"));
const AdminAlerts = lazy(() => import("./pages/admin/Alerts.jsx"));
const AdminRegional = lazy(() => import("./pages/admin/Regional.jsx"));
const AdminOrganizations = lazy(() => import("./pages/admin/Organizations.jsx"));
const AdminHistory = lazy(() => import("./pages/admin/History.jsx"));
const AdminNotifications = lazy(() => import("./pages/admin/Notifications.jsx"));
const AdminSubmissions = lazy(() => import("./pages/admin/Submissions.jsx"));
const AdminSettings = lazy(() => import("./pages/admin/Settings.jsx"));

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
  { key: "",             label: "Overview",         icon: HomeIcon },
  { key: "alerts",       label: "All Alerts",        icon: AlertTriangle },
  { key: "regional",     label: "Regional View",     icon: MapPin },
  { key: "organizations",label: "Organizations",     icon: Building2 },
  { key: "submissions",  label: "Submissions",       icon: ClipboardList },
  { key: "history",      label: "History & Reports", icon: Clock },
  { key: "notifications",label: "Notifications",     icon: Bell },
  { key: "settings",     label: "Settings",          icon: Settings },
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
    <Suspense fallback={<div className="min-h-screen bg-slate-50" aria-busy="true" />}>
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
        <Route path="alerts"        element={<AdminAlerts />} />
        <Route path="regional"      element={<AdminRegional />} />
        <Route path="organizations" element={<AdminOrganizations />} />
        <Route path="submissions"   element={<AdminSubmissions />} />
        <Route path="history"       element={<AdminHistory />} />
        <Route path="notifications" element={<AdminNotifications />} />
        <Route path="settings"      element={<AdminSettings />} />
      </Route>
      </Routes>
    </Suspense>
  );
}
