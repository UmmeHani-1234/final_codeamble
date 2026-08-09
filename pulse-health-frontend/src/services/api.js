// src/services/api.js
// Centralised fetch wrapper for all backend calls.

// Default to the deployed Render backend if `VITE_API_URL` is not set
const BASE_URL = import.meta.env.VITE_API_URL || 'https://final-codeamble.onrender.com';

function notifySharedUpdate(type, payload = {}) {
  const eventPayload = { type, source: 'pulse-sync', timestamp: Date.now(), ...payload };
  try {
    localStorage.setItem('pulse_sync_event', JSON.stringify(eventPayload));
  } catch {
    // ignore storage issues in private mode or blocked environments
  }
  window.dispatchEvent(new CustomEvent('pulse-sync', { detail: eventPayload }));
}

async function request(path, options = {}) {
  const token = localStorage.getItem('pulse_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  } catch (err) {
    throw new Error('Unable to connect to the server. Please check your network or backend URL.');
  }

  let data;
  try { data = await res.json(); } catch { data = {}; }

  if (!res.ok) {
    const message = data.msg || data.message || `Request failed (${res.status})`;
    throw new Error(message);
  }
  return data;
}

// ── Hospital auth ──────────────────────────────────────────────────────────
export const hospitalLogin    = (email, password)           => request('/api/hospital/auth/login',    { method: 'POST', body: JSON.stringify({ email, password }) });
export const hospitalRegister = ({ name, address, email, password }) => request('/api/hospital/auth/register', { method: 'POST', body: JSON.stringify({ name, address, email, password }) });

// ── Admin auth ─────────────────────────────────────────────────────────────
export const adminLogin = (email, password) => request('/api/admin/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });

// ── Hospital data ──────────────────────────────────────────────────────────
export const getHospitalMe          = ()         => request('/api/hospital/me');
export const getHospitalAlerts      = ()         => request('/api/hospital/alerts');
export const getHospitalAlert       = (id)       => request(`/api/hospital/alerts/${id}`);
export const patchAlertStatus       = (id, status) => request(`/api/hospital/alerts/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }).then((result) => { notifySharedUpdate('alert_updated', { id, status }); return result; });
export const getHospitalSubmissions = ()         => request('/api/hospital/submissions');
export const postSubmission         = (data)     => request('/api/hospital/submissions', { method: 'POST', body: JSON.stringify(data) }).then((result) => { notifySharedUpdate('submission_updated', { data }); return result; });
export const getHospitalUsers       = ()         => request('/api/hospital/users');
export const getHospitalNotifications = ()       => request('/api/hospital/notifications');
export const sendNotification       = (data)     => request('/api/hospital/notifications/send', { method: 'POST', body: JSON.stringify(data) }).then((result) => { notifySharedUpdate('notification_updated', { data }); return result; });
export const getRegionalRisk        = ()         => request('/api/hospital/regional');
export const getRiskHistory         = ()         => request('/api/hospital/risk-history');

// ── Admin data ─────────────────────────────────────────────────────────────
export const getAdminHospitals      = ()         => request('/api/admin/hospitals');
export const getAdminAlerts         = ()         => request('/api/admin/alerts');
export const patchAdminAlertStatus  = (id, status) => request(`/api/admin/alerts/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }).then((result) => { notifySharedUpdate('alert_updated', { id, status }); return result; });
export const getAdminRegional       = ()         => request('/api/admin/regional');
export const getAdminNotifications  = ()         => request('/api/admin/notifications');
export const sendAdminNotification  = (data)     => request('/api/admin/notifications/send', { method: 'POST', body: JSON.stringify(data) }).then((result) => { notifySharedUpdate('notification_updated', { data }); return result; });
export const getAdminSubmissions    = ()         => request('/api/admin/submissions');
export const getAdminUsers          = ()         => request('/api/admin/users');

// ── Hospital user management ───────────────────────────────────────────────
export const createHospitalUser     = (data)     => request('/api/hospital/users',              { method: 'POST',   body: JSON.stringify(data) });
export const updateHospitalUser     = (id, data) => request(`/api/hospital/users/${id}`,        { method: 'PUT',    body: JSON.stringify(data) });
export const deleteHospitalUser     = (id)       => request(`/api/hospital/users/${id}`,        { method: 'DELETE' });
export const toggleHospitalUser     = (id)       => request(`/api/hospital/users/${id}/toggle`, { method: 'PATCH' });

// ── Hospital profile ───────────────────────────────────────────────────────
export const updateHospitalProfile  = (data)     => request('/api/hospital/me',                { method: 'PUT',    body: JSON.stringify(data) });
