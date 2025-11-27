// src/Tool.jsx
import React, { useState, useEffect } from "react";
import "./Tool.css";

const Tool = () => {
  const [url, setUrl] = useState("");
  // result is a normalized object: { label: "Safe"|"Suspicious", score: 0-1 }
  const [result, setResult] = useState(null);

  // history stored as array of entries { url, label, score, time }
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("phish_history") || "[]");
    } catch {
      return [];
    }
  });

  // customers count (derived from history length)
  const [customers, setCustomers] = useState(0);

  useEffect(() => {
    // persist only last 30 entries
    const truncated = history.slice(0, 30);
    try {
      localStorage.setItem("phish_history", JSON.stringify(truncated));
    } catch {
      // ignore storage errors (e.g. quota)
    }
    setCustomers(truncated.length);
  }, [history]);

  // simple mock detection function (replace with real API call later)
  const detectMock = (rawUrl) => {
    // basic heuristics
    const lower = rawUrl.toLowerCase();
    const phishingKeywords = ["phish", "fake", "verify", "secure-login", "update-password"];
    const found = phishingKeywords.some((k) => lower.includes(k));

    // score: simple heuristic; adjust as desired
    const score = found ? 0.95 : 0.05;

    return {
      label: found ? "Suspicious ❌" : "Safe ✅",
      score,
    };
  };

  const checkUrl = (e) => {
    // if called as form submit, prevent default
    if (e && e.preventDefault) e.preventDefault();

    const trimmed = (url || "").trim();
    if (!trimmed) {
      // empty input — ignore
      return;
    }

    // run mock detection
    const detection = detectMock(trimmed);
    setResult(detection);

    // create structured history entry
    const entry = {
      url: trimmed,
      label: detection.label,
      score: detection.score,
      time: new Date().toISOString(),
    };

    // prepend and keep max 30
    setHistory((prev) => [entry, ...prev].slice(0, 30));
    setUrl("");
  };

  return (
    <div className="tool-container" style={{ padding: 20 }}>
      <h1>Phishing Detector Tool</h1>

      {/* Form so Enter key works */}
      <form onSubmit={checkUrl} className="input-section" style={{ display: "flex", gap: 8 }}>
        <input
          type="text"
          placeholder="Paste URL here..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{ flex: 1, padding: 10, fontSize: 16 }}
          aria-label="URL to check"
        />
        <button type="submit" style={{ padding: "8px 12px" }}>
          Check
        </button>
      </form>

      {/* Result Display */}
      {result && (
        <div className="result-box" style={{ marginTop: 12, padding: 12 }}>
          <div><strong>Label:</strong> {result.label}</div>
          <div><strong>Score:</strong> {typeof result.score === "number" ? result.score.toFixed(2) : result.score}</div>
        </div>
      )}

      {/* Customers Counter */}
      <div className="customers-box" style={{ marginTop: 12 }}>
        Total Customers Used: <strong>{customers}</strong>
      </div>

      {/* History Panel */}
      <div className="history-panel" style={{ marginTop: 18 }}>
        <h2>History (Last {history.length} checks)</h2>
        <ul style={{ paddingLeft: 16 }}>
          {history.map((item, index) => (
            <li key={index} style={{ marginBottom: 8 }}>
              <div style={{ fontWeight: 600 }}>{item.label} — <span style={{ color: "#444" }}>{item.url}</span></div>
              <div style={{ fontSize: 12, color: "#666" }}>
                Score: {typeof item.score === "number" ? item.score.toFixed(2) : item.score} •{" "}
                {new Date(item.time).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Tool;
