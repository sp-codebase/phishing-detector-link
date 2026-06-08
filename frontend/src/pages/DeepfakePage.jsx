import { useState } from "react";
import deepfakeApi from "../api/deepfakeApi";
import "./DeepfakePage.css";

export default function DeepfakePage() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* ------------------ FILE HANDLER ------------------ */
  function handleFile(e) {
    const f = e.target.files[0];

    if (!f) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(f.type)) {
      setError("Only JPG, PNG, or WEBP images are supported.");
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

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const fd = new FormData();
      fd.append("file", file);

      console.log("Sending request to backend...");

      const res = await deepfakeApi.post(
        "/api/deepfake/detect",
        fd,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("FULL RESPONSE:", res.data);

      // Adjust according to actual backend response
      const claimLists =
        res.data?.result?.result?.claim_lists ||
        res.data?.result?.claim_lists ||
        res.data?.claim_lists ||
        null;

      console.log("CLAIM LISTS:", claimLists);

      if (!claimLists) {
        throw new Error("Invalid response format.");
      }

      setResult(claimLists);

    } catch (err) {
      console.error("API Error:", err);

      if (err.response) {
        console.log("Response Status:", err.response.status);
        console.log("Response Data:", err.response.data);
      }

      setError(
        err.response?.data?.message ||
        err.message ||
        "AI analysis failed."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="df-container">

      {/* HERO */}
      <section className="df-hero">
        <h1>AI Deepfake Detection System</h1>
        <p>
          A research-driven deep learning system designed
          to identify AI-generated media and protect digital trust.
        </p>
      </section>

      {/* INFO */}
      <section className="df-info-grid">

        <div className="df-card">
          <h3>What is a Deepfake?</h3>
          <p>
            Deepfakes are AI-generated images or videos created
            using neural networks that manipulate facial features
            and identity.
          </p>
        </div>

        <div className="df-card">
          <h3>Why It's Dangerous</h3>
          <p>
            Deepfakes enable fraud, misinformation,
            identity theft, and erosion of trust in digital media.
          </p>
        </div>

      </section>

      {/* IMAGE DETECTOR */}
      <section className="df-detector-zone">

        <div className="df-detector-header">
          <h2>AI Media Analysis</h2>
          <p>Upload a JPG, PNG, or WEBP image</p>
        </div>

        <div className="df-detector-content">

          <div className="df-controls">

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
              {loading
                ? "Scanning..."
                : "Start AI Analysis"}
            </button>

            {error && (
              <p className="df-error">{error}</p>
            )}

          </div>

          <div className="df-analysis-area">

            {preview ? (
              <img
                src={preview}
                alt="Preview"
              />
            ) : (
              <div className="df-placeholder">
                AI Analysis Output
              </div>
            )}

            {loading && (
              <div className="df-scan-line" />
            )}

            {result && (
              <div className="df-result-overlay">

                {result?.critical?.length > 0 && (
                  <h3 className="df-high">
                    ❌ High Risk: AI-generated image detected
                  </h3>
                )}

                {result?.suspect?.length > 0 &&
                  result?.critical?.length === 0 && (
                    <h3 className="df-medium">
                      ⚠️ Uncertain: Image authenticity
                      could not be confirmed
                    </h3>
                  )}

                {result?.benign?.length > 0 &&
                  result?.suspect?.length === 0 &&
                  result?.critical?.length === 0 && (
                    <h3 className="df-low">
                      ✅ Likely real image
                    </h3>
                  )}

                {/* DEBUG */}
                <pre
                  style={{
                    textAlign: "left",
                    marginTop: "10px",
                    fontSize: "12px",
                    overflow: "auto",
                    maxHeight: "200px",
                  }}
                >
                  {JSON.stringify(result, null, 2)}
                </pre>

              </div>
            )}

          </div>

        </div>

      </section>

      {/* VIDEO DETECTOR */}
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

      {result && (
        <section className="df-explain">
          <p className="df-note">
            ⚠️ This analysis is probabilistic and
            should be used as a decision-support tool.
          </p>
        </section>
      )}

    </div>
  );
}