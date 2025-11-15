// src/Tool.jsx
import React, { useState, useEffect } from "react";
import "./Tool.css";

// IMPORTANT: make sure src/api/axios.js exists (we set baseURL via VITE_API_BASE)
import api from "./api/axios";

const Tool = () => {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("phish_history")) || [];
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    localStorage.setItem("phish_history", JSON.stringify(history.slice(0, 30)));
  }, [history]);

  const checkUrl = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setError("");
    setResult(null);

    const trimmed = (url || "").trim();
    if (!trimmed) {
      setError("Please enter a URL.");
      return;
    }

    // optional: quick URL validation
    try {
      // eslint-disable-next-line no-new
      new URL(trimmed);
    } catch {
      setError("Please enter a valid URL (include http/https).");
      return;
    }

    try {
      setLoading(true);
      // Call backend POST /api/check-url
      const res = await api.post("/api/check-url", { url: trimmed });
      setResult(res.data);

      // update history (prepend)
      const newEntry = {
        url: trimmed,
        label: res.data.label,
        score: res.data.score,
        time: res.data.checkedAt || new Date().toISOString(),
      };
      setHistory((h) => [newEntry, ...h].slice(0, 30));
      setUrl("");
    } catch (err) {
      console.error("Check URL error:", err);
      setError(
        err?.response?.data?.error ||
        err.message ||
        "Network or server error. Is backend running?"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tool-container" style={{ padding: 20 }}>
      <h1>Phishing Detector Tool</h1>

      {/* Input */}
      <form onSubmit={checkUrl} style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input
          type="text"
          placeholder="Paste URL here (include http:// or https://)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{ flex: 1, padding: "8px 10px" }}
        />
        <button type="submit" disabled={loading} style={{ padding: "8px 12px" }}>
          {loading ? "Checking…" : "Check"}
        </button>
      </form>

      {/* Error */}
      {error && <div style={{ color: "crimson", marginBottom: 12 }}>{error}</div>}

      {/* Result */}
      {result && (
        <div
          style={{
            marginBottom: 16,
            padding: 16,
            borderRadius: 8,
            background: result.label === "phishing" ? "#ffeef0" : "#f0fff4",
            border: result.label === "phishing" ? "1px solid #ffccd5" : "1px solid #bdecb6",
          }}
        >
          <h3>
            Result: <span style={{ textTransform: "uppercase" }}>{result.label}</span>
          </h3>
          <div>Score: {result.score}</div>
          <div style={{ marginTop: 8 }}>
            <strong>Features:</strong>
            <pre style={{ margin: 0 }}>{JSON.stringify(result.features, null, 2)}</pre>
          </div>
          <div style={{ marginTop: 8, fontSize: 12, color: "#444" }}>
            Time: {result.checkedAt || result.time || new Date().toISOString()}
          </div>
        </div>
      )}

      {/* Local quick fallback if backend unavailable (keeps your previous behavior) */}
      {!result && !loading && !error && (
        <div style={{ marginBottom: 12, color: "#666" }}>
          Enter a URL to check. If the backend is not running, you'll get a network error.
        </div>
      )}

      {/* History */}
      <div className="history-panel" style={{ marginTop: 8 }}>
        <h3>History (last {history.length})</h3>
        <ul>
          {history.map((item, idx) => (
            <li key={idx} style={{ marginBottom: 6 }}>
              <strong>{item.label?.toUpperCase() || "UNKNOWN"}</strong> — {item.url}
              <div style={{ fontSize: 12, color: "#666" }}>
                Score: {item.score} • {new Date(item.time).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Tool;
