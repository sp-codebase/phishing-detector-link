import { useState } from "react";
import deepfakeApi from "../api/deepfakeApi";
import "./DeepfakePage.css";

export default function DeepfakePage() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* ------------------ CONFIDENCE HELPER ------------------ */
  function confidenceLevel(score) {
    if (typeof score !== "number") {
      return { label: "UNKNOWN", color: "df-medium" };
    }
    if (score >= 0.8) return { label: "HIGH", color: "df-high" };
    if (score >= 0.5) return { label: "MEDIUM", color: "df-medium" };
    return { label: "LOW", color: "df-low" };
  }

  /* ------------------ FILE HANDLER ------------------ */
  function handleFile(e) {
    const f = e.target.files[0];
    if (!f) return;

    // ✅ Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(f.type)) {
      setError("Only JPG, PNG, or WEBP images are supported. No GIFs.");
      setFile(null);
      setPreview(null);
      return;
    }

    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResult(null);
    setError("");
  }

  /* ------------------ ANALYZE ------------------ */
  async function analyze() {
    console.log("Analyze clicked");

    if (!file) {
      setError("Please upload an image.");
      return;
    }

    // ✅ Double-check file type before sending
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setError("Only JPG, PNG, or WEBP images are supported. No GIFs.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const fd = new FormData();
      fd.append("file", file);

      console.log("Sending request to backend...");

      const res = await deepfakeApi.post("/api/deepfake/detect", fd);
      console.log("Backend response:", res.data);
      setResult(res.data.result.result.claim_lists);

    } catch (err) {
      console.error("API error:", err);
      setError("AI analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  /* ------------------ RENDER ------------------ */
  return (
    <div className="df-container">

      {/* ===== HERO ===== */}
      <section className="df-hero">
        <h1>AI Deepfake Detection System</h1>
        <p>
          A research-driven deep learning system designed to identify
          AI-generated media and protect digital trust.
        </p>
      </section>

      {/* ===== INFO ===== */}
      <section className="df-info-grid">
        <div className="df-card">
          <h3>What is a Deepfake?</h3>
          <p>
            Deepfakes are AI-generated images or videos created using
            neural networks that manipulate facial features and identity.
          </p>
        </div>

        <div className="df-card">
          <h3>Why It's Dangerous</h3>
          <p>
            Deepfakes enable fraud, misinformation, identity theft,
            and erosion of trust in digital media.
          </p>
        </div>
      </section>

      {/* ===== DETECTOR ZONE ===== */}
      <section className="df-detector-zone">

        <div className="df-detector-header">
          <h2>AI Media Analysis</h2>
          <p>Upload a JPG, PNG, or WEBP image</p>
        </div>

        <div className="df-detector-content">

          {/* CONTROLS */}
          <div className="df-controls">

            {/* ✅ Restricted file types */}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFile}
            />

            <button
              type="button"
              onClick={analyze}
              disabled={loading}
              className="df-analyze-btn"
            >
              {loading ? "Scanning…" : "Start AI Analysis"}
            </button>

            {error && <p className="df-error">{error}</p>}
          </div>

          {/* ANALYSIS AREA */}
          <div className="df-analysis-area">
            {preview ? (
              <img src={preview} alt="preview" />
            ) : (
              <div className="df-placeholder">
                AI Analysis Output
              </div>
            )}

            {loading && <div className="df-scan-line" />}

            {result && (
              <div className="df-result-overlay">
                {result.critical.length > 0 && (
                  <h3 className="df-high">
                    ❌ High Risk: AI-generated image detected
                  </h3>
                )}

                {result.suspect.length > 0 && result.critical.length === 0 && (
                  <h3 className="df-medium">
                    ⚠️ Uncertain: Image authenticity could not be confirmed
                  </h3>
                )}

                {result.benign.length > 0 && result.suspect.length === 0 && result.critical.length === 0 && (
                  <h3 className="df-low">
                    ✅ Likely real image
                  </h3>
                )}
              </div>
            )}

          </div>

        </div>
      </section>


      {/* ===== VIDEO DETECTOR ZONE ===== */}
      <section className="df-detector-zone">

        <div className="df-detector-header">
          <h2>Deepfake Video Detection</h2>
          <p>Upload MP4, AVI, or MOV video</p>
        </div>

        <div className="df-detector-content">
          <div className="df-controls">

            <input
              type="file"
              accept="video/*"
            />

            <button
              type="button"
              className="df-analyze-btn"
            >
              Start Video Analysis
            </button>

          </div>

          <div className="df-analysis-area">
            <div className="df-placeholder">
              Video Analysis Output
            </div>
          </div>
        </div>
      </section>
      {/* ===== EXPLANATION ===== */}
      {result && (
        <section className="df-explain">
          <p className="df-note">
            ⚠️ This analysis is probabilistic and should be used as
            a decision-support tool.
          </p>
        </section>
      )}

    </div>
  );
}