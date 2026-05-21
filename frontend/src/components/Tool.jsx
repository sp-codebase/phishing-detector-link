import React, { useState, useEffect } from "react";
import "./Tool.css";
import phishingApi from "./api/phishingApi";

const Tool = () => {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("phish_history") || "[]");
    } catch {
      return [];
    }
  });
  const [customers, setCustomers] = useState(0);

  useEffect(() => {
    const truncated = history.slice(0, 30);
    try {
      localStorage.setItem("phish_history", JSON.stringify(truncated));
    } catch {}
    setCustomers(truncated.length);
  }, [history]);

  /* ======================= API CALL ======================= */
  const checkUrl = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    const trimmed = (url || "").trim();
    if (!trimmed) return;

    try {
      console.log("🔍 Sending URL:", trimmed);

      const res = await phishingApi.post("/api/predict-ml", {
        url: trimmed,
      });

      console.log("✅ API response:", res.data);

      const backendResult = res.data.result;

      const detection = {
        label:
          backendResult.prediction.toLowerCase().includes("phish")
            ? "Suspicious ❌"
            : "Safe ✅",
        score: backendResult.confidence || 0,
      };

      setResult(detection);

      const entry = {
        url: trimmed,
        label: detection.label,
        score: detection.score,
        time: new Date().toISOString(),
      };

      setHistory((prev) => [entry, ...prev].slice(0, 30));
      setUrl("");

    } catch (err) {
      console.error("❌ Phishing API error:", err);
      alert("Error checking URL. Check console.");
    }
  };

  return (
    <div className="tool-container" style={{ padding: 20 }}>
      <h1>Phishing Detector Tool</h1>

      {/* INPUT */}
      <form
        onSubmit={checkUrl}
        className="input-section"
        style={{ display: "flex", gap: 8 }}
      >
        <input
          type="text"
          placeholder="Paste URL here..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{ flex: 1, padding: 10, fontSize: 16 }}
        />
        <button type="submit" style={{ padding: "8px 12px" }}>
          Check
        </button>
      </form>

      {/* RESULT */}
      {result && (
        <div className="result-box" style={{ marginTop: 12, padding: 12 }}>
          <div><strong>Label:</strong> {result.label}</div>
          <div>
            <strong>Score:</strong>{" "}
            {typeof result.score === "number"
              ? result.score.toFixed(2)
              : result.score}
          </div>
        </div>
      )}

      {/* COUNTER */}
      <div className="customers-box" style={{ marginTop: 12 }}>
        Total Customers Used: <strong>{customers}</strong>
      </div>

      {/* HISTORY */}
      <div className="history-panel" style={{ marginTop: 18 }}>
        <h2>History (Last {history.length} checks)</h2>
        <ul style={{ paddingLeft: 16 }}>
          {history.map((item, index) => (
            <li key={index} style={{ marginBottom: 8 }}>
              <div style={{ fontWeight: 600 }}>
                {item.label} —{" "}
                <span style={{ color: "#444" }}>{item.url}</span>
              </div>
              <div style={{ fontSize: 12, color: "#666" }}>
                Score:{" "}
                {typeof item.score === "number"
                  ? item.score.toFixed(2)
                  : item.score}{" "}
                • {new Date(item.time).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Tool;