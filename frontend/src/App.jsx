import { useState, useEffect } from "react";
import { checkHealth } from "./api/kyc";

export default function App() {
  // Three possible states drive the entire UI: still checking, success, failed.
  const [status, setStatus] = useState("checking"); // "checking" | "online" | "offline"
  const [payload, setPayload] = useState(null);       // the JSON the backend returned

  // useEffect with [] runs ONCE when the component first mounts (page load).
  useEffect(() => {
    checkHealth()
      .then((data) => {
        setPayload(data);
        setStatus("online");
      })
      .catch(() => setStatus("offline"));
  }, []);

  // A small lookup so we don't write three big if/else blocks in the JSX.
  const ui = {
    checking: { dot: "bg-amber-400 animate-pulse", label: "Connecting to backend…", tone: "text-amber-700" },
    online:   { dot: "bg-emerald-500",             label: "Backend connected",       tone: "text-emerald-700" },
    offline:  { dot: "bg-rose-500",                label: "Backend unreachable",     tone: "text-rose-700" },
  }[status];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-shield-50 to-slate-100 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white/80 backdrop-blur ring-1 ring-slate-900/5 shadow-xl shadow-shield-500/5 p-8">

        {/* Brand mark */}
        <div className="flex items-center gap-3 mb-6">
          <div className="grid place-items-center h-11 w-11 rounded-2xl bg-shield-600 text-white text-xl font-bold">S</div>
          <div>
            <h1 className="text-lg font-semibold text-slate-900 leading-tight">ShieldKYC</h1>
            <p className="text-xs text-slate-500">AI fraud detection · system check</p>
          </div>
        </div>

        {/* Live status row */}
        <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 mb-5">
          <span className={`h-2.5 w-2.5 rounded-full ${ui.dot}`} />
          <span className={`text-sm font-medium ${ui.tone}`}>{ui.label}</span>
        </div>

        {/* Raw backend response — proof the data round-tripped */}
        {payload && (
          <pre className="text-xs bg-slate-900 text-emerald-300 rounded-xl p-4 overflow-x-auto">
{JSON.stringify(payload, null, 2)}
          </pre>
        )}

        {status === "offline" && (
          <p className="text-xs text-slate-500 mt-4 leading-relaxed">
            Make sure the backend terminal is running <code className="text-slate-700">uvicorn main:app --reload --port 8000</code> and try refreshing.
          </p>
        )}
      </div>
    </div>
  );
}