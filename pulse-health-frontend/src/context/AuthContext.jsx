import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { hospitalLogin, hospitalRegister, adminLogin, getAdminHospitals, getHospitalMe } from "../services/api.js";

// ---------------------------------------------------------------------------
// Real auth layer — JWT stored in localStorage, decoded on mount so the
// session survives page refreshes.
//
// Shape of stored data:
//   localStorage key "pulse_token"  → raw JWT string
//   localStorage key "pulse_user"   → JSON { role, hospitalId?, name?, email? }
//
// `currentHospital` is derived from the stored user info and exposed as an
// object shaped like { id, name, email } so the rest of the UI doesn't break.
// ---------------------------------------------------------------------------

const AuthContext = createContext(null);

function readStoredUser() {
  try {
    const raw = localStorage.getItem("pulse_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);
  const [loading, setLoading] = useState(false);
  // Full hospital profile loaded from /api/hospital/me
  const [hospitalProfile, setHospitalProfile] = useState(null);

  // Keep a list of hospitals for the admin dashboard sidebar.
  // For hospital users this stays as a single-item array.
  const [hospitals, setHospitals] = useState(() => {
    const stored = readStoredUser();
    if (stored?.role === "hospital" && stored.hospitalId) {
      return [{ id: stored.hospitalId, name: stored.name, email: stored.email }];
    }
    return [];
  });

  // Persist user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("pulse_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("pulse_user");
      localStorage.removeItem("pulse_token");
    }
  }, [user]);

  // On mount: load full data for whichever role's token is stored.
  useEffect(() => {
    const stored = readStoredUser();
    const token  = localStorage.getItem("pulse_token");
    if (!stored || !token) return;

    if (stored.role === "admin") {
      getAdminHospitals()
        .then(list => {
          setHospitals(list.map(h => ({ id: h._id, _id: h._id, name: h.name, email: h.email })));
        })
        .catch(() => { /* silent */ });
    }

    if (stored.role === "hospital") {
      getHospitalMe()
        .then(profile => setHospitalProfile(profile))
        .catch(() => { /* silent — pages will show auth-stored fallback */ });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Refresh full hospital profile ──────────────────────────────────────
  const refreshHospitalProfile = useCallback(async () => {
    try {
      const profile = await getHospitalMe();
      setHospitalProfile(profile);
      return profile;
    } catch { return null; }
  }, []);

  // ── Hospital login ─────────────────────────────────────────────────────
  const loginAsHospital = useCallback(async (email, password) => {
    const data = await hospitalLogin(email, password);
    localStorage.setItem("pulse_token", data.token);
    const u = {
      role: "hospital",
      hospitalId: data.hospital.id || data.hospital._id,
      name: data.hospital.name,
      email: data.hospital.email,
      blockchainId: data.hospital.blockchainId,
    };
    setUser(u);
    setHospitals([{ id: u.hospitalId, name: u.name, email: u.email }]);
    // Eagerly load full profile for all dashboard pages
    getHospitalMe().then(p => setHospitalProfile(p)).catch(() => {});
    return u;
  }, []);

  // ── Admin login ────────────────────────────────────────────────────────
  const loginAsAdmin = useCallback(async (email, password) => {
    const data = await adminLogin(email, password);
    localStorage.setItem("pulse_token", data.token);
    const u = {
      role: "admin",
      name: data.admin.name,
      email: data.admin.email,
    };
    setUser(u);

    // Fetch real hospital list for the admin sidebar
    try {
      const list = await getAdminHospitals();
      setHospitals(list.map(h => ({ id: h._id, _id: h._id, name: h.name, email: h.email })));
    } catch {
      setHospitals([]);
    }

    return u;
  }, []);

  // ── Logout ─────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    setUser(null);
    setHospitals([]);
    setHospitalProfile(null);
  }, []);

  // ── Hospital registration ──────────────────────────────────────────────
  const registerHospital = useCallback(async (formData) => {
    // The register endpoint now returns a token + hospital directly
    const data = await hospitalRegister(formData);
    localStorage.setItem("pulse_token", data.token);
    const u = {
      role: "hospital",
      hospitalId: data.hospital.id || data.hospital._id,
      name: data.hospital.name,
      email: data.hospital.email,
      blockchainId: data.hospital.blockchainId,
    };
    setUser(u);
    setHospitals([{ id: u.hospitalId, name: u.name, email: u.email }]);
    // Load full profile after registration
    getHospitalMe().then(p => setHospitalProfile(p)).catch(() => {});
    return u;
  }, []);

  // ── Derived values ─────────────────────────────────────────────────────
  // Merge auth-stored basics with full profile from backend
  const currentHospital =
    user?.role === "hospital"
      ? {
          id:           hospitalProfile?._id     || user.hospitalId,
          name:         hospitalProfile?.name     || user.name,
          email:        hospitalProfile?.email    || user.email,
          region:       hospitalProfile?.region   || "—",
          address:      hospitalProfile?.address  || "",
          status:       hospitalProfile?.status   || "Reporting",
          completeness: hospitalProfile?.completeness ?? 0,
          lastActivity: hospitalProfile?.lastActivity || "—",
          blockchainId: hospitalProfile?.blockchainId || user?.blockchainId || null,
          createdAt:    hospitalProfile?.createdAt,
        }
      : null;

  // alertsByHospital / submitSurveillanceData kept as stubs so existing
  // dashboard pages that reference them don't crash
  const alertsByHospital = {};
  const currentAlerts = [];
  const submitSurveillanceData = useCallback(() => {}, []);

  const value = {
    user,
    loading,
    hospitals,
    alertsByHospital,
    currentHospital,
    currentAlerts,
    loginAsHospital,
    loginAsAdmin,
    logout,
    registerHospital,
    submitSurveillanceData,
    refreshHospitalProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
