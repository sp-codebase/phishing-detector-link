const express = require("express");
const cors = require("cors");
const { spawn } = require("child_process");

const app = express();
const PORT = 5000;

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"],
  credentials: true
}));

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

// users endpoint (dummy data)
app.get("/api/users", (req, res) => {
  res.json([
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" }
  ]);
});

// request logger (helpful for debugging)
app.use((req, res, next) => {
  console.log(new Date().toISOString(), req.method, req.url);
  next();
});

// ========================
// ML PREDICTION ENDPOINT
// ========================
app.post("/api/predict-ml", (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  // Use 'py' for Windows (works better than 'python')
  const py = spawn("py", ["-u", "ml_utils.py", url], {
    cwd: __dirname,
  });

  let output = "";
  let error = "";

  py.stdout.on("data", (data) => {
    output += data.toString();
  });

  py.stderr.on("data", (data) => {
    error += data.toString();
  });

  py.on("close", (code) => {
    if (code !== 0) {
      console.error(error);
      return res.status(500).json({ error: "ML script failed", details: error });
    }
    try {
      const result = JSON.parse(output);
      return res.json(result);
    } catch (err) {
      console.error("JSON parse error:", output);
      return res.status(500).json({ error: "Invalid ML output" });
    }
  });
});

// ========================
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
