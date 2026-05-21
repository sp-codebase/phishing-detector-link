const express = require("express");
const cors = require("cors");
const { spawn } = require("child_process");
const path = require("path");
require("dotenv").config();
const db = require("./sql/db");
const deepfakeRouter = require("./deepfake/node/deepfakedetector.js");

const app = express();
const PORT = process.env.PORT || 5001;

/* ======================= CORS ======================= */
app.use(cors({
  origin: "http://localhost:5173",
}));

/* ======================= BODY ======================= */
app.use(express.json());

/* ======================= ROUTES ======================= */

// ✅ Deepfake
app.use("/api/deepfake", deepfakeRouter);

// ✅ Health
app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

// ✅ Dashboard API
app.get("/api/dashboard", (req, res) => {
  console.log("🔥 Dashboard API HIT");

  db.query(
    "SELECT * FROM phishing_results ORDER BY created_at DESC LIMIT 10",
    (err, rows) => {
      if (err) {
        console.error("❌ DB Error:", err);
        return res.status(500).json({ error: err });
      }

      const total = rows.length;
      const phishing = rows.filter(r => r.prediction === "phishing").length;

      const recent = rows.map(r => ({
        id: r.id,
        type: "Phishing",
        result: r.prediction,
        confidence: Math.round((r.confidence || 0) * 100),
        time: r.created_at
      }));

      res.json({
        total,
        phishing,
        deepfake: 0,
        recent
      });
    }
  );
});

// ✅ Update API
app.put("/api/update/:id", (req, res) => {
  const { id } = req.params;
  const { prediction, is_correct } = req.body;

  db.query(
    "UPDATE phishing_results SET prediction=?, is_correct=? WHERE id=?",
    [prediction, is_correct, id],
    (err) => {
      if (err) {
        console.error("❌ Update Error:", err);
        return res.status(500).json({ error: err });
      }

      console.log("✅ Updated row:", id);
      res.json({ success: true });
    }
  );
});

/* ======================= ML ROUTE ======================= */
app.post("/api/predict-ml", (req, res) => {

  console.log("🔥 API HIT");   // ✅ HERE
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  console.log("🔍 URL:", url);  // ✅ HERE

  const pyScript = path.resolve(
    __dirname,
    "phishing",
    "python",
    "inspect_pipeline.py"
  );

  const pythonCmd = process.platform === "win32" ? "python" : "python3";

  const py = spawn(pythonCmd, ["-u", pyScript, url]);

  let output = "";
  let error = "";

  py.stdout.on("data", (data) => {
    output += data.toString();
  });

  py.stderr.on("data", (data) => {
    error += data.toString();
  });

  py.on("close", (code) => {

    console.log("🛑 Python exit:", code);   // ✅ HERE
    console.log("RAW OUTPUT:", output);     // ✅ VERY IMPORTANT

    if (code !== 0) {
      console.error("❌ Python Error:", error);
      return res.status(500).json({ error: "Python failed" });
    }

    let result;

    try {
      result = JSON.parse(output);
      console.log("✅ Parsed JSON:", result);   // ✅ HERE
    } catch (err) {
      console.error("❌ JSON parse error:", output);
      return res.status(500).json({ error: "Invalid ML Output" });
    }

    const prediction = result.prediction || "unknown";
    const confidence = result.confidence || 0;

    console.log("👉 Inserting:", url, prediction, confidence);  // ✅ HERE

    db.query(
      "INSERT INTO phishing_results (url, prediction, confidence) VALUES (?, ?, ?)",
      [url, prediction, confidence],
      (dbErr) => {
        if (dbErr) {
          console.error("❌ DB INSERT ERROR:", dbErr);   // ✅ HERE
          return res.status(500).json({ error: "DB insert failed" });
        }

        console.log("✅ Saved to DB");   // ✅ SUCCESS

        res.json({
          success: true,
          result,
        });
      }
    );
  });

});

      

/* ======================= START ======================= */

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);

  // ✅ Check DB connection
  db.query("SELECT DATABASE()", (err, result) => {
    if (err) {
      console.error("❌ DB connection failed");
    } else {
      console.log("✅ Connected to DB:", result[0]["DATABASE()"]);
    }
  });
});