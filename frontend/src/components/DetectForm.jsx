// frontend/src/components/DetectForm.jsx
import React, { useState } from "react";
import api from "../api/axios"; // <- uses your api client (baseURL)

export default function DetectForm( { onResult }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  async function handleCheck(e) {
    e.preventDefault();
    setError("");
    setResult(null);

    const clean = (url || "").trim();
    if (!clean) {
      setError("Please enter a URL");
      return;
    }

    setLoading(true);
    try {
      // Use axios via your api client which should have baseURL http://localhost:5000
      const resp = await api.post("/api/predict-ml", { url: clean });

      // If backend returns non-200 but axios still resolves, handle here
      const data = resp.data;
      setResult(data);

      const historyItem = {
  url: trimmed,
  label: data.label,
  confidence: data.confidence,
  prediction: data.prediction,
  features: data.features,
  time: new Date().toISOString()
};

if (onResult) onResult(historyItem);


      // optional: save to localStorage history for app-level history reading
      try {
        const history = JSON.parse(localStorage.getItem("phish_history") || "[]");
        const entry = {
          url: clean,
          label: data.label ?? (data.prediction === 1 ? "phishing" : "safe"),
          score: Number(data.confidence ?? 0),
          checkedAt: new Date().toISOString()
        };
        history.unshift(entry);
        localStorage.setItem("phish_history", JSON.stringify(history.slice(0, 30)));
      } catch (e) {
        // ignore storage errors
        console.warn("Could not update local history:", e);
      }

    } catch (err) {
      // axios error handling - prefer backend error message when present
      const serverMsg = err?.response?.data?.error || err?.response?.data || null;
      const status = err?.response?.status;
      const msg = serverMsg || err.message || "Network error";
      setError(`Request failed${status ? ` (status ${status})` : ""}: ${msg}`);
      console.error("Prediction error:", { err, serverMsg, status });
    } finally {
      setLoading(false);
    }
  }

  return (
   <div className="p-8 max-w-3xl mx-auto bg-white/10 backdrop-blur-md rounded-xl shadow-lg border border-white/20 mt-6">

      <form onSubmit={handleCheck} className="space-y-4">
        <label className="block">
          <span className="text-sm font-medium">Enter URL to check</span>
          <input
  value={url}
  onChange={(e) => setUrl(e.target.value)}
  placeholder="https://example.com/login"
  className="mt-2 block w-full p-4 text-lg border-2 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
/>

        </label>

        <div>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded" disabled={loading}>
            {loading ? "Checking…" : "Check URL"}
          </button>
        </div>

        {error && <div className="text-red-600 mt-2">{error}</div>}

        {result && (
          <div className="mt-4 p-3 border rounded bg-gray-50">
            <div><strong>Label:</strong> {result.label}</div>
            <div><strong>Confidence:</strong> {(Number(result.confidence) ?? 0).toFixed(2)}</div>
            <details className="mt-2">
              <summary className="cursor-pointer">Features</summary>
              <pre className="text-xs">{JSON.stringify(result.features, null, 2)}</pre>
            </details>
          </div>
        )}
      </form>
    </div>
  );
}
