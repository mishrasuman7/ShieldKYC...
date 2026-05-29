// src/api/kyc.js — all backend calls live here, so the rest of the app
// never hardcodes URLs. When we deploy later, we change ONE line.

const API_BASE = "http://localhost:8000";

// Pings the backend's health endpoint we built earlier.
// Returns the JSON on success; throws on any failure so the UI can react.
export async function checkHealth() {
  const res = await fetch(`${API_BASE}/api/health`);
  if (!res.ok) throw new Error(`Backend responded with status ${res.status}`);
  return res.json();
}