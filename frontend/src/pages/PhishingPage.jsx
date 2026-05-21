import { useState } from "react";
import phishingApi from "../api/phishingApi";
import { useNavigate } from "react-router-dom";

export default function PhishingPage() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);

  const navigate = useNavigate(); // ✅ only addition

  async function checkUrl() {
    const res = await phishingApi.post("/api/predict-ml", { url });
    setResult(res.data);
  }

  return (
    <div>
      <h2>Phishing Detection</h2>

      <input
        value={url}
        onChange={e => setUrl(e.target.value)}
        placeholder="Enter URL"
      />

      <button onClick={checkUrl}>Check</button>

      {result && (
        <>
          <pre>{JSON.stringify(result, null, 2)}</pre>

          {/* ✅ HISTORY BUTTON BELOW TOOL */}
          <button
            onClick={() => navigate("/history")}
            style={{
              marginTop: "15px",
              padding: "8px 16px",
              backgroundColor: "#4a4aff",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            📜 View History
          </button>
        </>
      )}
    </div>
  );
}
