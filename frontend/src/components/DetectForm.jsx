// src/components/DetectForm.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import defaultApi from "../api/phishingApi";

export default function DetectForm({ onResult, api = defaultApi }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Normalize backend response (very important)
  function normalizeResponse(data = {}) {
    const rawResult = data.result ?? data;

    const rawLabel =
      rawResult.prediction ??
      rawResult.label ??
      rawResult.pred ??
      rawResult.result ??
      rawResult.predicted_label;

    let label = "unknown";
    if (rawLabel !== undefined && rawLabel !== null) {
      const s = String(rawLabel).trim().toLowerCase();
      if (s === "1" || s.includes("phish")) label = "phishing";
      else if (s === "0" || s.includes("safe") || s.includes("legit"))
        label = "safe";
      else label = s;
    }

    return {
      label,
      score: rawResult.confidence ?? 0,
      raw: data,
      checkedAt: new Date().toISOString(),
    };
  }

  const handleCheck = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);

    const clean = (url || "").trim();
    if (!clean) {
      setError("Please enter a URL.");
      return;
    }

    // Basic URL validation
    try {
      new URL(clean);
    } catch {
      setError("Please enter a valid URL (include http:// or https://).");
      return;
    }

    setLoading(true);
    try {
      const resp = await api.post("/api/predict-ml", { url: clean });
      const data = resp?.data ?? {};

      const normalized = normalizeResponse(data);
      setResult(normalized);

      // History entry
      const entry = {
        url: clean,
        prediction: normalized.label,
        confidence: normalized.score,
        createdAt: normalized.checkedAt,
      };

      // Save via parent (App.jsx)
      if (onResult) onResult(entry);

      // Also save locally (safe fallback)
      try {
        const hist = JSON.parse(
          localStorage.getItem("phish_history") || "[]"
        );
        hist.unshift(entry);
        localStorage.setItem(
          "phish_history",
          JSON.stringify(hist.slice(0, 30))
        );
      } catch {
        // ignore
      }

      setUrl("");
    } catch (err) {
      const msg =
        err?.response?.data?.error ||
        err?.message ||
        "Network error";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-md border border-gray-200 shadow-lg">
      <form
        onSubmit={handleCheck}
        style={{ display: "flex", gap: 8, alignItems: "flex-start" }}
      >
        <input
          type="text"
          placeholder="Paste URL here (include http:// or https://)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{ flex: 1, padding: "8px 10px", fontSize: 16 }}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Checking…" : "Check"}
        </button>
      </form>

      {error && (
        <div style={{ color: "crimson", marginTop: 8 }}>{error}</div>
      )}

      {result && (
        <>
          <div
            style={{
              marginTop: 12,
              padding: 12,
              borderRadius: 8,
              background:
                result.label === "phishing" ? "#fff1f2" : "#f0fff4",
              border: "1px solid #ddd",
            }}
          >
            <div>
              <strong>Label:</strong> {result.label}
            </div>
            <div>
              <strong>Confidence:</strong>{" "}
              {(result.score * 100).toFixed(2)}%
            </div>

            <pre
              style={{
                maxHeight: 260,
                overflow: "auto",
                marginTop: 6,
                fontSize: 12,
              }}
            >
              {JSON.stringify(result.raw, null, 2)}
            </pre>

            <div style={{ marginTop: 8, fontSize: 12, color: "#444" }}>
              Time: {new Date(result.checkedAt).toLocaleString()}
            </div>
          </div>

{/* ✅ HISTORY BUTTON — ALWAYS VISIBLE */}
<div style={{ marginTop: 16, textAlign: "center" }}>
  <button
    onClick={() => navigate("/history")}
    style={{
      padding: "10px 20px",
      backgroundColor: "#4a4aff",
      color: "#fff",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "15px",
    }}
  >
    📜 View Scan History
  </button>
</div>

        </>
      )}
    </div>
  );
}
