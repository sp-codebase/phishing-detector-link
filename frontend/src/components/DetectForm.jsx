// src/components/DetectForm.jsx
import React, { useState } from "react";

/**
 * Props:
 * - onResult (fn) optional callback when a result is ready (receives history-like entry)
 * - api (axios instance) optional; if not provided we will import default client
 */
import defaultApi from "../api/axios";

export default function DetectForm({ onResult, api = defaultApi }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

    function normalizeResponse(data = {}) {

  // backend returns { success, saved, result }
  const rawResult = data.result ?? data;        // MOST IMPORTANT CHANGE ❗
  const rawLabel =
    rawResult.prediction ??
    rawResult.label ??
    rawResult.pred ??
    rawResult.result ??
    rawResult.predicted_label;

  // Interpret phishing / safe
  let label = "unknown";
  if (rawLabel !== undefined && rawLabel !== null) {
    const s = String(rawLabel).trim().toLowerCase();
    if (s === "1" || s.includes("phish")) label = "phishing";
    else if (s === "0" || s.includes("legit") || s.includes("safe")) label = "safe";
    else label = s || "unknown";
  }

    return {
    label,
    score,
    // show saved Mongo doc (or any features the backend returns)
    features: data.saved ?? rawResult.features ?? null,
    raw: data, // full original backend response
    checkedAt: new Date().toISOString(),
  };
}


  const handleCheck = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setError("");
    setResult(null);

    const clean = (url || "").trim();
    if (!clean) {
      setError("Please enter a URL.");
      return;
    }

    // optional: basic validation (accepts http(s) and file paths)
    try {
      // eslint-disable-next-line no-new
      new URL(clean);
    } catch {
      // allow file paths if your backend accepts them; otherwise show message
      if (!clean.startsWith("/") && !clean.startsWith("file://")) {
        setError("Please enter a valid URL (include http/https) or a valid file path.");
        return;
      }
    }

    setLoading(true);
    try {
      // call backend (api should be axios instance with correct baseURL)
      const resp = await api.post("/api/predict-ml", { url: clean });
      // after: const resp = await api.post("/api/predict-ml", { url: clean });
      console.log("AXIOS full resp:", resp);
      const data = resp?.data ?? {};
      console.log("AXIOS resp.data:", data);

     

      // normalize and set result
      const normalized = normalizeResponse(data);
      setResult(normalized);

      // build history entry
      const entry = {
        url: clean,
        label: normalized.label,
        score: normalized.score,
        features: normalized.features,
        time: normalized.checkedAt,
      };

      // parent callback & localStorage handled by parent
      if (onResult) onResult(entry);

      // also update localStorage directly so Tool page's initial read shows it immediately
      try {
        const hist = JSON.parse(localStorage.getItem("phish_history") || "[]");
        hist.unshift(entry);
        localStorage.setItem("phish_history", JSON.stringify(hist.slice(0, 30)));
      } catch (err) {
        // ignore
      }

      setUrl("");
    } catch (err) {
      console.error("Prediction error:", err);
      const serverMsg = err?.response?.data?.error || err?.response?.data || err?.message || "Network error";
      const status = err?.response?.status;
      setError(`Request failed${status ? ` (status ${status})` : ""}: ${serverMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-md border border-gray-200 shadow-lg">

      <form onSubmit={handleCheck} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
        <input
          type="text"
          placeholder="Paste URL here (include http:// or https://) or file path"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{ flex: 1, padding: "8px 10px", fontSize: 16 }}
        />
        <button type="submit" disabled={loading} style={{ padding: "8px 12px" }}>
          {loading ? "Checking…" : "Check"}
        </button>
      </form>

      {error && <div style={{ color: "crimson", marginTop: 8 }}>{error}</div>}

      {result && (
        <div style={{ marginTop: 12, padding: 12, borderRadius: 8, background: result.label === "phishing" ? "#fff1f2" : "#f0fff4", border: "1px solid #ddd" }}>
          <div><strong>Label:</strong> {result.label}</div>
          <div><strong>Confidence:</strong> {(result.score ?? 0).toFixed(2)}</div>
           <pre style={{ maxHeight: 260, overflow: "auto", marginTop: 6 }}>
    {JSON.stringify(result.raw, null, 2)}
  </pre>

          <div style={{ marginTop: 8, fontSize: 12, color: "#444" }}>Time: {result.checkedAt}</div>
        </div>
      )}
    </div>
  );
}
