import React, { useState, useEffect } from "react";
import "./Tool.css";

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
    localStorage.setItem("phish_history", JSON.stringify(history.slice(0, 30)));
    setCustomers(history.length);
  }, [history]);

  const checkUrl = () => {
    if (!url) return;

    // Simple mock detection logic (replace with real detection later)
    const isPhishing = url.includes("phish") || url.includes("fake");

    setResult(isPhishing ? "Suspicious ❌" : "Safe ✅");
    setHistory([url, ...history]);
    setUrl("");
  };

  return (
    <div className="tool-container">
      <h1>Phishing Detector Tool</h1>

      {/* Input & Button */}
      <div className="input-section">
        <input
          type="text"
          placeholder="Paste URL here..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button onClick={checkUrl}>Check</button>
      </div>

      {/* Result Display */}
      {result && <div className="result-box">{result}</div>}

      {/* Customers Counter */}
      <div className="customers-box">
        Total Customers Used: {customers}
      </div>

      {/* History Panel */}
      <div className="history-panel">
        <h2>History (Last 30 checks)</h2>
        <ul>
          {history.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Tool;
