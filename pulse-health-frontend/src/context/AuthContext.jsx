import React, { createContext, useContext, useState, useCallback } from "react";
import { seedHospitals, seedAlertsByHospital } from "../data/mockData.js";

// ---------------------------------------------------------------------------
// Mock auth + data-scoping layer.
//
// - `hospitals` holds every hospital that has registered on the platform.
// - `alertsByHospital` holds each hospital's own alerts, keyed by hospitalId.
// - A logged-in hospital user only ever gets *their own* hospital record and
//   *their own* alerts back from this context (see currentHospital / currentAlerts).
// - A logged-in admin user gets the full `hospitals` list and every hospital's
//   alerts, for network-wide views.
//
// Swap the functions below for real API calls when a backend exists — the
// shape (user, currentHospital, currentAlerts, hospitals, alertsByHospital)
// is designed to map 1:1 onto typical REST/GraphQL responses.
// ---------------------------------------------------------------------------

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [hospitals, setHospitals] = useState(seedHospitals);
  const [alertsByHospital, setAlertsByHospital] = useState(seedAlertsByHospital);
  const [user, setUser] = useState(null); // { role: 'hospital' | 'admin', hospitalId? }

  const loginAsHospital = useCallback((hospitalId) => {
    setUser({ role: "hospital", hospitalId });
  }, []);

  const loginAsAdmin = useCallback(() => {
    setUser({ role: "admin" });
  }, []);

  const logout = useCallback(() => setUser(null), []);

  const registerHospital = useCallback((data) => {
    const id = "hsp_" + Math.random().toString(36).slice(2, 8);
    const newHospital = {
      id,
      name: data.name,
      region: data.region,
      address: data.address,
      contactEmail: data.contactEmail,
      status: "Reporting",
      completeness: 0,
      lastActivity: "Just now",
      registeredAt: new Date().toISOString().slice(0, 10),
    };
    setHospitals((prev) => [...prev, newHospital]);
    setAlertsByHospital((prev) => ({ ...prev, [id]: [] }));
    setUser({ role: "hospital", hospitalId: id });
    return newHospital;
  }, []);

  const submitSurveillanceData = useCallback((hospitalId, entry) => {
    setHospitals((prev) =>
      prev.map((h) =>
        h.id === hospitalId
          ? { ...h, lastActivity: "Just now", completeness: Math.min(100, h.completeness + 2) }
          : h
      )
    );
    return entry;
  }, []);

  const currentHospital = user?.role === "hospital"
    ? hospitals.find((h) => h.id === user.hospitalId) || null
    : null;

  const currentAlerts = user?.role === "hospital"
    ? alertsByHospital[user.hospitalId] || []
    : [];

  const value = {
    user,
    hospitals,
    alertsByHospital,
    currentHospital,
    currentAlerts,
    loginAsHospital,
    loginAsAdmin,
    logout,
    registerHospital,
    submitSurveillanceData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
